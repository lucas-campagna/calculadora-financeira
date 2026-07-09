<script lang="ts">
  import { onMount } from "svelte";
  import {
    allResultsStore,
    studiesStore,
    isMobile,
    isDesktop,
  } from "$lib/stores/calculator-store";
  import type { Installment } from "$lib/calculator/types";

  let canvasEl: HTMLCanvasElement = $state(
    undefined as unknown as HTMLCanvasElement,
  );
  let chartInstance: InstanceType<typeof import("chart.js").Chart> | null =
    $state(null);
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let hasMoved = false;
  let longPressTriggered = false;
  let selectedMonth = $state<number | null>(null);

  let {
    onlongpress = (_month: number) => {},
    fullHeight = false,
  }: {
    onlongpress?: (month: number) => void;
    fullHeight?: boolean;
  } = $props();

  let selectedField = $state<"payment" | "principal" | "interest" | "balance">(
    "balance",
  );

  const FIELDS: {
    key: "payment" | "principal" | "interest" | "balance";
    label: string;
  }[] = [
    { key: "balance", label: "Saldo" },
    { key: "payment", label: "Parcela" },
    { key: "principal", label: "Amort." },
    { key: "interest", label: "Juros" },
  ];

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#ec4899",
    "#f97316",
    "#06b6d4",
    "#ef4444",
  ];

  async function renderChart() {
    const studies = $studiesStore.studies;
    const firstResult = $allResultsStore[studies[0]?.id];
    if (!firstResult) return;

    const { Chart, registerables } = await import("chart.js");
    Chart.register(...registerables);

    if (chartInstance) {
      chartInstance.destroy();
    }

    const maxLen = Math.max(
      ...studies.map((s) => $allResultsStore[s.id]?.installments?.length ?? 0),
    );
    const showEvery = maxLen > 60 ? Math.ceil(maxLen / 30) : 1;

    const labels: string[] = [];
    for (let i = 1; i <= maxLen; i++) {
      if (i % showEvery === 0 || i === 1 || i === maxLen) {
        labels.push(`${i}`);
      }
    }

    const datasets: import("chart.js").ChartDataset[] = [];
    studies.forEach((study, i) => {
      const result = $allResultsStore[study.id];
      if (!result) return;
      const filtered = result.installments.filter(
        (_: Installment, idx: number) =>
          idx % showEvery === 0 ||
          idx === 0 ||
          idx === result.installments.length - 1,
      );
      datasets.push({
        label: study.name,
        data: filtered.map((inst: Installment) => inst[selectedField]),
        borderColor: COLORS[i % COLORS.length],
        backgroundColor: COLORS[i % COLORS.length] + "20",
        fill: false,
        tension: 0.1,
      });
    });

    const drawVerticalLinePlugin = {
      id: "verticalLine",
      afterDraw: (chart: import("chart.js").Chart) => {
        if (selectedMonth === null) return;
        const ctx = chart.ctx;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        const labels = chart.data.labels ?? [];
        let closestIdx = 0;
        let minDiff = Infinity;
        labels.forEach((label, i) => {
          const diff = Math.abs(Number(label) - selectedMonth);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        });
        const pixelX = xScale.getPixelForValue(closestIdx);
        ctx.save();
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pixelX, yScale.top);
        ctx.lineTo(pixelX, yScale.bottom);
        ctx.stroke();
        ctx.restore();
      },
    };

    chartInstance = new Chart(canvasEl, {
      type: "line",
      data: { labels, datasets },
      plugins: [drawVerticalLinePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            bodyFont: { size: 11 },
            callbacks: {
              title: (items: import("chart.js").TooltipItem<"line">[]) => {
                if (!items.length) return "";
                const month = Number(items[0].label);
                if (month <= 12) return `${month}M`;
                const years = Math.floor(month / 12);
                const months = month % 12;
                if (months === 0) return `${years}A`;
                return `${years}A ${months}M`;
              },
              label: (ctx: import("chart.js").TooltipItem<"line">) => {
                const val = ctx.parsed.y ?? 0;
                return `${ctx.dataset.label}: R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: { size: 10 },
              callback: (value: string | number, index: number) => {
                const label = labels[index];
                if (!label) return "";
                const month = Number(label);
                if (month <= 12) return `${month}M`;
                const years = Math.floor(month / 12);
                const months = month % 12;
                if (months === 0) return `${years}A`;
                return `${years}A ${months}M`;
              },
            },
          },
          y: {
            min: 0,
            ticks: {
              callback: (value: string | number) => {
                const n = Number(value);
                const suffixes = ["", "k", "M", "B", "T", "Q"];
                let suffixIndex = 0;
                let val = n;
                while (val >= 1000 && suffixIndex < suffixes.length - 1) {
                  val /= 1000;
                  suffixIndex++;
                }
                if (val >= 100)
                  return `${val.toFixed(0)}${suffixes[suffixIndex]}`;
                if (val >= 10)
                  return `${val.toFixed(1)}${suffixes[suffixIndex]}`;
                return `${val.toFixed(2)}${suffixes[suffixIndex]}`;
              },
              font: { size: 10 },
            },
          },
        },
      },
    });
  }

  function getMonthFromPosition(clientX: number): number | null {
    if (!chartInstance) return null;
    const canvas = chartInstance.canvas;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const xScale = chartInstance.scales.x;
    if (!xScale) return null;

    const studies = $studiesStore.studies;
    const firstResult = $allResultsStore[studies[0]?.id];
    if (!firstResult) return null;
    const maxLen = firstResult.installments.length;
    if (maxLen === 0) return null;

    const showEvery = maxLen > 60 ? Math.ceil(maxLen / 30) : 1;
    const labelIndex = Math.round(xScale.getValueForPixel(x) ?? 0);
    const month = labelIndex * showEvery + 1;
    return Math.max(1, Math.min(month, maxLen));
  }

  function handleCanvasTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    hasMoved = false;
    longPressTriggered = false;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      const month = getMonthFromPosition(touchStartX);
      if (month !== null) {
        selectedMonth = month;
      }
    }, 600);
  }

  function handleCanvasTouchMove(e: TouchEvent) {
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > 10 || dy > 10) {
      hasMoved = true;
      if (longPressTimer && !longPressTriggered) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }
    if (longPressTriggered) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const month = getMonthFromPosition(e.touches[0].clientX);
      if (month !== null) {
        selectedMonth = month;
      }
    }
  }

  function handleCanvasTouchEnd(e: TouchEvent) {
    if (longPressTriggered) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    if (!hasMoved && !longPressTriggered) {
      const month = getMonthFromPosition(touchStartX);
      console.log("tap toggle", {
        month,
        selectedMonth,
        match: selectedMonth === month,
      });
      if (month !== null) {
        if (selectedMonth === month) {
          selectedMonth = null;
        } else {
          selectedMonth = month;
        }
      }
    }
    if (longPressTriggered && selectedMonth !== null) {
      onlongpress(selectedMonth);
    }
    longPressTriggered = false;
    hasMoved = false;
  }

  function handleCanvasClick(e: MouseEvent) {
    const month = getMonthFromPosition(e.clientX);
    if (month === null) return;
    if (selectedMonth === month) {
      selectedMonth = null;
    } else {
      selectedMonth = month;
    }
  }

  $effect(() => {
    if (
      $studiesStore.studies.length > 0 &&
      canvasEl &&
      Object.keys($allResultsStore).length > 0 &&
      selectedField
    ) {
      renderChart();
    }
  });

  $effect(() => {
    if (selectedMonth !== null && chartInstance) {
      chartInstance.update("none");
    }
  });

  let chartContainerEl: HTMLDivElement = $state();

  onMount(() => {
    const container = chartContainerEl;
    if (container) {
      container.addEventListener("touchstart", handleCanvasTouchStart, {
        passive: false,
      });
      container.addEventListener("touchmove", handleCanvasTouchMove, {
        passive: false,
      });
      container.addEventListener("touchend", handleCanvasTouchEnd, {
        passive: false,
      });
      container.addEventListener("touchcancel", handleCanvasTouchEnd, {
        passive: false,
      });
    }
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      if (container) {
        container.removeEventListener("touchstart", handleCanvasTouchStart);
        container.removeEventListener("touchmove", handleCanvasTouchMove);
        container.removeEventListener("touchend", handleCanvasTouchEnd);
        container.removeEventListener("touchcancel", handleCanvasTouchEnd);
      }
    };
  });
</script>

{#snippet selectChartType(show: boolean)}
  {#if show}
    <div class="flex items-center justify-between mb-2">
      <div class="flex rounded-md border overflow-hidden">
        {#each FIELDS as f}
          <button
            class="px-2 py-1 text-xs font-medium transition-colors {selectedField ===
            f.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-background'}"
            onclick={() => (selectedField = f.key)}
          >
            {f.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
{/snippet}

{#if Object.keys($allResultsStore).length > 0}
  <div
    class="p-2 sm:p-4 {fullHeight ? 'flex flex-col' : ''}"
    style={fullHeight ? "height: 100%" : ""}
  >
    {@render selectChartType($isDesktop)}
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xs font-semibold">
        Evolução {selectedField === "balance"
          ? "do Saldo"
          : selectedField === "payment"
            ? "da Parcela"
            : selectedField === "principal"
              ? "da Amortização"
              : "dos Juros"} (R$)
      </h2>
      <p class="text-xs text-muted-foreground mt-1">
        Segure e solte no gráfico para adicionar pagamento extra.
      </p>
    </div>
    <div
      bind:this={chartContainerEl}
      class={fullHeight ? "flex-1 min-h-0" : "h-56 sm:h-80"}
      role="img"
      aria-label="Gráfico de evolucao do saldo devedor"
      style="touch-action: none;"
      onclick={handleCanvasClick}
    >
      <canvas bind:this={canvasEl}></canvas>
    </div>
    {@render selectChartType($isMobile)}
  </div>
{/if}
