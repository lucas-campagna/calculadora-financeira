<script lang="ts">
  import { studiesStore, calculateAll } from "$lib/stores/calculator-store";
  import type { FieldKey, StudiesState } from "$lib/stores/calculator-store";
  import type { AmortizationSystem, Study } from "$lib/calculator/types";
  import SwipeInput from "$lib/components/ui/swipe-input.svelte";
  import revertIcon from "$lib/assets/icons/revert.svg?raw";
  import { STUDY_COLORS } from "$lib/constants";

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

  let disabled = $derived(
    mode === "edit" && editStudy?.id
      ? ($studiesStore.studies.find((s) => s.id === editStudy.id)?.disabled ??
          false)
      : false,
  );

  let currentColor = $state(STUDY_COLORS[0]);

  let initialValues = $state({
    principal: 0,
    annualRate: 0,
    termMonths: 0,
    downPayment: 0,
  });

  let previousOverrides = $state<Partial<Record<FieldKey, number>>>({});

  let initialName = $state("");
  let initialSystem = $state<AmortizationSystem>("price");

  let isInitialized = false;

  let rateMode = $state<"annual" | "monthly">("annual");

  function annualToMonthly(annual: number): number {
    return ((1 + annual / 100) ** (1 / 12) - 1) * 100;
  }

  function monthlyToAnnual(monthly: number): number {
    return ((1 + monthly / 100) ** 12 - 1) * 100;
  }

  let displayRate = $derived(
    rateMode === "annual" ? annualRate : annualToMonthly(annualRate),
  );

  let rateModeIcon = $derived(rateMode === "annual" ? "a.a." : "a.m.");

  function toggleRateMode() {
    rateMode = rateMode === "annual" ? "monthly" : "annual";
  }

  $effect(() => {
    if (!open) {
      isInitialized = false;
      return;
    }
    if (isInitialized) return;
    isInitialized = true;

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
      initialName = name;
      initialSystem = system;
      const studyIndex = store.studies.findIndex((s) => s.id === editStudy.id);
      const existingColor = store.studies.find(
        (s) => s.id === editStudy.id,
      )?.color;
      currentColor =
        existingColor ?? STUDY_COLORS[studyIndex % STUDY_COLORS.length];
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
      disabled = false;
      previousOverrides = {};
    }
  });

  const hasChanges = $derived(
    mode === "edit"
      ? name !== initialName ||
          system !== initialSystem ||
          principal !== initialValues.principal ||
          annualRate !== initialValues.annualRate ||
          termMonths !== initialValues.termMonths ||
          downPayment !== initialValues.downPayment
      : true,
  );

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
        id:
          crypto.randomUUID?.() ??
          `${Date.now()}-${Math.random().toString(36).slice(2)}`,
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

  function handleCycleColor() {
    if (!editStudy?.id) return;
    const currentIndex = STUDY_COLORS.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % STUDY_COLORS.length;
    currentColor = STUDY_COLORS[nextIndex];
    studiesStore.updateStudyColor(editStudy.id, currentColor);
  }

  function handleClone() {
    if (!editStudy?.id) return;
    const newId = studiesStore.cloneStudy(editStudy.id);
    if (newId) {
      open = false;
    }
  }

  function makeActionButtons(
    field: FieldKey,
  ): { icon: () => string; onclick: () => void }[] {
    if (field === "annualRate") {
      return [
        {
          icon: () =>
            `<span class="text-xs font-bold">% ${rateModeIcon}</span>`,
          onclick: toggleRateMode,
        },
      ];
    }

    const currentValue =
      field === "principal"
        ? principal
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
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold">
          {mode === "add" ? "Novo Estudo" : "Editar Estudo"}
        </h2>
        {#if mode === "edit" && editStudy?.id}
          <div class="flex items-center gap-1">
            <button
              class="shrink-0 w-8 h-8 rounded-md border border-input flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
              onclick={handleCycleColor}
              aria-label="Mudar cor do estudo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="15" fill={currentColor} />
              </svg>
            </button>
            <button
              class="shrink-0 w-8 h-8 rounded-md border border-input flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
              onclick={handleClone}
              aria-label="Clonar estudo"
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
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16V4a2 2 0 0 1 2-2h12" />
              </svg>
            </button>
            <button
              class="shrink-0 w-8 h-8 rounded-md border border-input flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
              onclick={() => {
                if (editStudy?.id) studiesStore.toggleDisabled(editStudy.id);
              }}
              aria-label={disabled ? "Habilitar estudo" : "Desabilitar estudo"}
            >
              {#if disabled}
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
                  ><path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  /><line x1="1" x2="23" y1="1" y2="23" /></svg
                >
              {:else}
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
                  ><path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  /><circle cx="12" cy="12" r="3" /></svg
                >
              {/if}
            </button>
          </div>
        {/if}
      </div>

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
            <label for="study-rate" class="text-sm font-medium">Taxa</label>
            <SwipeInput
              id="study-rate"
              decimals={rateMode === "annual" ? 2 : 3}
              placeholder="10"
              value={displayRate}
              onchange={(v) =>
                (annualRate = rateMode === "annual" ? v : monthlyToAnnual(v))}
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
          class="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style="touch-action: manipulation;"
          onclick={handleConfirm}
          disabled={mode === "edit" && !hasChanges}
        >
          {mode === "add" ? "Adicionar" : "Atualizar"}
        </button>
      </div>
    </div>
  </div>
{/if}
