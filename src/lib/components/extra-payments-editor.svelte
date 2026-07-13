<script lang="ts">
  import { studiesStore, calculateAll } from "$lib/stores/calculator-store";
  import SwipeInput from "$lib/components/ui/swipe-input.svelte";
  import Button from "$lib/components/ui/button.svelte";
  import type { ExtraPayment } from "$lib/calculator/types";

  interface GroupedPayment {
    month: number;
    reduceTerm: number;
    reduceInstallment: number;
  }

  let groupedPayments = $derived.by(() => {
    const payments =
      $studiesStore.studies.find((s) => s.id === $studiesStore.activeStudyId)
        ?.extraPayments ?? [];

    const grouped = new Map<number, GroupedPayment>();
    for (const ep of payments) {
      const existing = grouped.get(ep.month);
      if (existing) {
        if (ep.type === "reduce_term") {
          existing.reduceTerm = ep.amount;
        } else {
          existing.reduceInstallment = ep.amount;
        }
      } else {
        grouped.set(ep.month, {
          month: ep.month,
          reduceTerm: ep.type === "reduce_term" ? ep.amount : 0,
          reduceInstallment: ep.type === "reduce_installment" ? ep.amount : 0,
        });
      }
    }
    return Array.from(grouped.values()).sort((a, b) => a.month - b.month);
  });

  function addExtraPayment() {
    const existingMonths = groupedPayments.map((p) => p.month);
    let newMonth = 1;
    while (existingMonths.includes(newMonth)) {
      newMonth++;
    }
    studiesStore.addExtraPayment($studiesStore.activeStudyId, {
      month: newMonth,
      amount: 0,
      type: "reduce_term",
    });
    studiesStore.addExtraPayment($studiesStore.activeStudyId, {
      month: newMonth,
      amount: 0,
      type: "reduce_installment",
    });
  }

  function removeExtraPayment(month: number) {
    studiesStore.removeExtraPayment($studiesStore.activeStudyId, month);
  }

  function updateMonth(month: number, newMonth: number) {
    const studyId = $studiesStore.activeStudyId;
    const study = $studiesStore.studies.find((s) => s.id === studyId);
    if (!study) return;

    const termPayment = study.extraPayments.find(
      (ep) => ep.month === month && ep.type === "reduce_term",
    );
    const installmentPayment = study.extraPayments.find(
      (ep) => ep.month === month && ep.type === "reduce_installment",
    );

    if (termPayment) {
      studiesStore.addExtraPayment(studyId, {
        month: newMonth,
        amount: termPayment.amount,
        type: "reduce_term",
      });
      studiesStore.removeExtraPayment(studyId, month);
    }
    if (installmentPayment) {
      studiesStore.addExtraPayment(studyId, {
        month: newMonth,
        amount: installmentPayment.amount,
        type: "reduce_installment",
      });
    }
  }

  function updateReduceTerm(month: number, value: number) {
    studiesStore.addExtraPayment($studiesStore.activeStudyId, {
      month,
      amount: value,
      type: "reduce_term",
    });
  }

  function updateReduceInstallment(month: number, value: number) {
    studiesStore.addExtraPayment($studiesStore.activeStudyId, {
      month,
      amount: value,
      type: "reduce_installment",
    });
  }
</script>

<div class="mt-3 space-y-3">
  {#each groupedPayments as gp}
    <div class="flex flex-wrap gap-2 items-end border rounded-md p-3">
      <div class="flex-1 min-w-[80px]">
        <label
          for="extra-month-{gp.month}"
          class="text-xs text-muted-foreground">Mês</label
        >
        <SwipeInput
          id="extra-month-{gp.month}"
          decimals={0}
          value={gp.month}
          onchange={(v) => updateMonth(gp.month, v)}
          min={1}
          class="mt-1"
        />
      </div>
      <div class="flex-1 min-w-[100px]">
        <label
          for="extra-reduce-term-{gp.month}"
          class="text-xs text-muted-foreground">Reduzir prazo (R$)</label
        >
        <SwipeInput
          id="extra-reduce-term-{gp.month}"
          decimals={2}
          value={gp.reduceTerm}
          onchange={(v) => updateReduceTerm(gp.month, v)}
          min={0}
          class="mt-1"
        />
      </div>
      <div class="flex-1 min-w-[100px]">
        <label
          for="extra-reduce-installment-{gp.month}"
          class="text-xs text-muted-foreground">Reduzir parcela (R$)</label
        >
        <SwipeInput
          id="extra-reduce-installment-{gp.month}"
          decimals={2}
          value={gp.reduceInstallment}
          onchange={(v) => updateReduceInstallment(gp.month, v)}
          min={0}
          class="mt-1"
        />
      </div>
      <Button
        variant="destructive"
        size="sm"
        onclick={() => removeExtraPayment(gp.month)}>X</Button
      >
    </div>
  {/each}
  <Button variant="outline" size="sm" onclick={addExtraPayment}
    >+ Adicionar pagamento extra</Button
  >
</div>
