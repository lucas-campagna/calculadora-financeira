<script lang="ts">
	import { onMount } from 'svelte';
	import { calculate } from '$lib/calculator';
	import type { FinancingResult } from '$lib/calculator/types';
	import { resultStore, calculatorStore } from '$lib/stores/calculator-store';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';

	let canvasEl: HTMLCanvasElement = $state(undefined as unknown as HTMLCanvasElement);
	let chartInstance: any = $state(null);

	async function renderChart() {
		if (!$resultStore) return;

		const principal = parseFloat($calculatorStore.principal) || 0;
		const annualRate = parseFloat($calculatorStore.annualRate) || 0;
		const termMonths = parseInt($calculatorStore.termMonths) || 0;
		const downPayment = parseFloat($calculatorStore.downPayment) || 0;

		if (principal <= 0 || annualRate <= 0 || termMonths <= 0) return;

		const input = {
			type: $calculatorStore.type,
			principal,
			annualRate,
			termMonths,
			downPayment: downPayment > 0 ? downPayment : undefined,
			extraPayments: $calculatorStore.extraPayments
		};

		const priceResult = calculate({ ...input, system: 'price' });
		const sacResult = calculate({ ...input, system: 'sac' });

		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		if (chartInstance) {
			chartInstance.destroy();
		}

		const maxInstallments = Math.max(
			priceResult.installments.length,
			sacResult.installments.length
		);
		const showEvery = maxInstallments > 60 ? Math.ceil(maxInstallments / 30) : 1;
		const labels = Array.from({ length: Math.ceil(maxInstallments / showEvery) }, (_, i) => `${(i + 1) * showEvery}`);

		chartInstance = new Chart(canvasEl, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'PRICE — Saldo',
						data: priceResult.installments
							.filter((_, i) => i % showEvery === 0)
							.map((i) => i.balance),
						borderColor: '#3b82f6',
						backgroundColor: '#3b82f620',
						fill: false,
						tension: 0.1
					},
					{
						label: 'SAC — Saldo',
						data: sacResult.installments
							.filter((_, i) => i % showEvery === 0)
							.map((i) => i.balance),
						borderColor: '#22c55e',
						backgroundColor: '#22c55e20',
						fill: false,
						tension: 0.1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'top'
					},
					tooltip: {
						callbacks: {
							label: (ctx: any) => {
								return `${ctx.dataset.label}: R$ ${ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
							}
						}
					}
				},
				scales: {
					x: {
						title: { display: true, text: 'Mês' }
					},
					y: {
						title: { display: true, text: 'Saldo (R$)' },
						ticks: {
							callback: (value: any) =>
								`R$ ${(value / 1000).toFixed(0)}k`
						}
					}
				}
			}
		});
	}

	$effect(() => {
		if ($resultStore && canvasEl) {
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

{#if $resultStore}
	<Card>
		<CardHeader>
			<CardTitle>Comparação PRICE × SAC</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="h-64 sm:h-80">
				<canvas bind:this={canvasEl}></canvas>
			</div>
		</CardContent>
	</Card>
{/if}