<script lang="ts">
  import { studiesStore, calculateAll } from "$lib/stores/calculator-store";
  import type { FieldKey, StudiesState } from "$lib/stores/calculator-store";
  import type { AmortizationSystem, Study } from "$lib/calculator/types";
  import SwipeInput from "$lib/components/ui/swipe-input.svelte";
  import revertIcon from "$lib/assets/icons/revert.svg?raw";

  let {
    open = $bindable(false),
    mode = "add",
    editStudy = undefined,
  }: {
    open?: boolean;
    mode?: "add" | "edit";
    editStudy?: Partial<Study>;
  } = $props();

  const SYSTEMS: { key: AmortizationSystem; label: string }[] = [
    { key: "price", label: "PRICE" },
    { key: "sac", label: "SAC" },
    { key: "sam", label: "SAM" },
    { key: "americano", label: "Americano" },
  ];

  let name = $state("");
  let system = $state<AmortizationSystem>("price");
  let principal = $state(0);
  let annualRate = $state(0);
  let termMonths = $state(0);
  let downPayment = $state(0);
  let showRemoveConfirm = $state(false);

  let initialValues = $state({
    principal: 0,
    annualRate: 0,
    termMonths: 0,
    downPayment: 0,
  });

  let previousOverrides = $state<Partial<Record<FieldKey, number>>>({});

  $effect(() => {
    if (!open) return;

    showRemoveConfirm = false;
    const store = $studiesStore;
    const activeId = store.activeStudyId;
    const common = store.commonValues;
    const overrides = store.overrides[activeId] ?? {};

    const newInitialValues = {
      principal: overrides.principal ?? common.principal,
      annualRate: overrides.annualRate ?? common.annualRate,
      termMonths: overrides.termMonths ?? common.termMonths,
      downPayment: overrides.downPayment ?? common.downPayment,
    };
    initialValues = newInitialValues;

    if (mode === "edit" && editStudy) {
      name = editStudy.name ?? "";
      system = editStudy.system ?? "price";
      principal = newInitialValues.principal;
      annualRate = newInitialValues.annualRate;
      termMonths = newInitialValues.termMonths;
      downPayment = newInitialValues.downPayment;
      previousOverrides = { ...overrides };
    } else {
      const active = store.studies.find((s: Study) => s.id === activeId);
      name =
        active?.name ??
        SYSTEMS.find((s) => s.key === active?.system)?.label ??
        "Novo";
      system = active?.system ?? "price";
      principal = newInitialValues.principal;
      annualRate = newInitialValues.annualRate;
      termMonths = newInitialValues.termMonths;
      downPayment = newInitialValues.downPayment;
      previousOverrides = {};
    }
  });

  function handleRevert(field: FieldKey) {
    if (field === "principal") principal = initialValues.principal;
    else if (field === "annualRate") annualRate = initialValues.annualRate;
    else if (field === "termMonths") termMonths = initialValues.termMonths;
    else if (field === "downPayment") downPayment = initialValues.downPayment;
  }

  function handleConfirm() {
    const common = $studiesStore.commonValues;

    if (mode === "add") {
      const newStudy: Study = {
        id: crypto.randomUUID(),
        name: name || SYSTEMS.find((s) => s.key === system)?.label || "Novo",
        system,
        extraPayments: [],
      };

      const newOverrides: Partial<Record<FieldKey, number>> = {};
      if (principal !== common.principal) newOverrides.principal = principal;
      if (annualRate !== common.annualRate)
        newOverrides.annualRate = annualRate;
      if (termMonths !== common.termMonths)
        newOverrides.termMonths = termMonths;
      if (downPayment !== common.downPayment)
        newOverrides.downPayment = downPayment;

      studiesStore.addStudy(newStudy);
      studiesStore.setActive(newStudy.id);

      if (Object.keys(newOverrides).length > 0) {
        studiesStore.update((s: StudiesState) => {
          const studyId = newStudy.id;
          return {
            ...s,
            overrides: {
              ...s.overrides,
              [studyId]: newOverrides as Record<FieldKey, number>,
            },
          };
        });
      }
    } else if (mode === "edit" && editStudy?.id) {
      const studyId = editStudy.id;
      const currentOverrides = previousOverrides;

      const updatedOverrides: Partial<Record<FieldKey, number>> = {
        ...currentOverrides,
      };

      const fields: FieldKey[] = [
        "principal",
        "annualRate",
        "termMonths",
        "downPayment",
      ];
      for (const field of fields) {
        const value =
          field === "principal"
            ? principal
            : field === "annualRate"
              ? annualRate
              : field === "termMonths"
                ? termMonths
                : downPayment;

        if (value !== common[field]) {
          updatedOverrides[field] = value;
        } else if (currentOverrides[field] !== undefined) {
          delete updatedOverrides[field];
        }
      }

      studiesStore.updateStudy(studyId, {
        name:
          name ||
          SYSTEMS.find((s) => s.key === system)?.label ||
          editStudy.name,
        system,
      });

      studiesStore.update((s: StudiesState) => {
        const newOverrides = { ...s.overrides };
        if (Object.keys(updatedOverrides).length > 0) {
          newOverrides[studyId] = updatedOverrides as Record<FieldKey, number>;
        } else {
          delete newOverrides[studyId];
        }
        return { ...s, overrides: newOverrides };
      });
    }
    calculateAll();
    open = false;
  }

  function handleBackdrop() {
    open = false;
  }

  function handleRemove() {
    if (!editStudy?.id) return;
    const studyId = editStudy.id;
    studiesStore.update((s: StudiesState) => {
      const remaining = s.studies.filter((st: Study) => st.id !== studyId);
      const newActiveId =
        s.activeStudyId === studyId
          ? (remaining[0]?.id ?? s.studies[0].id)
          : s.activeStudyId;
      const newOverrides = { ...s.overrides };
      delete newOverrides[studyId];
      return {
        ...s,
        studies: remaining,
        activeStudyId: newActiveId,
        overrides: newOverrides,
      };
    });
    calculateAll();
    open = false;
  }

  function makeActionButtons(
    field: FieldKey,
  ): { icon: () => string; onclick: () => void }[] {
    const currentValue =
      field === "principal"
        ? principal
        : field === "annualRate"
          ? annualRate
          : field === "termMonths"
            ? termMonths
            : downPayment;
    const isOverridden = currentValue !== initialValues[field];

    if (isOverridden) {
      return [
        {
          icon: () => revertIcon,
          onclick: () => handleRevert(field),
        },
      ];
    }
    return [];
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
    onclick={handleBackdrop}
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === "Escape") {
        open = false;
      }
    }}
    role="dialog"
    aria-modal="true"
    aria-label="Estudo"
    tabindex="0"
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      role="document"
      class="bg-background p-6 rounded-xl max-w-sm w-full mx-4"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-base font-semibold mb-4">
        {mode === "add" ? "Novo Estudo" : "Editar Estudo"}
      </h2>

      <div class="space-y-3">
        <div>
          <label for="study-name" class="text-sm font-medium">Nome</label>
          <input
            id="study-name"
            type="text"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            bind:value={name}
            placeholder="Nome do estudo"
          />
        </div>

        <div>
          <span class="text-sm font-medium mb-1 block">Sistema</span>
          <div class="flex flex-wrap gap-2">
            {#each SYSTEMS as opt}
              <button
                class="px-3 py-1.5 text-sm rounded-lg border transition-colors {system ===
                opt.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-input hover:bg-accent'} cursor-pointer"
                onclick={() => (system = opt.key)}
              >
                {opt.label}
              </button>
            {/each}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="study-principal" class="text-sm font-medium"
              >Valor (R$)</label
            >
            <SwipeInput
              id="study-principal"
              decimals={2}
              placeholder="500.000"
              value={principal}
              onchange={(v) => (principal = v)}
              min={1}
              class="mt-1"
              actionButtons={makeActionButtons("principal")}
            />
          </div>
          <div>
            <label for="study-down" class="text-sm font-medium"
              >Entrada (R$)</label
            >
            <SwipeInput
              id="study-down"
              decimals={2}
              placeholder="0"
              value={downPayment}
              onchange={(v) => (downPayment = v)}
              min={0}
              class="mt-1"
              actionButtons={makeActionButtons("downPayment")}
            />
          </div>
          <div>
            <label for="study-rate" class="text-sm font-medium"
              >Taxa (% a.a.)</label
            >
            <SwipeInput
              id="study-rate"
              decimals={2}
              placeholder="10"
              value={annualRate}
              onchange={(v) => (annualRate = v)}
              min={0.01}
              class="mt-1"
              actionButtons={makeActionButtons("annualRate")}
            />
          </div>
          <div>
            <label for="study-term" class="text-sm font-medium"
              >Prazo (meses)</label
            >
            <SwipeInput
              id="study-term"
              decimals={0}
              placeholder="360"
              value={termMonths}
              onchange={(v) => (termMonths = v)}
              min={1}
              class="mt-1"
              actionButtons={makeActionButtons("termMonths")}
            />
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-5">
        {#if mode === "edit"}
          {#if showRemoveConfirm}
            <button
              class="h-10 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 cursor-pointer px-4 transition-all duration-200 ease-out"
              style="min-width: 120px;"
              onclick={handleRemove}
            >
              Remover?
            </button>
          {:else}
            <button
              class="shrink-0 w-10 h-10 rounded-md border border-destructive text-destructive flex items-center justify-center hover:bg-destructive/10 cursor-pointer"
              onclick={() => (showRemoveConfirm = true)}
              aria-label="Remover estudo"
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
          class="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer"
          style="touch-action: manipulation;"
          onclick={handleConfirm}
        >
          {mode === "add" ? "Adicionar" : "Atualizar"}
        </button>
      </div>
    </div>
  </div>
{/if}
