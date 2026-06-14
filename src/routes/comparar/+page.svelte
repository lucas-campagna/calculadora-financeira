<script lang="ts">
	import { onMount } from 'svelte';
	import { formatCurrency } from '$lib/calculator';
	import { allResultsStore, calculateAll } from '$lib/stores/calculator-store';
	import CalculatorForm from '$lib/components/calculator-form.svelte';
	import type { AmortizationSystem, FinancingResult } from '$lib/calculator/types';

	const systems: { key: AmortizationSystem; label: string }[] = [
		{ key: 'price', label: 'PRICE' },
		{ key: 'sac', label: 'SAC' },
		{ key: 'sam', label: 'SAM' },
		{ key: 'americano', label: 'Americano' }
	];

	function getEconomy(base: FinancingResult, compared: FinancingResult): { interest: number; percent: number } {
		const interest = base.totalInterest - compared.totalInterest;
		const percent = base.totalInterest > 0 ? (interest / base.totalInterest) * 100 : 0;
		return { interest, percent };
	}

	onMount(() => {
		calculateAll();
	});
</script>

<svelte:head>
	<title>Comparar Sistemas de Amortizacao — PRICE vs SAC vs SAM vs Americano</title>
	<meta name="description" content="Compare PRICE, SAC, SAM e Americano lado a lado. Veja qual sistema de amortizacao e mais vantajoso para o seu financiamento." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl sm:text-4xl font-bold">Comparar Sistemas</h1>
		<p class="text-lg text-muted-foreground mt-2">
			Compare PRICE, SAC, SAM e Americano lado a lado para o mesmo financiamento.
		</p>
	</div>

	<CalculatorForm />

	{#if $allResultsStore.price && $allResultsStore.sac && $allResultsStore.sam && $allResultsStore.americano}
		{@const priceResult = $allResultsStore.price!}
		{@const sacResult = $allResultsStore.sac!}
		{@const samResult = $allResultsStore.sam!}
		{@const americanoResult = $allResultsStore.americano!}

		<div class="mt-6 space-y-6">
			<div class="p-4 bg-muted rounded-lg">
				<h3 class="font-semibold mb-3 text-lg">Resumo Comparativo</h3>
				<div class="overflow-x-auto">
					<table class="w-full text-base border-collapse min-w-[600px]">
						<thead>
							<tr class="border-b bg-muted">
								<th class="px-3 py-2 text-left font-medium"></th>
								{#each systems as sys}
									{@const r = $allResultsStore[sys.key]}
									{#if r}
										<th class="px-3 py-2 text-center font-medium">{sys.label}</th>
									{/if}
								{/each}
							</tr>
						</thead>
						<tbody>
							<tr class="border-b">
								<td class="px-3 py-2 font-medium text-muted-foreground">Total Pago</td>
								<td class="px-3 py-2 text-right font-bold">{formatCurrency(priceResult.totalPaid)}</td>
								<td class="px-3 py-2 text-right font-bold">{formatCurrency(sacResult.totalPaid)}</td>
								<td class="px-3 py-2 text-right font-bold">{formatCurrency(samResult.totalPaid)}</td>
								<td class="px-3 py-2 text-right font-bold">{formatCurrency(americanoResult.totalPaid)}</td>
							</tr>
							<tr class="border-b">
								<td class="px-3 py-2 font-medium text-muted-foreground">Total Juros</td>
								<td class="px-3 py-2 text-right text-destructive font-bold">{formatCurrency(priceResult.totalInterest)}</td>
								<td class="px-3 py-2 text-right text-destructive font-bold">{formatCurrency(sacResult.totalInterest)}</td>
								<td class="px-3 py-2 text-right text-destructive font-bold">{formatCurrency(samResult.totalInterest)}</td>
								<td class="px-3 py-2 text-right text-destructive font-bold">{formatCurrency(americanoResult.totalInterest)}</td>
							</tr>
							<tr class="border-b">
								<td class="px-3 py-2 font-medium text-muted-foreground">1a Parcela</td>
								<td class="px-3 py-2 text-right">{formatCurrency(priceResult.firstInstallment)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(sacResult.firstInstallment)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(samResult.firstInstallment)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(americanoResult.firstInstallment)}</td>
							</tr>
							<tr class="border-b">
								<td class="px-3 py-2 font-medium text-muted-foreground">Ultima Parcela</td>
								<td class="px-3 py-2 text-right">{formatCurrency(priceResult.lastInstallment)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(sacResult.lastInstallment)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(samResult.lastInstallment)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(americanoResult.lastInstallment)}</td>
							</tr>
							<tr class="border-b">
								<td class="px-3 py-2 font-medium text-muted-foreground">Parcelas</td>
								<td class="px-3 py-2 text-right">{priceResult.installments.length}</td>
								<td class="px-3 py-2 text-right">{sacResult.installments.length}</td>
								<td class="px-3 py-2 text-right">{samResult.installments.length}</td>
								<td class="px-3 py-2 text-right">{americanoResult.installments.length}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="p-4 bg-muted rounded-lg">
				<h3 class="font-semibold mb-3 text-lg">Economia em Juros (em relacao ao PRICE)</h3>
				<div class="space-y-2 text-base">
					{#each systems.slice(1) as sys}
						{@const r = $allResultsStore[sys.key]}
						{#if r}
							{@const eco = getEconomy(priceResult, r)}
							<p>
								<strong>{sys.label}</strong>: economia de {formatCurrency(eco.interest)} em juros ({eco.percent.toFixed(1)}% a menos)
							</p>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>