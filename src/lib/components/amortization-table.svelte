<script lang="ts">
  import { formatNumber } from "$lib/calculator";
  import { allResultsStore, studiesStore } from "$lib/stores/calculator-store";
  import type { Installment } from "$lib/calculator/types";
  import { SMALL_SCREEN_BREAKPOINT } from "$lib/constants";

  let {
    onrowclick = (_month: number) => {},
    defaultExpanded = false,
    flexMode = false,
  }: {
    onrowclick?: (month: number) => void;
    defaultExpanded?: boolean;
    flexMode?: boolean;
  } = $props();

  // svelte-ignore state_referenced_locally
  let expanded = $state(defaultExpanded);
  let viewMode = $state<"financing" | "field">("financing");
  let selectedField = $state<"payment" | "principal" | "interest" | "balance">(
    "payment",
  );

  const FIELDS: {
    key: "payment" | "principal" | "interest" | "balance";
    label: string;
  }[] = [
    { key: "payment", label: "Parcela" },
    { key: "principal", label: "Amort." },
    { key: "interest", label: "Juros" },
    { key: "balance", label: "Saldo" },
  ];

  let isSmallScreen = $derived(
    typeof window !== "undefined"
      ? window.innerWidth < SMALL_SCREEN_BREAKPOINT
      : false,
  );

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
        const wasLast = isLast;
        focusableRows.delete(month);
        if (wasLast && month > 1) {
          const prevRow =
            node.previousElementSibling as HTMLTableRowElement | null;
          if (prevRow) {
            const prevMonth = month - 1;
            focusableRows.set(prevMonth, prevRow);
          }
        }
      },
    };
  }
</script>

{#if activeStudyResult}
  <div class={flexMode ? "flex flex-col flex-1 min-h-0" : ""}>
    <p class="text-xs text-muted-foreground mb-1">
      Toque em uma parcela para adicionar pagamento extra.
    </p>

    {#if viewMode === "financing"}
      <div
        class={flexMode
          ? "flex-1 min-h-0 overflow-auto border rounded-lg"
          : "overflow-auto border rounded-lg"}
        style={flexMode ? "" : "max-height: 45vh"}
      >
        <table class="w-full text-xs border-collapse table-fixed">
          <thead class="sticky top-0 z-10">
            <tr class="border-b bg-muted">
              <th class="px-1 py-1 text-left font-medium bg-muted w-[10%]"
                >Mês</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >Parcela (R$)</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >Amort. (R$)</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >Juros (R$)</th
              >
              <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                >Saldo (R$)</th
              >
              {#if activeStudyResult.installments.some((i: Installment) => i.extraPayment)}
                <th class="px-1 py-1 text-right font-medium bg-muted w-[18%]"
                  >Extra (R$)</th
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
        class={flexMode
          ? "flex-1 min-h-0 overflow-auto border rounded-lg extra-payments-table"
          : "overflow-auto border rounded-lg extra-payments-table"}
        style={flexMode ? "" : "max-height: 45vh"}
      >
        <table class="w-full text-xs border-collapse table-fixed">
          <thead class="sticky top-0 z-10">
            <tr class="border-b bg-muted">
              <th class="px-1 py-1 text-left font-medium bg-muted w-[10%]"
                >Mês</th
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

    {#if !defaultExpanded && viewMode === "financing"}
      <div class="flex justify-end mt-1">
        <button
          class="text-xs text-primary hover:underline py-1"
          onclick={() => (expanded = !expanded)}
        >
          {expanded ? "▲ Ver resumo" : "▼ Ver tudo"}
        </button>
      </div>
    {/if}

    <div class="flex items-center justify-between mt-2">
      <div class="flex rounded-md border overflow-hidden">
        <button
          class="px-2 py-1 text-xs font-medium transition-colors {viewMode ===
          'financing'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
          onclick={() => (viewMode = "financing")}
        >
          {viewMode === "field" && isSmallScreen ? "Financ." : "Financiamento"}
        </button>
        {#if viewMode === "financing"}
          <button
            class="px-2 py-1 text-xs font-medium transition-colors"
            onclick={() => (viewMode = "field")}
          >
            Comparar
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
              {f.label}
            </button>
          {/each}
        {/if}
      </div>
      <div class="flex rounded-md border overflow-hidden">
        <button
          class="px-2 py-1 text-xs font-medium hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
          onclick={() => navigateExtraPayment("up")}
          disabled={selectedExtraPaymentIndex <= 0}
          aria-label="Linha anterior"
        >
          ▲
        </button>
        <button
          class="px-2 py-1 text-xs font-medium hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed"
          onclick={() => navigateExtraPayment("down")}
          disabled={selectedExtraPaymentIndex >= maxIndex}
          aria-label="Próxima linha"
        >
          ▼
        </button>
      </div>
    </div>
  </div>
{/if}
