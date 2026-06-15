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

	let showScrollTop = $state(false);

	const SLIDES = ['chart', 'results', 'table'] as const;
	type SlideKey = typeof SLIDES[number];
	const N = SLIDES.length;

	let realIndex = $state<number>(0);
	let carouselIndex = $state<number>(1);
	let swipeContainerEl: HTMLElement | undefined = $state(undefined);
let touchStartX = 0;
	let touchStartY = 0;
	let isDragging = false;
	let directionLocked: 'h' | 'v' | null = null;
	let dragDelta = $state(0);
	let animating = $state(true);
	const LOCK_DISTANCE = 10;

	const systemLabels: Record<AmortizationSystem, string> = {
		price: 'PRICE',
		sac: 'SAC',
		sam: 'SAM',
		americano: 'Americano'
	};

	const slideLabels: Record<SlideKey, string> = {
		chart: 'Grafico',
		results: 'Resultado',
		table: 'Tabela'
	};

	function selectSystem(sys: AmortizationSystem) {
		selectedSystem = sys;
	}

	function getScrollParent(el: HTMLElement | null): HTMLElement | null {
		while (el && el !== swipeContainerEl) {
			const style = window.getComputedStyle(el);
			const overflowX = style.overflowX;
			if ((overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth) {
				return el;
			}
			el = el.parentElement;
		}
		return null;
	}

	function handleSwipeStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		isDragging = true;
		directionLocked = null;
		animating = false;
	}

	function handleSwipeMove(e: TouchEvent) {
		if (!isDragging) return;
		const dx = e.touches[0].clientX - touchStartX;
		const dy = e.touches[0].clientY - touchStartY;

		if (!directionLocked) {
			if (Math.sqrt(dx * dx + dy * dy) < LOCK_DISTANCE) return;
			const angle = Math.atan2(Math.abs(dy), Math.abs(dx)) * (180 / Math.PI);
			directionLocked = angle < 45 ? 'h' : 'v';
		}

		if (directionLocked === 'v') {
			isDragging = false;
			return;
		}

		const scrollEl = getScrollParent(e.target as HTMLElement);
		if (scrollEl) {
			const atLeft = scrollEl.scrollLeft <= 0 && dx > 0;
			const atRight = scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth && dx < 0;
			if (!atLeft && !atRight) {
				isDragging = false;
				return;
			}
		}
		e.preventDefault();
		dragDelta = dx;
	}

	function handleSwipeEnd(e: TouchEvent) {
		if (!isDragging) {
			isDragging = false;
			dragDelta = 0;
			directionLocked = null;
			animating = true;
			return;
		}
		isDragging = false;
		const diff = touchStartX - e.changedTouches[0].clientX;
		animating = true;
		directionLocked = null;

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
				}
			}
		}
	});

	function handleInterstitialClose() {
		showInterstitial = false;
		showResults = true;
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

		function onScroll() {
			showScrollTop = window.scrollY > 300;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

{#if $isMobile}
	<!-- MOBILE: full viewport, no page scroll -->
	<div class="h-dvh flex flex-col overflow-hidden">
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

		<!-- carousel area: fills remaining space between tabs and bottom bar -->
		<div class="flex-1 min-h-0 overflow-hidden" style="touch-action: pan-y" bind:this={swipeContainerEl}>
			<div
				class="flex h-full {animating ? 'transition-transform duration-300 ease-in-out' : ''}"
				style="transform: translateX(calc(-{carouselIndex * 100}% + {dragDelta}px))"
				ontransitionend={handleTransitionEnd}
			>
				<!-- Clone of last slide (table) -->
				<div class="w-full flex-shrink-0 h-full flex flex-col">
					<div class="flex-1 min-h-0 p-3 flex flex-col">
						{#if $allResultsStore.price}
							<AmortizationTable system={selectedSystem} onrowclick={openExtraPayment} defaultExpanded={true} flexMode={true} />
						{/if}
						<div class="shrink-0 flex items-center gap-2 overflow-x-auto pt-2 border-t">
							{#each Object.entries(systemLabels) as [sysKey, label]}
								<button
									class="px-3 py-1.5 text-sm rounded-lg border whitespace-nowrap transition-colors {selectedSystem === sysKey ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input'}"
									onclick={() => selectSystem(sysKey as AmortizationSystem)}
								>
									{label}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Real slides -->
				{#each SLIDES as key}
					{#if key === 'chart'}
						<div class="w-full flex-shrink-0 h-full flex flex-col">
							<div class="flex-1 min-h-0 p-2">
								{#if $allResultsStore.price}
									<ComparisonChart onlongpress={openExtraPayment} fullHeight={true} />
								{/if}
							</div>
						</div>
					{:else if key === 'results'}
						<div class="w-full flex-shrink-0 h-full overflow-y-auto">
							<div class="p-3">
								{#if $allResultsStore.price}
									<ResultsSummary />
								{/if}
							</div>
						</div>
					{:else}
						<div class="w-full flex-shrink-0 h-full flex flex-col">
							<div class="flex-1 min-h-0 p-3 flex flex-col">
								{#if $allResultsStore.price}
									<AmortizationTable system={selectedSystem} onrowclick={openExtraPayment} defaultExpanded={true} flexMode={true} />
								{/if}
								<div class="shrink-0 flex items-center gap-2 overflow-x-auto pt-2 border-t">
									{#each Object.entries(systemLabels) as [sysKey, label]}
										<button
											class="px-3 py-1.5 text-sm rounded-lg border whitespace-nowrap transition-colors {selectedSystem === sysKey ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input'}"
											onclick={() => selectSystem(sysKey as AmortizationSystem)}
										>
											{label}
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				{/each}

				<!-- Clone of first slide (chart) -->
				<div class="w-full flex-shrink-0 h-full flex flex-col">
					<div class="flex-1 min-h-0 p-2">
						{#if $allResultsStore.price}
							<ComparisonChart onlongpress={openExtraPayment} fullHeight={true} />
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Fixed bottom bar: inputs 2x2 -->
		<div class="shrink-0 bg-background border-t px-3 pt-2 pb-3">
			<CalculatorForm compact={true} onchange={() => (userHasInteracted = true)} />
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

				{#key selectedSystem}
					<AmortizationTable system={selectedSystem} onrowclick={openExtraPayment} />
				{/key}

				<div class="flex flex-wrap gap-2">
					{#each Object.entries(systemLabels) as [key, label]}
						<button
							class="px-4 py-2 text-sm rounded-md border transition-colors {selectedSystem === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-accent'}"
							onclick={() => selectSystem(key as AmortizationSystem)}
						>
							{label}
						</button>
					{/each}
				</div>

				<ExportButtons selectedSystem={selectedSystem} />
			</div>
		{/if}
	</div>
{/if}

{#if showScrollTop}
	<button
		onclick={scrollToTop}
		class="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-opacity"
		aria-label="Voltar ao topo"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
	</button>
{/if}

<AdInterstitial open={showInterstitial} onclose={handleInterstitialClose} />

<ExtraPaymentModal bind:open={extraPaymentModalOpen} month={extraPaymentMonth} onclose={() => (extraPaymentModalOpen = false)} />