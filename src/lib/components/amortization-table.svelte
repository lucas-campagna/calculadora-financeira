<script lang="ts">
  import { formatNumber } from "$lib/calculator";
  import {
    allResultsStore,
    studiesStore,
    isMobile,
    isDesktop,
  } from "$lib/stores/calculator-store";
  import type { Installment } from "$lib/calculator/types";
  import { SMALL_SCREEN_BREAKPOINT } from "$lib/constants";
  import { t } from "$lib/i18n";

  let {
    onrowclick = (_month: number) => {},
  }: {
    onrowclick?: (month: number) => void;
  } = $props();

  // svelte-ignore state_referenced_locally
  let expanded = $state(false);
  let viewMode = $state<"financing" | "field">("financing");
  let selectedField = $state<"payment" | "principal" | "interest" | "balance">(
    "payment",
  );

  const FIELDS: {
    key: "payment" | "principal" | "interest" | "balance";
    label: "table.payment" | "table.amortization" | "table.interest" | "table.balance";
  }[] = [
    { key: "payment", label: "table.payment" },
    { key: "principal", label: "table.amortization" },
    { key: "interest", label: "table.interest" },
    { key: "balance", label: "table.balance" },
  ];

  let isSmallScreen = $derived(
    typeof window !== "undefined"
      ? window.innerWidth < SMALL_SCREEN_BREAKPOINT
      : false,
  );

  $effect(() => {
    viewMode;
    prevSelectedRow = null;
    selectedMonth = null;
    selectedExtraPaymentIndex = 0;
  });

  let extraPaymentMonths = $derived(
    $studiesStore.studies
      .find((s) => s.id === $studiesStore.activeStudyId)
      ?.extraPayments.map((ep) => ep.month) ?? [],
  );

  let focusableRows = $state<Map<number, HTMLElement>>(new Map());
  let selectedExtraPaymentIndex = $state(0);
  let selectedMonth = $state<number | null>(null);
  let prevSelectedRow = $state<HTMLElement | null>(null);
  let flashTimeout: ReturnType<typeof setTimeout> | null = null;

  const maxIndex = $derived(extraPaymentMonths.length + 1);

  let activeStudyResult = $derived(
    $allResultsStore[$studiesStore.activeStudyId],
  );

  function getVal(
    studyId: string,
    month: number,
    field: "payment" | "principal" | "interest" | "balance",
  ): number | null {
    const r = $allResultsStore[studyId];
    if (!r) return null;
    const inst = r.installments.find((i: Installment) => i.number === month);
    return inst ? inst[field] : null;
  }

  function navigateExtraPayment(direction: "up" | "down") {
    if (!activeStudyResult) return;
    const sortedKeys = [...focusableRows.keys()].sort((a, b) => a - b);
    selectedExtraPaymentIndex =
      direction === "up"
        ? Math.max(0, selectedExtraPaymentIndex - 1)
        : Math.min(sortedKeys.length - 1, selectedExtraPaymentIndex + 1);
    const month = sortedKeys[selectedExtraPaymentIndex];
    const row = focusableRows.get(month);
    if (row) {
      if (flashTimeout) {
        if (prevSelectedRow?.style) prevSelectedRow.style.backgroundColor = "";
        clearTimeout(flashTimeout);
      }
      row.style.backgroundColor = "orange";
      flashTimeout = setTimeout(() => {
        row.style.backgroundColor = "";
        flashTimeout = null;
      }, 200);
      prevSelectedRow = row;
      selectedMonth = month;
      row.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }

  function handleFocusableRow(
    node: HTMLTableRowElement,
    { installment, isLast }: { installment: Installment; isLast: boolean },
  ) {
    const month = installment.number;
    if (month === 1 || isLast || (installment.extraPayment ?? 0) > 0) {
      focusableRows.set(month, node);
    }
    return {
      update({
        installment,
        isLast,
      }: {
        installment: Installment;
        isLast: boolean;
      }) {
        if (
          installment.number === 1 ||
          isLast ||
          (installment.extraPayment ?? 0) > 0
        ) {
          focusableRows.set(installment.number, node);
        } else {
          focusableRows.delete(installment.number);
        }
      },
      destroy() {
        focusableRows.delete(month);
      },
    };
  }
</script>

{#snippet menu(show: boolean)}
  {#if show}
    <div
      class="flex items-center justify-between"
      class:mt-2={$isMobile}
      class:mb-2={$isDesktop}
    >
      <div class="flex rounded-md border overflow-hidden">
        <button
          class="px-2 py-1 text-xs font-medium transition-colors {viewMode ===
          'financing'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
          onclick={() => (viewMode = "financing")}
        >
          {viewMode === "field" && isSmallScreen
            ? t("table.financingShort")
            : t("table.financing")}
        </button>
        {#if viewMode === "financing"}
          <button
            class="px-2 py-1 text-xs font-medium transition-colors"
            onclick={() => (viewMode = "field")}
          >
            {t("table.compare")}
          </button>
        {:else}
          {#each FIELDS as f}
            <button
              class="px-2 py-1 text-xs font-medium transition-colors {selectedField ===
              f.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'}"
              onclick={() => (selectedField = f.key)}
            >
              {t(f.label)}
            </button>
          {/each}
        {/if}
      </div>
      {#if $isMobile}
        <div class="flex rounded-md border overflow-hidden">
          <button
            class="px-2 py-1 text-xs font-medium hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
            onclick={() => navigateExtraPayment("up")}
            disabled={selectedExtraPaymentIndex <= 0}
            aria-label={t("table.previousRow")}
          >
            ▲
          </button>
          <button
            class="px-2 py-1 text-xs font-medium hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
            onclick={() => navigateExtraPayment("down")}
            disabled={selectedExtraPaymentIndex >= maxIndex}
            aria-label={t("table.nextRow")}
          >
            ▼
          </button>
        </div>
      {/if}
      {#if $isDesktop}
        <button
          class="text-xs text-primary hover:underline py-1"
          onclick={() => (expanded = !expanded)}
        >
          {expanded ? t("table.showSummary") : t("table.showAll")}
        </button>
      {/if}
    </div>
  {/if}
{/snippet}

{#if activeStudyResult}
  <div class="flex flex-col flex-1 min-h-0">
    {@render menu($isDesktop)}
    {#if $isMobile}
      <p class="text-xs text-muted-foreground mb-1">
        {t("table.hint")}
      </p>
    {/if}

    {#if viewMode === "financing"}
      <div
        class="{expanded || !$isDesktop
          ? 'flex-1 min-h-0'
          : 'max-h-[40vh]'} overflow-auto border rounded-lg"
      >
        <table class="w-full text-xs border-collapse table-fixed">
          <thead class="sticky top-0 z-10">
            <tr class="border-b bg-muted">
              <th class="px-1 py-1 text-left font-medium bg-muted w-[10%]"
                >{t("table.month")}</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >{t("table.paymentCurrency")}</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >{t("table.amortizationCurrency")}</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >{t("table.interestCurrency")}</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >{t("table.balanceCurrency")}</th
              >
              {#if activeStudyResult.installments.some((i: Installment) => i.extraPayment)}
                <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                  >{t("table.extraCurrency")}</th
                >
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each activeStudyResult.installments as installment, i}
              <tr
                class="border-b hover:bg-primary/10 cursor-pointer active:bg-primary/20 transition-colors {i %
                  2 ===
                0
                  ? ''
                  : 'bg-muted/30'}"
                onclick={() => onrowclick(installment.number)}
                role="button"
                tabindex="0"
                onkeydown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") onrowclick(installment.number);
                }}
                use:handleFocusableRow={{
                  installment,
                  isLast: i === activeStudyResult.installments.length - 1,
                }}
              >
                <td class="px-1 py-1 truncate">{installment.number}</td>
                <td class="px-1 py-1 text-right truncate"
                  >{formatNumber(installment.payment)}</td
                >
                <td class="px-1 py-1 text-right truncate"
                  >{formatNumber(installment.principal)}</td
                >
                <td class="px-1 py-1 text-right text-destructive truncate"
                  >{formatNumber(installment.interest)}</td
                >
                <td class="px-1 py-1 text-right truncate"
                  >{formatNumber(installment.balance)}</td
                >
                {#if activeStudyResult.installments.some((inst: Installment) => inst.extraPayment)}
                  <td class="px-1 py-1 text-right truncate">
                    {installment.extraPayment
                      ? formatNumber(installment.extraPayment)
                      : "—"}
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div
        class="{expanded || !$isDesktop
          ? 'flex-1 min-h-0'
          : 'max-h-[40vh]'} overflow-auto border rounded-lg extra-payments-table"
      >
        <table class="w-full text-xs border-collapse table-fixed">
          <thead class="sticky top-0 z-10">
            <tr class="border-b bg-muted">
              <th class="px-1 py-1 text-left font-medium bg-muted w-[10%]"
                >{t("table.month")}</th
              >
              {#each $studiesStore.studies as study}
                <th class="px-1 py-1 text-right font-medium bg-muted"
                  >{study.name}</th
                >
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each activeStudyResult.installments as inst, i}
              <tr
                class="border-b hover:bg-primary/10 cursor-pointer active:bg-primary/20 transition-colors {i %
                  2 ===
                0
                  ? ''
                  : 'bg-muted/30'}"
                onclick={() => onrowclick(inst.number)}
                role="button"
                tabindex="0"
                onkeydown={(e: KeyboardEvent) => {
                  if (e.key === "Enter") onrowclick(inst.number);
                }}
                use:handleFocusableRow={{
                  installment: inst,
                  isLast: i === activeStudyResult.installments.length - 1,
                }}
              >
                <td class="px-1 py-1 truncate">{inst.number}</td>
                {#each $studiesStore.studies as study}
                  {@const v = getVal(study.id, inst.number, selectedField)}
                  <td
                    class="px-1 py-1 text-right truncate {selectedField ===
                    'interest'
                      ? 'text-destructive'
                      : ''}"
                  >
                    {v !== null ? formatNumber(v) : "—"}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    {@render menu($isMobile)}
    {#if $isDesktop}
      <p class="text-xs text-muted-foreground mb-1">
        {t("table.hint")}
      </p>
    {/if}
  </div>
{/if}
