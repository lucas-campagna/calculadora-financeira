<script lang="ts">
  import { studiesStore } from "$lib/stores/calculator-store";
  import type { Study } from "$lib/calculator/types";
  import { STUDY_COLORS } from "$lib/constants";

  function getPillClasses(
    isActive: boolean,
    hasOverrides: boolean,
    isDisabled: boolean,
  ): string {
    if (isDisabled) return "text-white border-transparent";
    if (isActive) return "text-white border-transparent";
    if (hasOverrides) return "text-white border-transparent";
    return "text-white border-transparent";
  }

  function getPillStyle(
    isActive: boolean,
    color: string,
    isDisabled: boolean,
  ): string {
    if (isDisabled) {
      return "background-color: #9ca3af; border-color: #9ca3af;";
    }
    const dimmedBg = color + "b3";
    if (isActive) {
      return `background-color: ${color}; border-color: color-mix(in srgb, ${color} 60%, black); box-shadow: inset 0 0 0 2px rgba(255,255,255,0.5);`;
    }
    return `background-color: ${dimmedBg}; border-color: ${color};`;
  }

  let {
    onadd = () => {},
    onedit = (_study: Study) => {},
  }: {
    onadd?: () => void;
    onedit?: (study: Study) => void;
  } = $props();

  let showRestoreConfirm = $state(false);

  function isInitialState(): boolean {
    const s = $studiesStore;
    if (s.studies.length !== 2) return false;
    if (Object.keys(s.overrides).length > 0) return false;
    if (s.commonValues.principal !== 500000) return false;
    if (s.commonValues.annualRate !== 10) return false;
    if (s.commonValues.termMonths !== 360) return false;
    if (s.commonValues.downPayment !== 0) return false;
    const defaults = [
      { name: "SAC", system: "sac" as const },
      { name: "PRICE", system: "price" as const },
    ];
    for (let i = 0; i < 2; i++) {
      const st = s.studies[i];
      const df = defaults[i];
      if (!st || st.name !== df.name || st.system !== df.system) return false;
      if (st.extraPayments.length > 0) return false;
    }
    return true;
  }

  let isRestored = $derived(isInitialState());

  function handlePillClick(id: string) {
    const study = $studiesStore.studies.find((s) => s.id === id);
    if (!study) return;

    if (study.disabled) {
      if ($studiesStore.activeStudyId === id) {
        const firstStudy = $studiesStore.studies.find((s) => !s.disabled);
        if (firstStudy) studiesStore.setActive(firstStudy.id);
      }
      onedit(study);
      return;
    }

    if (id === $studiesStore.activeStudyId) {
      onedit(study);
    } else {
      studiesStore.setActive(id);
    }
  }
</script>

<div class="flex flex-nowrap items-center gap-2">
  <button
    class="shrink-0 w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
    onclick={onadd}
    aria-label="Adicionar estudo"
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
      stroke-linejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg
    >
  </button>

  <button
    class="shrink-0 w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center transition-colors {isRestored
      ? 'opacity-40 cursor-not-allowed'
      : 'hover:bg-primary/10 cursor-pointer'}"
    onclick={() => {
      if (!isRestored) showRestoreConfirm = true;
    }}
    aria-label="Restaurar estudos"
    disabled={isRestored}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
        d="M3 3v5h5"
      /></svg
    >
  </button>

  {#if showRestoreConfirm}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onclick={() => (showRestoreConfirm = false)}
      onkeydown={(e: KeyboardEvent) => {
        if (e.key === "Escape") showRestoreConfirm = false;
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar restauracao"
      tabindex="0"
    >
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        role="document"
        class="bg-background p-6 rounded-xl max-w-sm w-full mx-4"
        onclick={(e) => e.stopPropagation()}
      >
        <h2 class="text-base font-semibold mb-2">Restaurar valores?</h2>
        <p class="text-sm text-muted-foreground mb-4">
          Todos os estudos serão resetados para os valores iniciais. Esta ação
          não pode ser desfeita.
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 h-10 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 cursor-pointer"
            onclick={() => {
              studiesStore.restore();
              showRestoreConfirm = false;
            }}
          >
            Restaurar
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div
    class="flex-1 min-w-0 overflow-x-auto scrollbar-hide flex flex-nowrap items-center gap-2"
  >
    {#each $studiesStore.studies as study, i (study.id)}
      {@const studyOverrides = $studiesStore.overrides[study.id]}
      {@const hasOverrides =
        studyOverrides && Object.keys(studyOverrides).length > 0}
      {@const isActive = $studiesStore.activeStudyId === study.id}
      {@const isDisabled = !!study.disabled}
      <button
        class="shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer select-none {getPillClasses(
          isActive,
          hasOverrides,
          isDisabled,
        )}"
        style={getPillStyle(
          isActive,
          study.color ?? STUDY_COLORS[i % STUDY_COLORS.length],
          isDisabled,
        )}
        onclick={() => handlePillClick(study.id)}
      >
        {study.name}
      </button>
    {/each}
  </div>
</div>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
