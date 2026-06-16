<script lang="ts">
  import { studiesStore, calculateAll } from "$lib/stores/calculator-store";
  import SwipeInput from "$lib/components/ui/swipe-input.svelte";
  import Button from "$lib/components/ui/button.svelte";

  let activePayments = $derived(
    $studiesStore.studies.find((s) => s.id === $studiesStore.activeStudyId)
      ?.extraPayments ?? [],
  );

  function addExtraPayment() {
    studiesStore.addExtraPayment($studiesStore.activeStudyId, {
      month: 1,
      amount: 0,
      type: "reduce_term",
    });
  }

  function removeExtraPayment(index: number) {
    const studyId = $studiesStore.activeStudyId;
    studiesStore.updateStudy(studyId, {
      extraPayments: activePayments.filter((_, i) => i !== index),
    });
    calculateAll();
  }

  function updateMonth(index: number, raw: string) {
    const month = parseInt(raw) || 1;
    const updated = [...activePayments];
    updated[index] = { ...updated[index], month };
    studiesStore.updateStudy($studiesStore.activeStudyId, {
      extraPayments: updated,
    });
    calculateAll();
  }

  function updateAmount(index: number, raw: string) {
    const amount = parseInt(raw.replace(/[^\d]/g, "")) || 0;
    const updated = [...activePayments];
    updated[index] = { ...updated[index], amount };
    studiesStore.updateStudy($studiesStore.activeStudyId, {
      extraPayments: updated,
    });
    calculateAll();
  }

  function updateType(
    index: number,
    type: "reduce_installment" | "reduce_term",
  ) {
    const updated = [...activePayments];
    updated[index] = { ...updated[index], type };
    studiesStore.updateStudy($studiesStore.activeStudyId, {
      extraPayments: updated,
    });
    calculateAll();
  }
</script>

<div class="mt-3 space-y-3">
  {#each activePayments as ep, i}
    <div class="flex flex-wrap gap-2 items-end border rounded-md p-3">
      <div class="flex-1 min-w-[80px]">
        <label for="extra-month-{i}" class="text-xs text-muted-foreground"
          >Mês</label
        >
        <SwipeInput
          id="extra-month-{i}"
          inputmode="numeric"
          value={String(ep.month)}
          onchange={(v) => updateMonth(i, v)}
          min="1"
          class="mt-1"
        />
      </div>
      <div class="flex-1 min-w-[100px]">
        <label for="extra-amount-{i}" class="text-xs text-muted-foreground"
          >Valor (R$)</label
        >
        <SwipeInput
          id="extra-amount-{i}"
          inputmode="numeric"
          value={String(ep.amount)}
          onchange={(v) => updateAmount(i, v)}
          min="0"
          class="mt-1"
        />
      </div>
      <div class="flex-1 min-w-[120px]">
        <label for="extra-type-{i}" class="text-xs text-muted-foreground"
          >Tipo</label
        >
        <select
          id="extra-type-{i}"
          class="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-3 text-base mt-1"
          value={ep.type}
          onchange={(e: Event) =>
            updateType(
              i,
              (e.target as HTMLSelectElement).value as
                | "reduce_installment"
                | "reduce_term",
            )}
        >
          <option value="reduce_term">Reduzir prazo</option>
          <option value="reduce_installment">Reduzir parcela</option>
        </select>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onclick={() => removeExtraPayment(i)}>X</Button
      >
    </div>
  {/each}
  <Button variant="outline" size="sm" onclick={addExtraPayment}
    >+ Adicionar pagamento extra</Button
  >
</div>
