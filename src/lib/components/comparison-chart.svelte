<script lang="ts">
	import { onMount } from 'svelte';
	import { allResultsStore, studiesStore } from '$lib/stores/calculator-store';
	import type { Installment } from '$lib/calculator/types';

	let canvasEl: HTMLCanvasElement = $state(undefined as unknown as HTMLCanvasElement);
	let chartInstance: InstanceType<typeof import('chart.js').Chart> | null = $state(null);
	let longPressTimer: ReturnType<typeof setTimeout> | null = null;
	let touchStartX = 0;
	let touchStartY = 0;
	let hasMoved = false;

	let {
		onlongpress = (_month: number) => {},
		fullHeight = false
	}: {
		onlongpress?: (month: number) => void;
		fullHeight?: boolean;
	} = $props();

	const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#f97316', '#06b6d4', '#ef4444'];

	async function renderChart() {
		const studies = $studiesStore.studies;
		const firstResult = $allResultsStore[studies[0]?.id];
		if (!firstResult) return;

		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		if (chartInstance) {
			chartInstance.destroy();
		}

		const maxLen = Math.max(
			...studies.map((s) => $allResultsStore[s.id]?.installments?.length ?? 0)
		);
		const showEvery = maxLen > 60 ? Math.ceil(maxLen / 30) : 1;

		const labels: string[] = [];
		for (let i = 1; i <= maxLen; i++) {
			if (i % showEvery === 0 || i === 1 || i === maxLen) {
				labels.push(`${i}`);
			}
		}

		const datasets: import('chart.js').ChartDataset[] = [];
		studies.forEach((study, i) => {
			const result = $allResultsStore[study.id];
			if (!result) return;
			const filtered = result.installments.filter((_: Installment, idx: number) => idx % showEvery === 0 || idx === 0 || idx === result.installments.length - 1);
			datasets.push({
				label: study.name,
				data: filtered.map((inst: Installment) => inst.balance),
				borderColor: COLORS[i % COLORS.length],
				backgroundColor: COLORS[i % COLORS.length] + '20',
				fill: false,
				tension: 0.1
			});
		});

		chartInstance = new Chart(canvasEl, {
			type: 'line',
			data: { labels, datasets },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						bodyFont: { size: 11 },
						callbacks: {
							label: (ctx: import('chart.js').TooltipItem<'line'>) => {
								return `${ctx.dataset.label}: R$ ${(ctx.parsed.y ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
							}
						}
					}
				},
				scales: {
					x: {
						title: { display: true, text: 'Mês', font: { size: 11 } },
						ticks: { font: { size: 10 } }
					},
					y: {
						title: { display: true, text: 'Saldo (R$)', font: { size: 11 } },
						ticks: {
							callback: (value: string | number) => `R$ ${(Number(value) / 1000).toFixed(0)}k`,
							font: { size: 10 }
						}
					}
				}
			}
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
		longPressTimer = setTimeout(() => {
			if (hasMoved) return;
			const month = getMonthFromPosition(touchStartX);
			if (month !== null) {
				onlongpress(month);
			}
		}, 600);
	}

	function handleCanvasTouchMove(e: TouchEvent) {
		const dx = Math.abs(e.touches[0].clientX - touchStartX);
		const dy = Math.abs(e.touches[0].clientY - touchStartY);
		if (dx > 10 || dy > 10) {
			hasMoved = true;
			if (longPressTimer) {
				clearTimeout(longPressTimer);
				longPressTimer = null;
			}
		}
	}

	function handleCanvasTouchEnd() {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	$effect(() => {
		if ($studiesStore.studies.length > 0 && canvasEl && Object.keys($allResultsStore).length > 0) {
			renderChart();
		}
	});

	onMount(() => {
		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	});
</script>

{#if Object.keys($allResultsStore).length > 0}
	<div class="p-2 sm:p-4 {fullHeight ? 'flex flex-col' : ''}" style={fullHeight ? 'height: 100%' : ''}>
		<h2 class="text-xs font-semibold mb-1">Evolucao do Saldo Devedor</h2>
		<div class={fullHeight ? 'flex-1 min-h-0' : 'h-56 sm:h-80'} role="img" aria-label="Gráfico de evolucao do saldo devedor"
			ontouchstart={handleCanvasTouchStart}
			ontouchmove={handleCanvasTouchMove}
			ontouchend={handleCanvasTouchEnd}
			ontouchcancel={handleCanvasTouchEnd}
		>
			<canvas bind:this={canvasEl}></canvas>
		</div>
		<p class="text-xs text-muted-foreground mt-1">Segure no gráfico para adicionar pagamento extra.</p>
	</div>
{/if}
