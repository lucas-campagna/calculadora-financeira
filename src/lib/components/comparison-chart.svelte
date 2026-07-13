<script lang="ts">
  import { onMount } from "svelte";
  import {
    allResultsStore,
    studiesStore,
    isMobile,
    isDesktop,
  } from "$lib/stores/calculator-store";
  import type { Installment, ExtraPayment } from "$lib/calculator/types";

  let canvasEl: HTMLCanvasElement = $state(
    undefined as unknown as HTMLCanvasElement,
  );
  let chartInstance: InstanceType<typeof import("chart.js").Chart> | null =
    $state(null);
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let hasMoved = false;
  let longPressTriggered = false;
  let selectedMonth = $state<number | null>(null);
  let selectedStudyId = $state<string | null>(null);

  let hasSelectedData = $state(
    typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("hasSelectedData") === "true",
  );

  let isDark = $state(false);

  function syncDarkMode() {
    isDark = document.documentElement.classList.contains("dark");
  }

  $effect(() => {
    if (typeof sessionStorage !== "undefined") {
      if (hasSelectedData) {
        sessionStorage.setItem("hasSelectedData", "true");
      } else {
        sessionStorage.removeItem("hasSelectedData");
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
    onselectdata: onselectdata = (_month: number, _studyId: string) => {},
    fullHeight = false,
  }: {
    onselectdata?: (month: number, studyId: string) => void;
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

    const allExtraIndices = new Set<number>();
    studies.forEach((study) => {
      study.extraPayments.forEach((ep: ExtraPayment) => {
        allExtraIndices.add(ep.month - 1);
      });
    });

    const allIndices = new Set<number>();
    for (let i = 0; i < maxLen; i++) {
      if (i === 0 || i === maxLen - 1 || i % showEvery === 0) {
        allIndices.add(i);
      }
    }
    allExtraIndices.forEach((idx) => allIndices.add(idx));
    const sortedIndices = [...allIndices].sort((a, b) => a - b);
    const labels = sortedIndices.map((i) => `${i + 1}`);

    const datasets: import("chart.js").ChartDataset[] = [];
    studies.forEach((study) => {
      const result = $allResultsStore[study.id];
      if (!result) return;
      const originalIndex = allStudies.findIndex((s) => s.id === study.id);

      const data = sortedIndices
        .filter((idx) => idx < result.installments.length)
        .map((idx) => {
          const inst = result.installments[idx];
          return inst
            ? { x: idx + 1, y: inst[selectedField], studyId: study.id }
            : null;
        })
        .filter(
          (d): d is { x: number; y: number; studyId: string } => d !== null,
        );

      datasets.push({
        label: study.name,
        data,
        borderColor: study.color ?? COLORS[originalIndex % COLORS.length],
        backgroundColor:
          (study.color ?? COLORS[originalIndex % COLORS.length]) + "20",
        fill: false,
        tension: 0.1,
        spanGaps: true,
      });
    });

    const drawVerticalLinePlugin = {
      id: "verticalLine",
      afterDraw: (chart: import("chart.js").Chart) => {
        if (selectedMonth === null) return;
        const ctx = chart.ctx;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        const currentSelectedMonth = selectedMonth;
        const leftEdge = xScale.getPixelForValue(xScale.min);

        let minDist = Infinity;
        let nearestX = 0;
        let nearestY = 0;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.visible) return;
          const data = dataset.data as any[];
          data.forEach((p: any) => {
            if (!p) return;
            const dist = Math.abs(p.x - currentSelectedMonth);
            if (dist < minDist) {
              minDist = dist;
              nearestX = p.x;
              nearestY = p.y;
            }
          });
        });

        if (minDist === Infinity) return;

        const pointPixelX = xScale.getPixelForValue(nearestX);

        ctx.save();
        ctx.strokeStyle = tickColor();
        ctx.fillStyle = tickColor();
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        let highestYPixel = yScale.bottom;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.visible) return;
          const data = dataset.data as any[];
          const point = data.find(
            (p: any) => p && Math.abs(p.x - nearestX) < 5,
          );
          if (point) {
            const pY = yScale.getPixelForValue(point.y);
            if (pY < highestYPixel) highestYPixel = pY;
            ctx.beginPath();
            ctx.moveTo(leftEdge, pY);
            ctx.lineTo(pointPixelX, pY);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.moveTo(pointPixelX, yScale.bottom);
        ctx.lineTo(pointPixelX, highestYPixel);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = "12px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const month = Math.round(nearestX);
        let xAxisLabel = "";
        if (month <= 12) xAxisLabel = `${month}M`;
        else {
          const years = Math.floor(month / 12);
          const months = month % 12;
          if (months === 0) xAxisLabel = `${years}A`;
          else xAxisLabel = `${years}A ${months}M`;
        }
        ctx.fillText(xAxisLabel, pointPixelX, yScale.bottom + 10);

        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.visible) return;
          const data = dataset.data as any[];
          const point = data.find(
            (p: any) => p && Math.abs(p.x - nearestX) < 5,
          );
          if (point) {
            const pY = yScale.getPixelForValue(point.y);
            const suffixes = ["", "k", "M", "B", "T", "Q"];
            let suffixIndex = 0;
            let displayVal = point.y;
            while (displayVal >= 1000 && suffixIndex < suffixes.length - 1) {
              displayVal /= 1000;
              suffixIndex++;
            }
            let yAxisLabel: string;
            if (displayVal >= 100)
              yAxisLabel = `${displayVal.toFixed(0)}${suffixes[suffixIndex]}`;
            else if (displayVal >= 10)
              yAxisLabel = `${displayVal.toFixed(1)}${suffixes[suffixIndex]}`;
            else
              yAxisLabel = `${displayVal.toFixed(2)}${suffixes[suffixIndex]}`;
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(yAxisLabel, leftEdge - 10, pY);
          }
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
            type: "linear",
            min: 1,
            max: maxLen,
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
              callback: (value: string | number) => {
                const month = Number(value);
                if (!Number.isInteger(month)) return "";
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

    const month = Math.round(xScale.getValueForPixel(x) ?? 0);
    return Math.max(1, Math.min(month, maxLen));
  }

  function getNearestDataPoint(
    clientX: number,
    clientY: number,
  ): { month: number; studyId: string | null } {
    if (!chartInstance) return { month: 1, studyId: null };
    const canvas = chartInstance.canvas;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const xScale = chartInstance.scales.x;
    const yScale = chartInstance.scales.y;
    if (!xScale || !yScale) return { month: 0, studyId: null };

    const currentMonth = xScale.getValueForPixel(x);
    if (currentMonth === null || currentMonth === undefined) {
      return { month: 1, studyId: null };
    }

    let nearestMonth = 1;
    let nearestStudyId: string | null = null;
    let minDistX = Infinity;
    let minDistY = Infinity;

    chartInstance.data.datasets.forEach((dataset) => {
      const data = dataset.data as any[];
      data.forEach((p) => {
        if (!p || !p.studyId) return;
        const pointPixelX = xScale.getPixelForValue(p.x);
        const pointPixelY = yScale.getPixelForValue(p.y);
        const distX = Math.abs(pointPixelX - x);
        const distY = Math.abs(pointPixelY - y);
        if (distX < minDistX) {
          minDistX = distX;
          nearestMonth = Math.round(p.x);
        }
        if (distY <= minDistY && distX + distY <= 25) {
          minDistY = distY;
          nearestStudyId = p.studyId;
        }
      });
    });

    return {
      month: nearestMonth,
      studyId: nearestStudyId,
    };
  }

  function handleCanvasTouchStart(e: TouchEvent) {
    touchEndX = touchStartX = e.touches[0].clientX;
    touchEndY = touchStartY = e.touches[0].clientY;
    hasMoved = false;
    longPressTriggered = false;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      const result = getNearestDataPoint(touchStartX, touchStartY);
      selectedMonth = result.month;
      selectedStudyId = result.studyId;
    }, 600);
  }

  function handleCanvasTouchMove(e: TouchEvent) {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
    const dx = Math.abs(touchEndX - touchStartX);
    const dy = Math.abs(touchEndY - touchStartY);
    if (dx > 0 || dy > 0) {
      hasMoved = true;
    }
    if (!hasMoved) return;
    if (longPressTriggered) {
      e.stopPropagation();
      e.preventDefault();
      const result = getNearestDataPoint(touchEndX, touchEndY);
      selectedMonth = result.month;
      selectedStudyId = result.studyId;
    } else if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handleCanvasTouchEnd(e: TouchEvent) {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    if (hasMoved && !longPressTriggered) {
      return;
    }
    const result = getNearestDataPoint(touchEndX, touchEndY);
    if (result.month == selectedMonth && !hasMoved && !longPressTriggered) {
      selectedMonth = null;
      selectedStudyId = null;
      longPressTriggered = false;
      hasMoved = false;
      return;
    }
    selectedMonth = result.month;
    selectedStudyId = result.studyId;
    if (selectedStudyId && (!longPressTriggered || !hasMoved)) {
      hasSelectedData = true;
      onselectdata(selectedMonth, selectedStudyId);
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
      chartInstance.update();
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
    <div
      class="flex items-center justify-between"
      class:mt-2={$isMobile}
      class:mb-2={$isDesktop}
    >
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
    class="p-2 {fullHeight ? 'flex flex-col' : ''}"
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
      {#if !hasSelectedData}
        <p class="text-xs text-muted-foreground mt-1">
          Clique em um ponto do gráfico para adicionar pagamento extra.
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
