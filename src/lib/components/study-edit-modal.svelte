<script lang="ts">
	import { studiesStore, calculateAll } from '$lib/stores/calculator-store';
	import type { AmortizationSystem, Study } from '$lib/calculator/types';

	let {
		open = $bindable(false),
		mode = 'add' as 'add' | 'edit',
		editStudy = undefined as Study | undefined
	}: {
		open?: boolean;
		mode?: 'add' | 'edit';
		editStudy?: Study;
	} = $props();

	const SYSTEMS: { key: AmortizationSystem; label: string }[] = [
		{ key: 'price', label: 'PRICE' },
		{ key: 'sac', label: 'SAC' },
		{ key: 'sam', label: 'SAM' },
		{ key: 'americano', label: 'Americano' }
	];

	let name = $state('');
	let system = $state<AmortizationSystem>('price');
	let principal = $state('500000');
	let annualRate = $state('10');
	let termMonths = $state('360');
	let downPayment = $state('0');

	$effect(() => {
		if (open) {
			if (mode === 'edit' && editStudy) {
				name = editStudy.name;
				system = editStudy.system;
				principal = editStudy.principal;
				annualRate = editStudy.annualRate;
				termMonths = editStudy.termMonths;
				downPayment = editStudy.downPayment;
			} else {
				const active = $studiesStore.studies.find((s) => s.id === $studiesStore.activeStudyId);
				name = SYSTEMS.find((s) => s.key === system)?.label ?? 'Novo';
				system = 'price';
				principal = active?.principal ?? '500000';
				annualRate = active?.annualRate ?? '10';
				termMonths = active?.termMonths ?? '360';
				downPayment = active?.downPayment ?? '0';
			}
		}
	});

	function handleConfirm() {
		if (mode === 'add') {
			const newStudy: Study = {
				id: Date.now().toString(),
				name: name || SYSTEMS.find((s) => s.key === system)?.label || 'Novo',
				system,
				principal,
				annualRate,
				termMonths,
				downPayment,
				extraPayments: []
			};
			studiesStore.addStudy(newStudy);
		} else if (mode === 'edit' && editStudy) {
			studiesStore.updateStudy(editStudy.id, {
				name: name || SYSTEMS.find((s) => s.key === system)?.label || editStudy.name,
				system,
				principal,
				annualRate,
				termMonths,
				downPayment
			});
		}
		open = false;
	}

	function handleBackdrop() {
		open = false;
	}

	function handleRemove() {
		if (!editStudy) return;
		studiesStore.update((s) => {
			const remaining = s.studies.filter((st) => st.id !== editStudy!.id);
			const newActiveId = s.activeStudyId === editStudy!.id
				? (remaining[0]?.id ?? s.studies[0].id)
				: s.activeStudyId;
			return { ...s, studies: remaining, activeStudyId: newActiveId };
		});
		calculateAll();
		open = false;
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onclick={handleBackdrop} onkeydown={(e: KeyboardEvent) => { if (e.key === 'Escape') { open = false; } }} role="dialog" aria-modal="true" aria-label="Estudo" tabindex="0">
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div role="document" class="bg-background p-6 rounded-xl max-w-sm w-full mx-4" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-base font-semibold mb-4">{mode === 'add' ? 'Novo Estudo' : 'Editar Estudo'}</h2>

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
								class="px-3 py-1.5 text-sm rounded-lg border transition-colors {system === opt.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-accent'} cursor-pointer"
								onclick={() => (system = opt.key)}
							>
								{opt.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="study-principal" class="text-sm font-medium">Valor (R$)</label>
						<input
							id="study-principal"
							type="text"
							inputmode="numeric"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
							bind:value={principal}
						/>
					</div>
					<div>
						<label for="study-down" class="text-sm font-medium">Entrada (R$)</label>
						<input
							id="study-down"
							type="text"
							inputmode="numeric"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
							bind:value={downPayment}
						/>
					</div>
					<div>
						<label for="study-rate" class="text-sm font-medium">Taxa (% a.a.)</label>
						<input
							id="study-rate"
							type="text"
							inputmode="decimal"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
							bind:value={annualRate}
						/>
					</div>
					<div>
						<label for="study-term" class="text-sm font-medium">Prazo (meses)</label>
						<input
							id="study-term"
							type="text"
							inputmode="numeric"
							class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
							bind:value={termMonths}
						/>
					</div>
				</div>
			</div>

			<div class="flex gap-3 mt-5">
				{#if mode === 'edit'}
					<button
						class="shrink-0 w-10 h-10 rounded-full border border-destructive text-destructive flex items-center justify-center hover:bg-destructive/10 cursor-pointer"
						onclick={handleRemove}
						aria-label="Remover estudo"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
					</button>
				{/if}
				<button
					class="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer"
					onclick={handleConfirm}
				>
					{mode === 'add' ? 'Adicionar' : 'Atualizar'}
				</button>
			</div>
		</div>
	</div>
{/if}
