<script lang="ts">
  import { onMount } from "svelte";
  import CalculatorForm from "$lib/components/calculator-form.svelte";
  import ResultsSummary from "$lib/components/results-summary.svelte";
  import AmortizationTable from "$lib/components/amortization-table.svelte";
  import ComparisonChart from "$lib/components/comparison-chart.svelte";
  import ExportButtons from "$lib/components/export-buttons.svelte";
  import AdInterstitial from "$lib/components/ads/ad-interstitial.svelte";
  import ExtraPaymentModal from "$lib/components/extra-payment-modal.svelte";
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "$lib/components/ui/carousel";
  import type { CarouselAPI } from "$lib/components/ui/carousel";
  import {
    allResultsStore,
    isMobile,
    calculateAll,
    studiesStore,
  } from "$lib/stores/calculator-store";
  import type { ExtraPayment } from "$lib/calculator/types";

  let extraPaymentModalOpen = $state(false);
  let extraPaymentMonth = $state(1);
  let extraPaymentEdit = $state<ExtraPayment | undefined>(undefined);
  let showInterstitial = $state(false);
  let showResults = $state(false);
  let previousResultHash = $state("");
  let userHasInteracted = $state(false);
  let lastInterstitialTime = 0;
  const FIRST_INTERSTITIAL_MS = 1 * 60 * 1000;
  const INTERSTITIAL_COOLDOWN_MS = 5 * 60 * 1000;

  const isDev = import.meta.env.DEV;

  let showScrollTop = $state(false);
  let mobileHeight = $state("100dvh");

  const SLIDES = ["chart", "results", "table"] as const;
  type SlideKey = (typeof SLIDES)[number];

  let currentSlide = $state(0);
  let carouselApi = $state<CarouselAPI | undefined>(undefined);

  function closeAllPopups() {
    (document.activeElement as HTMLElement)?.blur();
    extraPaymentModalOpen = false;
  }

  function openExtraPayment(month: number) {
    extraPaymentMonth = month;
    const activeStudy = $studiesStore.studies.find(
      (s) => s.id === $studiesStore.activeStudyId,
    );
    const existing = activeStudy?.extraPayments.find(
      (ep) => ep.month === month,
    );
    extraPaymentEdit = existing;
    extraPaymentModalOpen = true;
  }

  function goToSlide(index: number) {
    carouselApi?.scrollTo(index);
    currentSlide = index;
  }

  const slideLabels: Record<SlideKey, string> = {
    chart: "Gráfico",
    results: "Resultado",
    table: "Tabela",
  };

  $effect(() => {
    if (Object.keys($allResultsStore).length > 0) {
      const hash = Object.values($allResultsStore)
        .map((r) => r?.totalPaid ?? 0)
        .join(",");
      if (hash !== previousResultHash) {
        previousResultHash = hash;
        if (userHasInteracted) {
          const now = Date.now();
          const timeout =
            lastInterstitialTime === 0
              ? FIRST_INTERSTITIAL_MS
              : INTERSTITIAL_COOLDOWN_MS;
          if (now - lastInterstitialTime >= timeout) {
            closeAllPopups();
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

  onMount(() => {
    calculateAll();

    function onScroll() {
      showScrollTop = window.scrollY > 300;
    }

    function updateMobileHeight() {
      const header = document.querySelector("header");
      const headerH = header ? header.getBoundingClientRect().height : 56;
      mobileHeight = `${(window.visualViewport?.height ?? window.innerHeight) - headerH}px`;
    }

    updateMobileHeight();
    window.visualViewport?.addEventListener("resize", updateMobileHeight);
    window.addEventListener("resize", updateMobileHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.visualViewport?.removeEventListener("resize", updateMobileHeight);
      window.removeEventListener("resize", updateMobileHeight);
      window.removeEventListener("scroll", onScroll);
    };
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  let hasResults = $derived(
    Object.keys($allResultsStore).length > 0 &&
      $allResultsStore[$studiesStore.activeStudyId] != null,
  );

  let isDark = $state(false);

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
</script>

{#if $isMobile}
  <div class="flex flex-col overflow-hidden" style="height: {mobileHeight}">
    <!-- MOBILE -->
    <div class="flex border-b shrink-0">
      {#each SLIDES as key, i}
        <button
          class="flex-1 py-2 text-sm font-medium text-center transition-colors {currentSlide ===
          i
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground'}"
          onclick={() => goToSlide(i)}
        >
          {slideLabels[key]}
        </button>
      {/each}
    </div>

    <Carousel
      class="flex-1 min-h-0 overflow-hidden"
      style="touch-action: pan-y"
      opts={{ loop: true }}
      setApi={(api: CarouselAPI) => {
        carouselApi = api;
        api.on("select", () => {
          const idx = api.selectedScrollSnap();
          currentSlide = idx;
        });
      }}
    >
      <CarouselContent class="h-full">
        <CarouselItem class="h-full w-full flex-shrink-0">
          <div class="h-full flex flex-col">
            <div class="flex-1 min-h-0 p-2">
              {#if hasResults}
                <ComparisonChart
                  onlongpress={openExtraPayment}
                  fullHeight={true}
                />
              {/if}
            </div>
          </div>
        </CarouselItem>
        <CarouselItem class="h-full w-full flex-shrink-0">
          <div class="h-full overflow-y-auto">
            <div class="p-3">
              {#if hasResults}
                <ResultsSummary />
              {/if}
            </div>
          </div>
        </CarouselItem>
        <CarouselItem class="h-full w-full flex-shrink-0">
          <div class="h-full flex flex-col">
            <div class="flex-1 min-h-0 p-3 flex flex-col">
              {#if hasResults}
                <AmortizationTable onrowclick={openExtraPayment} />
              {/if}
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <div class="shrink-0 bg-background border-t px-3 pt-2 pb-3">
      <CalculatorForm
        compact={true}
        onchange={() => (userHasInteracted = true)}
      />
    </div>
  </div>
{:else}
  <!-- DESKTOP -->
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Calculadora de Financiamento</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Simule PRICE, SAC, SAM e Americano. Ajuste os valores e veja o resultado
        automaticamente.
      </p>
    </div>

    <div class="space-y-6">
      <CalculatorForm onchange={() => (userHasInteracted = true)} />
      <ExportButtons />
    </div>

    {#if hasResults && showResults}
      <div class="mt-6 space-y-6">
        <ResultsSummary />
        <ComparisonChart onlongpress={openExtraPayment} />
        <AmortizationTable onrowclick={openExtraPayment} />
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg
    >
  </button>
{/if}

{#if isDev}
  <button
    onclick={toggleTheme}
    class="fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-300 transition-opacity"
    aria-label="Alternar tema"
  >
    {#if isDark}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path
          d="M12 20v2"
        /><path d="m4.93 4.93 1.41 1.41" /><path
          d="m17.66 17.66 1.41 1.41"
        /><path d="M2 12h2" /><path d="M20 12h2" /><path
          d="m6.34 17.66-1.41 1.41"
        /><path d="m19.07 4.93 1.41 1.41" /></svg
      >
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg
      >
    {/if}
  </button>
  <button
    onclick={() => {
      showInterstitial = true;
      showResults = false;
    }}
    class="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 transition-opacity"
    aria-label="Mostrar popup de anúncio"
  >
    AD
  </button>
{/if}

<AdInterstitial open={showInterstitial} onclose={handleInterstitialClose} />

<ExtraPaymentModal
  bind:open={extraPaymentModalOpen}
  month={extraPaymentMonth}
  editPayment={extraPaymentEdit}
  onclose={() => {
    extraPaymentModalOpen = false;
    extraPaymentEdit = undefined;
  }}
/>
