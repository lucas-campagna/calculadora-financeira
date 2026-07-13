<script lang="ts">
  import { studiesStore } from "$lib/stores/calculator-store";
  import type { FieldKey } from "$lib/stores/calculator-store";
  import { splitMonths } from "$lib/utils";
  import lockClosedIcon from "$lib/assets/icons/lock-closed.svg?raw";
  import lockOpenIcon from "$lib/assets/icons/lock-open.svg?raw";
  import revertIcon from "$lib/assets/icons/revert.svg?raw";
  import SwipeInput from "$lib/components/ui/swipe-input.svelte";
  import Label from "$lib/components/ui/label.svelte";
  import ExportModal from "$lib/components/export-modal.svelte";
  import StudyPills from "$lib/components/study-pills.svelte";
  import StudyEditModal from "$lib/components/study-edit-modal.svelte";
  import type { Study } from "$lib/calculator/types";

  let {
    onchange: handleFormChange = () => {},
    compact = false,
  }: {
    onchange?: () => void;
    compact?: boolean;
  } = $props();

  let exportModalOpen = $state(false);
  let editModalOpen = $state(false);
  let editMode = $state<"add" | "edit">("add");
  let editStudy: Partial<Study> | undefined = $state(undefined);
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }

  let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);

  let isStandalone = $state(false);

  $effect(() => {
    isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ||
      false;
  });

  async function triggerInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }

  $effect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      deferredPrompt = e as unknown as BeforeInstallPromptEvent;
    }
    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener,
    );
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  });

  const effectivePrincipal = $derived(
    $studiesStore.overrides[$studiesStore.activeStudyId]?.principal ??
      $studiesStore.commonValues.principal,
  );
  const effectiveDownPayment = $derived(
    $studiesStore.overrides[$studiesStore.activeStudyId]?.downPayment ??
      $studiesStore.commonValues.downPayment,
  );
  const effectiveAnnualRate = $derived(
    $studiesStore.overrides[$studiesStore.activeStudyId]?.annualRate ??
      $studiesStore.commonValues.annualRate,
  );
  const effectiveTermMonths = $derived(
    $studiesStore.overrides[$studiesStore.activeStudyId]?.termMonths ??
      $studiesStore.commonValues.termMonths,
  );

  function isLocked(field: FieldKey): boolean {
    return (
      $studiesStore.overrides[$studiesStore.activeStudyId]?.[field] ===
      undefined
    );
  }

  function isOverridden(field: FieldKey): boolean {
    const overrides = $studiesStore.overrides[$studiesStore.activeStudyId];
    if (!overrides) return false;
    const effective = overrides[field] ?? $studiesStore.commonValues[field];
    return effective !== $studiesStore.commonValues[field];
  }

  function handleFieldLockToggle(field: FieldKey) {
    studiesStore.toggleFieldLock(field);
  }

  function handleFieldRevert(field: FieldKey) {
    studiesStore.revertFieldToCommon(field);
  }

  function updateField(field: FieldKey, raw: string | number) {
    const numValue = typeof raw === "number" ? raw : Number(raw) || 0;
    if (field === "downPayment" && numValue > effectivePrincipal) {
      return;
    }
    if (field === "principal" && numValue < effectiveDownPayment) {
      studiesStore.updateField("downPayment", numValue);
      studiesStore.updateField(field, numValue);
    } else {
      studiesStore.updateField(field, raw);
    }
    handleFormChange();
  }

  function handleAddStudy() {
    editMode = "add";
    editStudy = {};
    editModalOpen = true;
  }

  function handleEditStudy(study: Study) {
    editMode = "edit";
    editStudy = { ...study };
    editModalOpen = true;
  }

  let termMonthsLabel = $derived.by(() => {
    if (effectiveTermMonths === 0) return "";
    const { years, months } = splitMonths(effectiveTermMonths);
    if (years === 0) {
      return months === 1 ? "1 mês" : `${months} meses`;
    }
    const yearLabel = years === 1 ? "1 ano" : `${years} anos`;
    if (months === 0) return yearLabel;
    const monthLabel = months === 1 ? "1 mês" : `${months} meses`;
    return `${yearLabel} e ${monthLabel}`;
  });

  let rateMode = $state<"annual" | "monthly">("annual");

  function annualToMonthly(annual: number): number {
    return ((1 + annual / 100) ** (1 / 12) - 1) * 100;
  }

  function monthlyToAnnual(monthly: number): number {
    return ((1 + monthly / 100) ** 12 - 1) * 100;
  }

  let displayRate = $derived(
    rateMode === "annual"
      ? effectiveAnnualRate
      : annualToMonthly(effectiveAnnualRate),
  );

  let rateLabel = $derived.by(() => {
    if (effectiveAnnualRate === 0) return "";
    if (rateMode === "annual") {
      const monthly = annualToMonthly(effectiveAnnualRate);
      return `${monthly.toFixed(3)}% a.m.`;
    } else {
      return `${effectiveAnnualRate.toFixed(2)}% a.a.`;
    }
  });

  let rateModeIcon = $derived(rateMode === "annual" ? "a.a." : "a.m.");

  function toggleRateMode() {
    rateMode = rateMode === "annual" ? "monthly" : "annual";
  }

  const actionButtonsMap = $derived({
    principal: makeActionButtons("principal"),
    downPayment: makeActionButtons("downPayment"),
    annualRate: [
      ...makeActionButtons("annualRate"),
      {
        icon: () => `<span class="text-xs font-bold">${rateModeIcon}</span>`,
        onclick: toggleRateMode,
      },
    ],
    termMonths: makeActionButtons("termMonths"),
  });

  function makeActionButtons(
    field: FieldKey,
  ): { icon: () => string; onclick: () => void }[] {
    const icons = [
      {
        icon: () => (isLocked(field) ? lockClosedIcon : lockOpenIcon),
        onclick: () => handleFieldLockToggle(field),
      },
    ];
    if (isOverridden(field) && !isLocked(field)) {
      icons.push({
        icon: () => revertIcon,
        onclick: () => handleFieldRevert(field),
      });
    }

    return icons;
  }
</script>

{#if compact}
  <div>
    <div class="mb-2">
      <StudyPills onadd={handleAddStudy} onedit={handleEditStudy} />
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <Label for="m-principal" class="text-xs">Valor (R$)</Label>
        <SwipeInput
          id="m-principal"
          decimals={2}
          placeholder="500.000"
          value={effectivePrincipal}
          onchange={(v) => updateField("principal", v)}
          min={1}
          actionButtons={actionButtonsMap.principal}
        />
      </div>
      <div>
        <Label for="m-downPayment" class="text-xs">Entrada (R$)</Label>
        <SwipeInput
          id="m-downPayment"
          decimals={2}
          placeholder="0"
          value={effectiveDownPayment}
          onchange={(v) => updateField("downPayment", v)}
          actionButtons={actionButtonsMap.downPayment}
        />
      </div>
      <div>
        <Label for="m-rate" class="text-xs"
          >Taxa (% {rateMode === "annual" ? "a.a." : "a.m."})</Label
        >
        <SwipeInput
          id="m-rate"
          decimals={rateMode === "annual" ? 2 : 3}
          placeholder="10"
          value={displayRate}
          onchange={(v) =>
            updateField(
              "annualRate",
              rateMode === "annual" ? v : monthlyToAnnual(v),
            )}
          min={0.01}
          label={rateLabel}
          actionButtons={actionButtonsMap.annualRate}
        />
      </div>
      <div>
        <Label for="m-term" class="text-xs">Prazo (meses)</Label>
        <SwipeInput
          id="m-term"
          decimals={0}
          placeholder="360"
          value={effectiveTermMonths}
          onchange={(v) => updateField("termMonths", v)}
          min={1}
          step={1}
          label={termMonthsLabel}
          actionButtons={actionButtonsMap.termMonths}
        />
      </div>
    </div>
    <div class="flex gap-2 mt-2">
      {#if !isStandalone && deferredPrompt}
        <button
          class="h-12 w-12 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shrink-0"
          onclick={() => triggerInstall()}
          aria-label="Instalar app"
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
            stroke-linejoin="round"
            class="mx-auto"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      {/if}
      <button
        class="flex-1 h-12 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer"
        onclick={() => (exportModalOpen = true)}
      >
        Exportar
      </button>
    </div>
  </div>

  <ExportModal bind:open={exportModalOpen} />
{:else}
  <div class="space-y-4">
    <StudyPills onadd={handleAddStudy} onedit={handleEditStudy} />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label for="principal" class="text-sm"
          >Valor do Financiamento (R$)</Label
        >
        <SwipeInput
          id="principal"
          decimals={2}
          placeholder="Ex: 500.000"
          value={effectivePrincipal}
          onchange={(v) => updateField("principal", v)}
          min={1}
          class="mt-1"
          actionButtons={actionButtonsMap.principal}
        />
      </div>

      <div>
        <Label for="downPayment" class="text-sm">Entrada (R$)</Label>
        <SwipeInput
          id="downPayment"
          decimals={2}
          placeholder="Ex: 100.000"
          value={effectiveDownPayment}
          onchange={(v) => updateField("downPayment", v)}
          class="mt-1"
          actionButtons={actionButtonsMap.downPayment}
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label for="annualRate" class="text-sm"
          >Taxa de Juros (% {rateMode === "annual" ? "a.a." : "a.m."})</Label
        >
        <SwipeInput
          id="annualRate"
          decimals={rateMode === "annual" ? 2 : 3}
          placeholder="Ex: 10,5"
          value={displayRate}
          onchange={(v) =>
            updateField(
              "annualRate",
              rateMode === "annual" ? v : monthlyToAnnual(v),
            )}
          min={0.01}
          class="mt-1"
          actionButtons={actionButtonsMap.annualRate}
        />
      </div>

      <div>
        <Label for="termMonths" class="text-sm">Prazo (meses)</Label>
        <SwipeInput
          id="termMonths"
          decimals={0}
          placeholder="Ex: 360"
          value={effectiveTermMonths}
          onchange={(v) => updateField("termMonths", v)}
          min={1}
          step={1}
          class="mt-1"
          label={termMonthsLabel}
          actionButtons={actionButtonsMap.termMonths}
        />
      </div>
    </div>
  </div>
{/if}

<StudyEditModal bind:open={editModalOpen} mode={editMode} {editStudy} />
