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
		class="shrink-0 w-8 h-8 rounded-full border border-dashed border-primary/50 text-primary flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
		onclick={onadd}
		aria-label="Adicionar estudo"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
	</button>

	<button
		class="shrink-0 w-8 h-8 rounded-full border {$studiesStore.syncLocked ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-input hover:bg-accent'} flex items-center justify-center transition-colors cursor-pointer"
		onclick={() => { studiesStore.toggleLock(); }}
		aria-label="{$studiesStore.syncLocked ? 'Desbloquear: editar apenas estudo ativo' : 'Bloquear: sincronizar valores entre estudos'}"
	>
		{#if $studiesStore.syncLocked}
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 5-5 1.6 1.6 0 0 1 1 .4"/></svg>
		{/if}
	</button>

	{#each $studiesStore.studies as study (study.id)}
		<button
			class="shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer select-none {$studiesStore.syncLocked || $studiesStore.activeStudyId === study.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-input hover:bg-accent'}"
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