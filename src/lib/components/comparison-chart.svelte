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

  let hasHeldChart = $state(
    typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("hasHeldChart") === "true",
  );

  let isDark = $state(false);

  function syncDarkMode() {
    isDark = document.documentElement.classList.contains("dark");
  }

  $effect(() => {
    if (typeof sessionStorage !== "undefined") {
      if (hasHeldChart) {
        sessionStorage.setItem("hasHeldChart", "true");
      } else {
        sessionStorage.removeItem("hasHeldChart");
      }
    }
  });

  onMount(() => {
    syncDarkMode();
    const observer = new MutationObserver(syncDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  });

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

  function tickColor(): string {
    return isDark ? "#aaa" : "#555";
  }

  function tickSelectedColor(): string {
    return isDark ? "#222" : "#eee";
  }

  function borderColor(): string {
    return isDark ? "#404040" : "#e0e0e0";
  }

  function gridColor(): string {
    return isDark ? "#303030" : "#e0e0e0";
  }

  function getTickColor(selectedMonth: number | null): string {
    if (selectedMonth === null) {
      return tickColor();
    }
    return tickSelectedColor();
  }

  function getBorderColor(): string {
    return borderColor();
  }

  async function renderChart() {
    const allStudies = $studiesStore.studies;
    const studies = allStudies.filter((s) => !s.disabled);
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
    studies.forEach((study) => {
      const result = $allResultsStore[study.id];
      if (!result) return;
      const originalIndex = allStudies.findIndex((s) => s.id === study.id);
      const filtered = result.installments.filter(
        (_: Installment, idx: number) =>
          idx % showEvery === 0 ||
          idx === 0 ||
          idx === result.installments.length - 1,
      );
      datasets.push({
        label: study.name,
        data: filtered.map((inst: Installment) => inst[selectedField]),
        borderColor: COLORS[originalIndex % COLORS.length],
        backgroundColor: COLORS[originalIndex % COLORS.length] + "20",
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
        const currentSelectedMonth = selectedMonth;
        let closestIdx = 0;
        let minDiff = Infinity;
        labels.forEach((label, i) => {
          const diff = Math.abs(Number(label) - currentSelectedMonth);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        });
        const pixelX = xScale.getPixelForValue(closestIdx);
        const leftEdge = xScale.getPixelForValue(xScale.min);
        ctx.save();
        ctx.strokeStyle = tickColor();
        ctx.fillStyle = tickColor();
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        let highestYPixel = yScale.bottom;
        chart.data.datasets.forEach((_dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.visible) return;
          const dataIndex = meta.data[closestIdx];
          if (!dataIndex) return;
          if (dataIndex.y < highestYPixel) {
            highestYPixel = dataIndex.y;
          }
          ctx.beginPath();
          ctx.moveTo(leftEdge, dataIndex.y);
          ctx.lineTo(pixelX, dataIndex.y);
          ctx.stroke();
        });
        ctx.beginPath();
        ctx.moveTo(pixelX, yScale.bottom);
        ctx.lineTo(pixelX, highestYPixel);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = "12px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const selectedLabel = labels[closestIdx];
        const month = Number(selectedLabel);
        let xAxisLabel = "";
        if (month <= 12) xAxisLabel = `${month}M`;
        else {
          const years = Math.floor(month / 12);
          const months = month % 12;
          if (months === 0) xAxisLabel = `${years}A`;
          else xAxisLabel = `${years}A ${months}M`;
        }
        ctx.fillText(xAxisLabel, pixelX, yScale.bottom + 14);
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.visible) return;
          const point = meta.data[closestIdx];
          if (!point) return;
          const val = dataset.data[closestIdx] as number;
          const suffixes = ["", "k", "M", "B", "T", "Q"];
          let suffixIndex = 0;
          let displayVal = val;
          while (displayVal >= 1000 && suffixIndex < suffixes.length - 1) {
            displayVal /= 1000;
            suffixIndex++;
          }
          let yAxisLabel: string;
          if (displayVal >= 100)
            yAxisLabel = `${displayVal.toFixed(0)}${suffixes[suffixIndex]}`;
          else if (displayVal >= 10)
            yAxisLabel = `${displayVal.toFixed(1)}${suffixes[suffixIndex]}`;
          else yAxisLabel = `${displayVal.toFixed(2)}${suffixes[suffixIndex]}`;
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText(yAxisLabel, leftEdge - 10, point.y);
        });
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
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            border: {
              // @ts-ignore
              color: () => getBorderColor(),
            },
            grid: {
              // display: false,
              color: () => gridColor(),
            },
            ticks: {
              color: () => getTickColor(selectedMonth),
              font: { size: 10 },
              callback: (_value: string | number, index: number) => {
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
            border: {
              // @ts-ignore
              color: () => getBorderColor(),
            },
            grid: {
              // display: false,
              color: () => gridColor(),
            },
            ticks: {
              color: () => getTickColor(selectedMonth),
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
      if (month !== null) {
        if (selectedMonth === month) {
          selectedMonth = null;
        } else {
          selectedMonth = month;
        }
      }
    }
    if (longPressTriggered && selectedMonth !== null) {
      hasHeldChart = true;
      onlongpress(selectedMonth);
    }
    longPressTriggered = false;
    hasMoved = false;
  }

  $effect(() => {
    void isDark;
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
    if (chartInstance) {
      let _ = selectedMonth;
      chartInstance.update("none");
    }
  });

  let chartContainerEl = $state<HTMLDivElement | undefined>();

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
      {#if !hasHeldChart}
        <p class="text-xs text-muted-foreground mt-1">
          Segure e solte no gráfico para adicionar pagamento extra.
        </p>
      {/if}
    </div>
    <div
      bind:this={chartContainerEl}
      class={fullHeight ? "flex-1 min-h-0" : "h-56 sm:h-80"}
      role="img"
      aria-label="Gráfico de evolucao do saldo devedor"
      style="touch-action: none;"
    >
      <canvas bind:this={canvasEl}></canvas>
    </div>
    {@render selectChartType($isMobile)}
  </div>
{/if}
