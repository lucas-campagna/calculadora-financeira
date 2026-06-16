<script lang="ts">
  import { formatNumber } from "$lib/calculator";
  import { allResultsStore, studiesStore } from "$lib/stores/calculator-store";
  import type { AmortizationSystem, Installment } from "$lib/calculator/types";

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
</script>

{#if activeStudyResult}
  <div class={flexMode ? "flex flex-col flex-1 min-h-0" : ""}>
    <div class="flex items-center gap-2 mb-2">
      <div class="flex rounded-md border overflow-hidden">
        <button
          class="px-2 py-1 text-xs font-medium transition-colors {viewMode ===
          'financing'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background'}"
          onclick={() => (viewMode = "financing")}
        >
          Financiamento
        </button>
        <button
          class="px-2 py-1 text-xs font-medium transition-colors {viewMode ===
          'field'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background'}"
          onclick={() => (viewMode = "field")}
        >
          Campos
        </button>
      </div>
    </div>

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
      <div class="flex flex-wrap gap-1 mb-2">
        {#each FIELDS as f}
          <button
            class="px-2 py-1 text-xs font-medium rounded transition-colors {selectedField ===
            f.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
            onclick={() => (selectedField = f.key)}
          >
            {f.label}
          </button>
        {/each}
      </div>
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

    <p class="text-xs text-muted-foreground mt-1">
      Toque em uma parcela para adicionar pagamento extra.
    </p>
  </div>
{/if}
