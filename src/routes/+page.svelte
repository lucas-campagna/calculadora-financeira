<script lang="ts">
	import CalculatorForm from '$lib/components/calculator-form.svelte';
	import ResultsSummary from '$lib/components/results-summary.svelte';
	import AmortizationTable from '$lib/components/amortization-table.svelte';
	import ComparisonChart from '$lib/components/comparison-chart.svelte';
	import ExportButtons from '$lib/components/export-buttons.svelte';
	import AdInterstitial from '$lib/components/ads/ad-interstitial.svelte';
	import { resultStore, calculatorStore, isMobile } from '$lib/stores/calculator-store';

	let showInterstitial = $state(false);
	let showResults = $state(false);

	let previousResult = $state<ReturnType<typeof import('$lib/calculator').calculate> | null>(null);

	$effect(() => {
		if ($resultStore && $resultStore !== previousResult) {
			previousResult = $resultStore;
			if ($isMobile) {
				showInterstitial = true;
				showResults = false;
			} else {
				showResults = true;
			}
		}
	});

	function handleInterstitialClose() {
		showInterstitial = false;
		showResults = true;
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl sm:text-3xl font-bold">Calculadora de Financiamento</h1>
		<p class="text-muted-foreground mt-1">
			Simule PRICE, SAC, SAM e Americano. Compare sistemas e veja a tabela completa de amortização.
		</p>
	</div>

	<CalculatorForm />

	{#if $resultStore && showResults}
		<div class="mt-6 space-y-6">
			<ResultsSummary />
			<ComparisonChart />
			<ExportButtons />
			<AmortizationTable />
		</div>
	{/if}
</div>

<AdInterstitial open={showInterstitial} onclose={handleInterstitialClose} />