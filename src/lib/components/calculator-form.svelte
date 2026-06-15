<script lang="ts">
	import { calculatorStore, calculateAll } from '$lib/stores/calculator-store';
	import SwipeInput from '$lib/components/ui/swipe-input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import ExportModal from '$lib/components/export-modal.svelte';
	import type { AmortizationSystem } from '$lib/calculator/types';

	let {
		onchange: handleFormChange = () => {},
		compact = false,
		selectedSystem = $bindable('price' as AmortizationSystem)
	}: {
		onchange?: () => void;
		compact?: boolean;
		selectedSystem?: AmortizationSystem;
	} = $props();

	let exportModalOpen = $state(false);

	function updateField(field: 'principal' | 'downPayment' | 'termMonths', raw: string) {
		$calculatorStore[field] = raw;
		calculateAll();
		handleFormChange();
	}

	function updateRate(raw: string) {
		$calculatorStore.annualRate = raw;
		calculateAll();
		handleFormChange();
	}
</script>

{#if compact}
	<!-- Mobile: 2x2 grid + export button -->
	<div>
		<div class="grid grid-cols-2 gap-2">
			<div>
				<Label for="m-principal" class="text-xs">Valor (R$)</Label>
				<SwipeInput
					id="m-principal"
					inputmode="numeric"
					placeholder="500.000"
					value={$calculatorStore.principal}
					onchange={(v) => updateField('principal', v)}
					min="1"
				/>
			</div>
			<div>
				<Label for="m-downPayment" class="text-xs">Entrada (R$)</Label>
				<SwipeInput
					id="m-downPayment"
					inputmode="numeric"
					placeholder="0"
					value={$calculatorStore.downPayment}
					onchange={(v) => updateField('downPayment', v)}
					min="0"
				/>
			</div>
			<div>
				<Label for="m-rate" class="text-xs">Taxa (% a.a.)</Label>
				<SwipeInput
					id="m-rate"
					inputmode="decimal"
					placeholder="10"
					decimal={true}
					value={$calculatorStore.annualRate}
					onchange={updateRate}
					min="0.01"
				/>
			</div>
			<div>
				<Label for="m-term" class="text-xs">Prazo (meses)</Label>
				<SwipeInput
					id="m-term"
					inputmode="numeric"
					placeholder="360"
					value={$calculatorStore.termMonths}
					onchange={(v) => updateField('termMonths', v)}
					min="1"
				/>
			</div>
		</div>
		<button
			class="w-full mt-2 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer"
			onclick={() => (exportModalOpen = true)}
		>
			Exportar
		</button>
	</div>

	<ExportModal bind:open={exportModalOpen} bind:selectedSystem />
{:else}
	<!-- Desktop: full form, no extras toggle -->
	<div class="space-y-4">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<Label for="principal" class="text-sm">Valor do Financiamento (R$)</Label>
				<SwipeInput
					id="principal"
					inputmode="numeric"
					placeholder="Ex: 500.000"
					value={$calculatorStore.principal}
					onchange={(v) => updateField('principal', v)}
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
					value={$calculatorStore.downPayment}
					onchange={(v) => updateField('downPayment', v)}
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
					inputmode="decimal"
					placeholder="Ex: 10,5"
					decimal={true}
					value={$calculatorStore.annualRate}
					onchange={updateRate}
					min="0.01"
					class="mt-1"
				/>
			</div>

			<div>
				<Label for="termMonths" class="text-sm">Prazo (meses)</Label>
				<SwipeInput
					id="termMonths"
					inputmode="numeric"
					placeholder="Ex: 360"
					value={$calculatorStore.termMonths}
					onchange={(v) => updateField('termMonths', v)}
					min="1"
					class="mt-1"
				/>
			</div>
		</div>
	</div>
{/if}