<script lang="ts">
  import { studiesStore, calculateAll } from "$lib/stores/calculator-store";
  import type { FieldKey } from "$lib/stores/calculator-store";
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
  let editStudy: Study | undefined = $state(undefined);

  function effectiveValue(field: FieldKey): string {
    const overrides = $studiesStore.overrides[$studiesStore.activeStudyId];
    return overrides?.[field] ?? $studiesStore.commonValues[field];
  }

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

  function updateField(field: FieldKey, raw: string) {
    studiesStore.updateField(field, raw);
    handleFormChange();
  }

  function handleAddStudy() {
    editMode = "add";
    editStudy = { ...$studiesStore.commonValues, ...$studiesStore.overrides };
    editModalOpen = true;
  }

  function handleEditStudy() {
    editMode = "edit";
    editStudy = { ...$studiesStore.commonValues, ...$studiesStore.overrides };
    editModalOpen = true;
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
          inputmode="numeric"
          placeholder="500.000"
          value={effectiveValue("principal")}
          onchange={(v) => updateField("principal", v)}
          locked={isLocked("principal")}
          showRevert={isOverridden("principal")}
          onlocktoggle={() => handleFieldLockToggle("principal")}
          onrevert={() => handleFieldRevert("principal")}
          min="1"
        />
      </div>
      <div>
        <Label for="m-downPayment" class="text-xs">Entrada (R$)</Label>
        <SwipeInput
          id="m-downPayment"
          inputmode="numeric"
          placeholder="0"
          value={effectiveValue("downPayment")}
          onchange={(v) => updateField("downPayment", v)}
          locked={isLocked("downPayment")}
          showRevert={isOverridden("downPayment")}
          onlocktoggle={() => handleFieldLockToggle("downPayment")}
          onrevert={() => handleFieldRevert("downPayment")}
          min="0"
        />
      </div>
      <div>
        <Label for="m-rate" class="text-xs">Taxa (% a.a.)</Label>
        <SwipeInput
          id="m-rate"
          inputmode="numeric"
          placeholder="10"
          value={effectiveValue("annualRate")}
          onchange={(v) => updateField("annualRate", v)}
          locked={isLocked("annualRate")}
          showRevert={isOverridden("annualRate")}
          onlocktoggle={() => handleFieldLockToggle("annualRate")}
          onrevert={() => handleFieldRevert("annualRate")}
          min="0.01"
        />
      </div>
      <div>
        <Label for="m-term" class="text-xs">Prazo (meses)</Label>
        <SwipeInput
          id="m-term"
          inputmode="month"
          placeholder="360"
          value={effectiveValue("termMonths")}
          onchange={(v) => updateField("termMonths", v)}
          locked={isLocked("termMonths")}
          showRevert={isOverridden("termMonths")}
          onlocktoggle={() => handleFieldLockToggle("termMonths")}
          onrevert={() => handleFieldRevert("termMonths")}
          min="1"
        />
      </div>
    </div>
    <button
      class="w-full mt-2 h-12 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer"
      onclick={() => (exportModalOpen = true)}
    >
      Exportar
    </button>
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
          inputmode="numeric"
          placeholder="Ex: 500.000"
          value={effectiveValue("principal")}
          onchange={(v) => updateField("principal", v)}
          locked={isLocked("principal")}
          showRevert={isOverridden("principal")}
          onlocktoggle={() => handleFieldLockToggle("principal")}
          onrevert={() => handleFieldRevert("principal")}
          min="1"
          class="mt-1"
        />
      </div>

      <div>
        <Label for="downPayment" class="text-sm">Entrada (R$)</Label>
        <SwipeInput
          id="downPayment"
          inputmode="numeric"
          placeholder="Ex: 100.000"
          value={effectiveValue("downPayment")}
          onchange={(v) => updateField("downPayment", v)}
          locked={isLocked("downPayment")}
          showRevert={isOverridden("downPayment")}
          onlocktoggle={() => handleFieldLockToggle("downPayment")}
          onrevert={() => handleFieldRevert("downPayment")}
          min="0"
          class="mt-1"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label for="annualRate" class="text-sm">Taxa de Juros (% ao ano)</Label>
        <SwipeInput
          id="annualRate"
          inputmode="numeric"
          placeholder="Ex: 10,5"
          value={effectiveValue("annualRate")}
          onchange={(v) => updateField("annualRate", v)}
          locked={isLocked("annualRate")}
          showRevert={isOverridden("annualRate")}
          onlocktoggle={() => handleFieldLockToggle("annualRate")}
          onrevert={() => handleFieldRevert("annualRate")}
          min="0.01"
          class="mt-1"
        />
      </div>

      <div>
        <Label for="termMonths" class="text-sm">Prazo (meses)</Label>
        <SwipeInput
          id="termMonths"
          inputmode="month"
          placeholder="Ex: 360"
          value={effectiveValue("termMonths")}
          onchange={(v) => updateField("termMonths", v)}
          locked={isLocked("termMonths")}
          showRevert={isOverridden("termMonths")}
          onlocktoggle={() => handleFieldLockToggle("termMonths")}
          onrevert={() => handleFieldRevert("termMonths")}
          min="1"
          class="mt-1"
        />
      </div>
    </div>
  </div>
{/if}

<StudyEditModal bind:open={editModalOpen} mode={editMode} {editStudy} />
