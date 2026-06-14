<script lang="ts">
	import CalculatorForm from '$lib/components/calculator-form.svelte';
	import ResultsSummary from '$lib/components/results-summary.svelte';
	import AmortizationTable from '$lib/components/amortization-table.svelte';
	import ComparisonChart from '$lib/components/comparison-chart.svelte';
	import ExportButtons from '$lib/components/export-buttons.svelte';
	import AdInterstitial from '$lib/components/ads/ad-interstitial.svelte';
	import ExtraPaymentModal from '$lib/components/extra-payment-modal.svelte';
	import { allResultsStore, isMobile } from '$lib/stores/calculator-store';
	import type { AmortizationSystem } from '$lib/calculator/types';

	let showInterstitial = $state(false);
	let showResults = $state(false);
	let selectedSystem: AmortizationSystem = 'price';
	let previousResultHash = $state('');
	let activeTab: 'chart' | 'table' = 'chart';
	let extraPaymentModalOpen = $state(false);
	let extraPaymentMonth = $state(1);

	let touchStartX = 0;

	const systemLabels: Record<AmortizationSystem, string> = {
		price: 'PRICE',
		sac: 'SAC',
		sam: 'SAM',
		americano: 'Americano'
	};

	function selectSystem(sys: AmortizationSystem) {
		selectedSystem = sys;
	}

	function openExtraPayment(month: number) {
		extraPaymentMonth = month;
		extraPaymentModalOpen = true;
	}

	function handleSwipeStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleSwipeEnd(e: TouchEvent) {
		const diff = touchStartX - e.changedTouches[0].clientX;
		if (Math.abs(diff) > 50) {
			if (diff < 0 && activeTab === 'table') {
				activeTab = 'chart';
			} else if (diff > 0 && activeTab === 'chart') {
				activeTab = 'table';
			}
		}
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
	<div class="mb-6">
		<h1 class="text-3xl sm:text-4xl font-bold">Calculadora de Financiamento</h1>
		<p class="text-lg text-muted-foreground mt-2">
			Simule PRICE, SAC, SAM e Americano. Compare todos os sistemas ao mesmo tempo.
		</p>
	</div>

	<CalculatorForm />

	{#if $allResultsStore.price && showResults}
		<div class="mt-6">
			<ResultsSummary />

			<!-- MOBILE: swipeable tabs -->
			<div class="sm:hidden">
				<div class="flex border-b mt-4">
					<button
						class="flex-1 py-3 text-base font-medium text-center transition-colors {activeTab === 'chart' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}"
						onclick={() => (activeTab = 'chart')}
					>
						Grafico
					</button>
					<button
						class="flex-1 py-3 text-base font-medium text-center transition-colors {activeTab === 'table' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}"
						onclick={() => (activeTab = 'table')}
					>
						Tabela
					</button>
				</div>

				<div
					ontouchstart={handleSwipeStart}
					ontouchend={handleSwipeEnd}
				>
					{#if activeTab === 'chart'}
						<div class="py-4">
							<ComparisonChart onlongpress={openExtraPayment} />
						</div>
					{:else}
						<div class="flex items-center gap-2 py-3 overflow-x-auto">
							{#each Object.entries(systemLabels) as [key, label]}
								<button
									class="px-3 py-2 text-sm rounded-lg border whitespace-nowrap transition-colors {selectedSystem === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-accent'}"
									onclick={() => selectSystem(key as AmortizationSystem)}
								>
									{label}
								</button>
							{/each}
						</div>
						<div class="overflow-y-auto" style="max-height: calc(100vh - 380px)">
							<AmortizationTable system={selectedSystem} onrowclick={openExtraPayment} />
						</div>
					{/if}
				</div>
			</div>

			<!-- DESKTOP -->
			<div class="hidden sm:block space-y-6">
				<ComparisonChart onlongpress={openExtraPayment} />

				<div>
					<h2 class="text-xl font-semibold mb-3">Ver tabela de amortizacao</h2>
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
					<AmortizationTable system={selectedSystem} onrowclick={openExtraPayment} />
				{/key}

				<ExportButtons selectedSystem={selectedSystem} />
			</div>
		</div>
	{/if}
</div>

{#if $allResultsStore.price && showResults && $isMobile}
	<div class="fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-30 sm:hidden">
		<ExportButtons selectedSystem={selectedSystem} />
	</div>
{/if}

<AdInterstitial open={showInterstitial} onclose={handleInterstitialClose} />

<ExtraPaymentModal bind:open={extraPaymentModalOpen} month={extraPaymentMonth} onclose={() => (extraPaymentModalOpen = false)} />