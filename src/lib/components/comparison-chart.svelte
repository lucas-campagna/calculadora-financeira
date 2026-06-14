<script lang="ts">
	import { onMount } from 'svelte';
	import { allResultsStore } from '$lib/stores/calculator-store';
	import type { Installment } from '$lib/calculator/types';

	let canvasEl: HTMLCanvasElement = $state(undefined as unknown as HTMLCanvasElement);
	let chartInstance: InstanceType<typeof import('chart.js').Chart> | null = $state(null);
	let longPressTimer: ReturnType<typeof setTimeout> | null = null;

	let {
		onlongpress = (_month: number) => {}
	}: {
		onlongpress?: (month: number) => void;
	} = $props();

	async function renderChart() {
		if (!$allResultsStore.price) return;

		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		if (chartInstance) {
			chartInstance.destroy();
		}

		const datasets: import('chart.js').ChartDataset[] = [];
		const colors: Record<string, { border: string; bg: string }> = {
			price: { border: '#3b82f6', bg: '#3b82f620' },
			sac: { border: '#22c55e', bg: '#22c55e20' },
			sam: { border: '#eab308', bg: '#eab30820' },
			americano: { border: '#a855f7', bg: '#a855f720' }
		};

		const maxLen = Math.max(
			$allResultsStore.price?.installments.length ?? 0,
			$allResultsStore.sac?.installments.length ?? 0,
			$allResultsStore.sam?.installments.length ?? 0,
			$allResultsStore.americano?.installments.length ?? 0
		);
		const showEvery = maxLen > 60 ? Math.ceil(maxLen / 30) : 1;

		const labels: string[] = [];
		for (let i = 1; i <= maxLen; i++) {
			if (i % showEvery === 0 || i === 1 || i === maxLen) {
				labels.push(`${i}`);
			}
		}

		const systems: { key: 'price' | 'sac' | 'sam' | 'americano'; label: string }[] = [
			{ key: 'price', label: 'PRICE' },
			{ key: 'sac', label: 'SAC' },
			{ key: 'sam', label: 'SAM' },
			{ key: 'americano', label: 'Americano' }
		];

		for (const sys of systems) {
			const result = $allResultsStore[sys.key];
			if (!result) continue;
			const filtered = result.installments.filter((_: Installment, i: number) => i % showEvery === 0 || i === 0 || i === result.installments.length - 1);
			datasets.push({
				label: sys.label,
				data: filtered.map((i: Installment) => i.balance),
				borderColor: colors[sys.key].border,
				backgroundColor: colors[sys.key].bg,
				fill: false,
				tension: 0.1
			});
		}

		chartInstance = new Chart(canvasEl, {
			type: 'line',
			data: { labels, datasets },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'top',
						labels: { font: { size: 14 } }
					},
					tooltip: {
						callbacks: {
							label: (ctx: import('chart.js').TooltipItem<'line'>) => {
								return `${ctx.dataset.label}: R$ ${(ctx.parsed.y ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
							}
						}
					}
				},
				scales: {
					x: {
						title: { display: true, text: 'Mes', font: { size: 14 } },
						ticks: { font: { size: 12 } }
					},
					y: {
						title: { display: true, text: 'Saldo (R$)', font: { size: 14 } },
						ticks: {
							callback: (value: string | number) => `R$ ${(Number(value) / 1000).toFixed(0)}k`,
							font: { size: 12 }
						}
					}
				}
			}
		});
	}

	function handleCanvasTouchStart() {
		longPressTimer = setTimeout(() => {
			if (chartInstance && canvasEl) {
				const activeElements = chartInstance.getActiveElements();
				if (activeElements.length > 0) {
					const idx = activeElements[0].index;
					const results = Object.values($allResultsStore) as (import('$lib/calculator/types').FinancingResult | null)[];
					const maxLen = Math.max(...results.map((r) => r?.installments?.length ?? 0));
					const showEvery = maxLen > 60
						? Math.ceil(maxLen / 30) : 1;
					const month = idx * showEvery + 1;
					onlongpress(month);
				}
			}
		}, 600);
	}

	function handleCanvasTouchEnd() {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	$effect(() => {
		if ($allResultsStore.price && canvasEl) {
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

{#if $allResultsStore.price}
	<div class="border rounded-lg p-3 sm:p-4">
		<h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Evolucao do Saldo Devedor</h2>
		<p class="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Clique na legenda para mostrar/ocultar. Segure no grafico para adicionar pagamento extra.</p>
		<div class="h-56 sm:h-80"
			ontouchstart={handleCanvasTouchStart}
			ontouchend={handleCanvasTouchEnd}
			ontouchcancel={handleCanvasTouchEnd}
		>
			<canvas bind:this={canvasEl}></canvas>
		</div>
	</div>
{/if}