<script lang="ts">
	import CalculatorForm from '$lib/components/calculator-form.svelte';
	import ResultsSummary from '$lib/components/results-summary.svelte';
	import AmortizationTable from '$lib/components/amortization-table.svelte';
	import ComparisonChart from '$lib/components/comparison-chart.svelte';
	import ExportButtons from '$lib/components/export-buttons.svelte';
	import AdInterstitial from '$lib/components/ads/ad-interstitial.svelte';
	import { allResultsStore, isMobile } from '$lib/stores/calculator-store';
	import type { AmortizationSystem } from '$lib/calculator/types';

	let showInterstitial = $state(false);
	let showResults = $state(false);
	let selectedSystem: AmortizationSystem = 'price';
	let previousResultHash = $state('');

	const systemLabels: Record<AmortizationSystem, string> = {
		price: 'PRICE',
		sac: 'SAC',
		sam: 'SAM',
		americano: 'Americano'
	};

	function selectSystem(sys: AmortizationSystem) {
		selectedSystem = sys;
	}

	$effect(() => {
		if ($allResultsStore.price) {
			const hash = $allResultsStore.price.totalPaid.toString();
			if (hash !== previousResultHash) {
				previousResultHash = hash;
				if ($isMobile) {
					showInterstitial = true;
					showResults = false;
				} else {
					showResults = true;
				}
			}
		}
	});

	function handleInterstitialClose() {
		showInterstitial = false;
		showResults = true;
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl sm:text-4xl font-bold">Calculadora de Financiamento</h1>
		<p class="text-lg text-muted-foreground mt-2">
			Simule PRICE, SAC, SAM e Americano. Compare todos os sistemas ao mesmo tempo.
		</p>
	</div>

	<div class="flex flex-col sm:flex-col-reverse gap-6 sm:gap-8">
		{#if $allResultsStore.price && showResults}
			<div class="space-y-6 order-first sm:order-last">
				<ResultsSummary />

				<ComparisonChart />

				<div>
					<h2 class="text-xl font-semibold mb-3">Ver tabela de amortização</h2>
					<div class="flex flex-wrap gap-2">
						{#each Object.entries(systemLabels) as [key, label]}
							<button
								class="px-4 py-2.5 text-base rounded-lg border transition-colors {selectedSystem === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-accent'}"
								onclick={() => selectSystem(key as AmortizationSystem)}
							>
								{label}
							</button>
						{/each}
					</div>
				</div>

				{#key selectedSystem}
					<AmortizationTable system={selectedSystem} />
				{/key}

				<ExportButtons selectedSystem={selectedSystem} />
			</div>
		{/if}

		<div class="order-last sm:order-first">
			<CalculatorForm />
		</div>
	</div>
</div>

<AdInterstitial open={showInterstitial} onclose={handleInterstitialClose} />