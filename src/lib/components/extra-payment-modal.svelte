<script lang="ts">
  import { studiesStore } from "$lib/stores/calculator-store";
  import SwipeInput from "$lib/components/ui/swipe-input.svelte";
  import type { ExtraPayment } from "$lib/calculator/types";

  let {
    open = $bindable(false),
    month = 1,
    editPayment = undefined,
    studyName = undefined,
    targetStudyId = undefined,
    colorIndex = 0,
    onclose,
  }: {
    open?: boolean;
    month?: number;
    editPayment?: ExtraPayment | undefined;
    studyName?: string;
    targetStudyId?: string;
    colorIndex?: number;
    onclose?: () => void;
  } = $props();

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#ec4899",
    "#f97316",
    "#06b6d4",
    "#ef4444",
  ];

  let extraMonth = $state(1);
  let reduceTermAmount = $state(0);
  let reduceInstallmentAmount = $state(0);
  let showRemoveConfirm = $state(false);
  let originalMonth = $state<number | null>(null);
  let originalStudyId = $state<string | null>(null);
  let focusElementOnOpen = $state<HTMLInputElement | undefined>(undefined);
  let canCancel = $state(false);

  const isEdit = $derived(originalMonth !== null);
  const isValid = $derived(
    extraMonth > 0 && (reduceTermAmount > 0 || reduceInstallmentAmount > 0),
  );

  const swapIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12m0 0 4-4m-4 4-4-4"/></svg>';

  function swapValues() {
    const temp = reduceTermAmount;
    reduceTermAmount = reduceInstallmentAmount;
    reduceInstallmentAmount = temp;
  }

  $effect(() => {
    if (open) {
      showRemoveConfirm = false;
      if (editPayment) {
        extraMonth = editPayment.month;
        originalMonth = editPayment.month;
        originalStudyId = targetStudyId ?? null;
        const studyId = originalStudyId ?? targetStudyId;
        if (studyId) {
          const study = $studiesStore.studies.find((s) => s.id === studyId);
          const termPayment = study?.extraPayments.find(
            (ep) => ep.month === editPayment.month && ep.type === "reduce_term",
          );
          const installmentPayment = study?.extraPayments.find(
            (ep) =>
              ep.month === editPayment.month &&
              ep.type === "reduce_installment",
          );
          reduceTermAmount = termPayment?.amount ?? 0;
          reduceInstallmentAmount = installmentPayment?.amount ?? 0;
        }
      } else {
        extraMonth = month;
        reduceTermAmount = 0;
        reduceInstallmentAmount = 0;
        originalMonth = null;
        originalStudyId = null;
      }
      setTimeout(() => {
        canCancel = true;
        focusElementOnOpen?.focus();
      }, 100);
    } else {
      canCancel = false;
    }
  });

  function updateMonth(v: number) {
    extraMonth = v;
  }

  function updateReduceTerm(v: number) {
    reduceTermAmount = v;
  }

  function updateReduceInstallment(v: number) {
    reduceInstallmentAmount = v;
  }

  function handleSave() {
    const m = Math.round(extraMonth);
    if (m <= 0) return;

    const studyId = isEdit ? (originalStudyId ?? targetStudyId) : targetStudyId;
    if (!studyId) return;

    if (isEdit && originalMonth !== null) {
      if (originalMonth !== m) {
        if (reduceTermAmount > 0) {
          studiesStore.addExtraPayment(studyId, {
            month: m,
            amount: reduceTermAmount,
            type: "reduce_term",
          });
          studiesStore.removeExtraPaymentType(
            studyId,
            originalMonth,
            "reduce_term",
          );
        } else {
          studiesStore.removeExtraPaymentType(
            studyId,
            originalMonth,
            "reduce_term",
          );
        }

        if (reduceInstallmentAmount > 0) {
          studiesStore.addExtraPayment(studyId, {
            month: m,
            amount: reduceInstallmentAmount,
            type: "reduce_installment",
          });
          studiesStore.removeExtraPaymentType(
            studyId,
            originalMonth,
            "reduce_installment",
          );
        } else {
          studiesStore.removeExtraPaymentType(
            studyId,
            originalMonth,
            "reduce_installment",
          );
        }
      } else {
        if (reduceTermAmount > 0) {
          studiesStore.addExtraPayment(studyId, {
            month: m,
            amount: reduceTermAmount,
            type: "reduce_term",
          });
        } else {
          studiesStore.removeExtraPaymentType(
            studyId,
            originalMonth,
            "reduce_term",
          );
        }

        if (reduceInstallmentAmount > 0) {
          studiesStore.addExtraPayment(studyId, {
            month: m,
            amount: reduceInstallmentAmount,
            type: "reduce_installment",
          });
        } else {
          studiesStore.removeExtraPaymentType(
            studyId,
            originalMonth,
            "reduce_installment",
          );
        }
      }
    } else {
      if (reduceTermAmount > 0) {
        studiesStore.addExtraPayment(studyId, {
          month: m,
          amount: reduceTermAmount,
          type: "reduce_term",
        });
      }
      if (reduceInstallmentAmount > 0) {
        studiesStore.addExtraPayment(studyId, {
          month: m,
          amount: reduceInstallmentAmount,
          type: "reduce_installment",
        });
      }
    }
    open = false;
    onclose?.();
  }

  function handleRemove() {
    if (originalMonth === null || !originalStudyId) return;
    studiesStore.removeExtraPayment(originalStudyId, originalMonth);
    open = false;
    onclose?.();
  }

  function handleCancel() {
    if (canCancel) {
      open = false;
      onclose?.();
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
    onclick={handleCancel}
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    }}
    role="dialog"
    aria-modal="true"
    aria-label="Pagamento extra"
  >
    <div
      role="document"
      class="bg-background p-6 rounded-xl max-w-sm w-full mx-4"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-base font-semibold mb-3 flex items-center gap-2">
        <span>{isEdit ? "Editar Pagamento Extra" : "Pagamento Extra"}</span>
        {#if studyName}
          {@const color = COLORS[colorIndex % COLORS.length]}
          <span
            class="px-2 py-0.5 text-xs font-medium rounded-full text-white"
            style="background-color: {color};"
          >
            {studyName}
          </span>
        {/if}
      </h2>

      <div class="space-y-4">
        <div>
          <label for="extra-modal-month" class="text-sm font-medium">Mês</label>
          <SwipeInput
            id="extra-modal-month"
            decimals={0}
            placeholder="Mes"
            value={extraMonth}
            onchange={updateMonth}
            min={1}
            step={1}
            actionButtons={[]}
            class="mt-1.5"
          />
        </div>

        <div>
          <label for="extra-modal-reduce-term" class="text-sm font-medium"
            >Reduzir prazo (R$)</label
          >
          <SwipeInput
            this={focusElementOnOpen}
            id="extra-modal-reduce-term"
            decimals={2}
            placeholder="Ex: 5.000"
            value={reduceTermAmount}
            onchange={updateReduceTerm}
            min={0}
            actionButtons={reduceTermAmount > 0
              ? [{ icon: () => swapIcon, onclick: swapValues }]
              : []}
            class="mt-1.5"
          />
          <p class="text-xs text-muted-foreground mt-1">
            Mantém valor da parcela, reduz prazo
          </p>
        </div>

        <div>
          <label
            for="extra-modal-reduce-installment"
            class="text-sm font-medium">Reduzir parcela (R$)</label
          >
          <SwipeInput
            id="extra-modal-reduce-installment"
            decimals={2}
            placeholder="Ex: 5.000"
            value={reduceInstallmentAmount}
            onchange={updateReduceInstallment}
            min={0}
            actionButtons={reduceInstallmentAmount > 0
              ? [{ icon: () => swapIcon, onclick: swapValues }]
              : []}
            class="mt-1.5"
          />
          <p class="text-xs text-muted-foreground mt-1">
            Mantém prazo, reduz valor da parcela
          </p>
        </div>
      </div>

      <div class="flex gap-3 mt-5">
        {#if isEdit}
          {#if showRemoveConfirm}
            <button
              class="h-10 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 cursor-pointer px-4 transition-all duration-200 ease-out"
              style="min-width: 100px;"
              onclick={handleRemove}
            >
              Remover?
            </button>
          {:else}
            <button
              class="shrink-0 w-10 h-10 rounded-md border border-destructive text-destructive flex items-center justify-center hover:bg-destructive/10 cursor-pointer"
              onclick={() => (showRemoveConfirm = true)}
              aria-label="Remover pagamento extra"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><polyline points="3 6 5 6 21 6" /><path
                  d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                /><path d="M10 11v6" /><path d="M14 11v6" /><path
                  d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                /></svg
              >
            </button>
          {/if}
        {/if}
        <button
          class="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style="touch-action: manipulation;"
          onclick={handleSave}
          disabled={!isValid}
        >
          {isEdit ? "Salvar" : "Adicionar"}
        </button>
      </div>
    </div>
  </div>
{/if}
