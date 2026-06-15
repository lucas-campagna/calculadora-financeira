<script lang="ts">
	import { studiesStore } from '$lib/stores/calculator-store';
	import type { Study } from '$lib/calculator/types';

	let {
		onadd = () => {},
		onedit = (_study: Study) => {}
	}: {
		onadd?: () => void;
		onedit?: (study: Study) => void;
	} = $props();

	let longPressTimer: ReturnType<typeof setTimeout> | null = null;
	let longPressTarget: string | null = null;

	function handlePillClick(id: string) {
		if (longPressTarget === id) {
			longPressTarget = null;
			return;
		}
		studiesStore.setActive(id);
	}

	function handlePillTouchStart(id: string) {
		longPressTimer = setTimeout(() => {
			longPressTarget = id;
			const study = $studiesStore.studies.find((s) => s.id === id);
			if (study) onedit(study);
		}, 500);
	}

	function handlePillTouchEnd() {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
	}

	function handlePillContextMenu(study: Study, e: Event) {
		e.preventDefault();
		onedit(study);
	}
</script>

<div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
	<button
		class="shrink-0 w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
		onclick={onadd}
		aria-label="Adicionar estudo"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
	</button>

	<button
		class="shrink-0 w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
		onclick={() => { studiesStore.restore(); }}
		aria-label="Restaurar estudos"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
	</button>

	{#each $studiesStore.studies as study (study.id)}
		{@const studyOverrides = $studiesStore.overrides[study.id]}
		{@const hasOverrides = studyOverrides && Object.keys(studyOverrides).length > 0}
		{@const isActive = $studiesStore.activeStudyId === study.id}
		<button
			class="shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer select-none {isActive ? 'bg-primary text-primary-foreground border-primary' : hasOverrides ? 'bg-background text-foreground border-input hover:bg-accent' : 'bg-muted text-muted-foreground border-muted'}"
			onclick={() => handlePillClick(study.id)}
			ontouchstart={() => handlePillTouchStart(study.id)}
			ontouchend={handlePillTouchEnd}
			oncontextmenu={(e) => handlePillContextMenu(study, e)}
		>
			{study.name}
		</button>
	{/each}
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar { display: none; }
	.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
