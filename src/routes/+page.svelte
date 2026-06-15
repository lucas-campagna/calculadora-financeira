<script lang="ts">
	import { onMount } from 'svelte';
	import CalculatorForm from '$lib/components/calculator-form.svelte';
	import ResultsSummary from '$lib/components/results-summary.svelte';
	import AmortizationTable from '$lib/components/amortization-table.svelte';
	import ComparisonChart from '$lib/components/comparison-chart.svelte';
	import ExportButtons from '$lib/components/export-buttons.svelte';
	import AdInterstitial from '$lib/components/ads/ad-interstitial.svelte';
	import ExtraPaymentModal from '$lib/components/extra-payment-modal.svelte';
	import { allResultsStore, isMobile, calculateAll } from '$lib/stores/calculator-store';
	import type { AmortizationSystem } from '$lib/calculator/types';

	let selectedSystem: AmortizationSystem = $state('price');
	let extraPaymentModalOpen = $state(false);
	let extraPaymentMonth = $state(1);
	let showInterstitial = $state(false);
	let showResults = $state(false);
	let previousResultHash = $state('');
	let userHasInteracted = $state(false);
	let lastInterstitialTime = 0;
	const INTERSTITIAL_COOLDOWN_MS = 5 * 60 * 1000;

	const SLIDES = ['form', 'chart', 'results', 'table'] as const;
	type SlideKey = typeof SLIDES[number];
	const N = SLIDES.length;

	let realIndex = $state<number>($isMobile && showResults ? 1 : 0);
	let carouselIndex = $state<number>($isMobile && showResults ? 2 : 1);
	let swipeContainerEl: HTMLElement | undefined = $state(undefined);
	let touchStartX = 0;
	let touchStartY = 0;
	let isDragging = false;
	let dragDelta = $state(0);
	let animating = $state(true);

	const systemLabels: Record<AmortizationSystem, string> = {
		price: 'PRICE',
		sac: 'SAC',
		sam: 'SAM',
		americano: 'Americano'
	};

	const slideLabels: Record<SlideKey, string> = {
		form: 'Simular',
		chart: 'Grafico',
		results: 'Resultado',
		table: 'Tabela'
	};

	function selectSystem(sys: AmortizationSystem) {
		selectedSystem = sys;
	}

	function openExtraPayment(month: number) {
		extraPaymentMonth = month;
		extraPaymentModalOpen = true;
	}

	function syncRealIndex() {
		realIndex = ((carouselIndex - 1) % N + N) % N;
	}

	function goToSlide(index: number) {
		animating = true;
		carouselIndex = index + 1;
		dragDelta = 0;
		syncRealIndex();
	}

	function handleTransitionEnd() {
		if (carouselIndex === 0) {
			animating = false;
			carouselIndex = N;
			syncRealIndex();
		} else if (carouselIndex === N + 1) {
			animating = false;
			carouselIndex = 1;
			syncRealIndex();
		}
	}

	function handleSwipeStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		isDragging = true;
		animating = false;
	}

	function handleSwipeMove(e: TouchEvent) {
		if (!isDragging) return;
		const dx = e.touches[0].clientX - touchStartX;
		const dy = Math.abs(e.touches[0].clientY - touchStartY);
		if (Math.abs(dx) > dy && Math.abs(dx) > 5) {
			e.preventDefault();
			dragDelta = dx;
		}
	}

	function handleSwipeEnd(e: TouchEvent) {
		if (!isDragging) return;
		isDragging = false;
		const diff = touchStartX - e.changedTouches[0].clientX;
		animating = true;

		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				carouselIndex++;
			} else {
				carouselIndex--;
			}
		}
		dragDelta = 0;
		syncRealIndex();
	}

	$effect(() => {
		if ($allResultsStore.price) {
			const hash = $allResultsStore.price.totalPaid.toString();
			if (hash !== previousResultHash) {
				previousResultHash = hash;
				if (userHasInteracted && $isMobile) {
					const now = Date.now();
					if (lastInterstitialTime === 0 || now - lastInterstitialTime >= INTERSTITIAL_COOLDOWN_MS) {
						showInterstitial = true;
						showResults = false;
						lastInterstitialTime = now;
					} else {
						showResults = true;
					}
				} else {
					showResults = true;
					if ($isMobile) {
						animating = true;
						carouselIndex = 2;
						realIndex = 1;
						dragDelta = 0;
					}
				}
			}
		}
	});

	function handleInterstitialClose() {
		showInterstitial = false;
		showResults = true;
		if ($isMobile) {
			animating = true;
			carouselIndex = 2;
			realIndex = 1;
			dragDelta = 0;
		}
	}

	$effect(() => {
		if (!swipeContainerEl) return;
		const el = swipeContainerEl;
		el.addEventListener('touchstart', handleSwipeStart, { passive: true });
		el.addEventListener('touchmove', handleSwipeMove, { passive: false });
		el.addEventListener('touchend', handleSwipeEnd, { passive: true });
		el.addEventListener('touchcancel', handleSwipeEnd, { passive: true });
		return () => {
			el.removeEventListener('touchstart', handleSwipeStart);
			el.removeEventListener('touchmove', handleSwipeMove);
			el.removeEventListener('touchend', handleSwipeEnd);
			el.removeEventListener('touchcancel', handleSwipeEnd);
		};
	});

	onMount(() => {
		calculateAll();
	});
</script>

{#if $isMobile}
	<!-- MOBILE: full viewport carousel, no page scroll -->
	<div class="h-[calc(100dvh-3.5rem)] flex flex-col overflow-hidden">
		<div class="flex border-b shrink-0">
			{#each SLIDES as key, i}
				<button
					class="flex-1 py-2 text-sm font-medium text-center transition-colors {realIndex === i ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}"
					onclick={() => goToSlide(i)}
				>
					{slideLabels[key]}
				</button>
			{/each}
		</div>

		<div class="flex-1 min-h-0 overflow-hidden" bind:this={swipeContainerEl}>
			<div
				class="flex h-full {animating ? 'transition-transform duration-300 ease-in-out' : ''}"
				style="transform: translateX(calc(-{carouselIndex * 100}% + {dragDelta}px))"
				ontransitionend={handleTransitionEnd}
			>
				<!-- Clone of last slide (table) -->
				<div class="w-full flex-shrink-0 overflow-y-auto">
					<div class="p-4">
						<div class="flex items-center gap-2 overflow-x-auto pb-2">
							{#each Object.entries(systemLabels) as [sysKey, label]}
								<button
									class="px-3 py-1.5 text-sm rounded-lg border whitespace-nowrap transition-colors {selectedSystem === sysKey ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input'}"
									onclick={() => selectSystem(sysKey as AmortizationSystem)}
								>
									{label}
								</button>
							{/each}
						</div>
						{#if $allResultsStore.price}
							<AmortizationTable system={selectedSystem} onrowclick={openExtraPayment} />
						{/if}
					</div>
				</div>

				<!-- Real slides -->
				{#each SLIDES as key}
					<div class="w-full flex-shrink-0 overflow-y-auto">
						<div class="p-4">
							{#if key === 'form'}
								<h1 class="text-lg font-bold mb-3">Calculadora de Financiamento</h1>
								<CalculatorForm onchange={() => (userHasInteracted = true)} />
							{:else if key === 'chart'}
								{#if $allResultsStore.price}
									<ComparisonChart onlongpress={openExtraPayment} />
								{/if}
							{:else if key === 'results'}
								{#if $allResultsStore.price}
									<ResultsSummary />
								{/if}
							{:else}
								<div class="flex items-center gap-2 overflow-x-auto pb-2">
									{#each Object.entries(systemLabels) as [sysKey, label]}
										<button
											class="px-3 py-1.5 text-sm rounded-lg border whitespace-nowrap transition-colors {selectedSystem === sysKey ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input'}"
											onclick={() => selectSystem(sysKey as AmortizationSystem)}
										>
											{label}
										</button>
									{/each}
								</div>
								{#if $allResultsStore.price}
									<AmortizationTable system={selectedSystem} onrowclick={openExtraPayment} />
								{/if}
							{/if}
						</div>
					</div>
				{/each}

				<!-- Clone of first slide (form) -->
				<div class="w-full flex-shrink-0 overflow-y-auto">
					<div class="p-4">
						<h1 class="text-lg font-bold mb-3">Calculadora de Financiamento</h1>
						<CalculatorForm onchange={() => (userHasInteracted = true)} />
					</div>
				</div>
			</div>
		</div>

		<div class="shrink-0 bg-background border-t p-3 z-30">
			<ExportButtons selectedSystem={selectedSystem} />
		</div>
	</div>
{:else}
	<!-- DESKTOP: scrollable layout -->
	<div class="max-w-4xl mx-auto">
		<div class="mb-6">
			<h1 class="text-2xl font-bold">Calculadora de Financiamento</h1>
			<p class="text-sm text-muted-foreground mt-1">
				Simule PRICE, SAC, SAM e Americano. Ajuste os valores e veja o resultado automaticamente.
			</p>
		</div>

		<CalculatorForm onchange={() => (userHasInteracted = true)} />

		{#if $allResultsStore.price && showResults}
			<div class="mt-6 space-y-6">
				<ResultsSummary />
				<ComparisonChart onlongpress={openExtraPayment} />

				<div>
					<h2 class="text-base font-semibold mb-2">Ver tabela de amortizacao</h2>
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
		{/if}
	</div>
{/if}

<AdInterstitial open={showInterstitial} onclose={handleInterstitialClose} />

<ExtraPaymentModal bind:open={extraPaymentModalOpen} month={extraPaymentMonth} onclose={() => (extraPaymentModalOpen = false)} />