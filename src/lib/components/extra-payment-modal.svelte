<script lang="ts">
	import { calculatorStore, calculateAll } from '$lib/stores/calculator-store';
	import SwipeInput from '$lib/components/ui/swipe-input.svelte';

	let {
		open = $bindable(false),
		month = 1,
		onclose
	}: {
		open?: boolean;
		month?: number;
		onclose?: () => void;
	} = $props();

	let extraMonth = $state('1');
	let extraAmount = $state('');
	let extraType = $state<'reduce_term' | 'reduce_installment'>('reduce_term');

	$effect(() => {
		if (open) {
			extraMonth = String(month);
			extraAmount = '';
			extraType = 'reduce_term';
			setTimeout(() => {
				const el = document.getElementById('extra-modal-amount');
				el?.focus();
			}, 100);
		}
	});

	function updateMonth(raw: string) {
		extraMonth = raw;
	}

	function updateAmount(raw: string) {
		extraAmount = raw;
	}

	function handleSave() {
		const m = parseInt(extraMonth) || 0;
		const a = parseInt(extraAmount.replace(/[^\d]/g, '')) || 0;
		if (m <= 0 || a <= 0) return;

		const existing = $calculatorStore.extraPayments.find((ep) => ep.month === m);
		if (existing) {
			$calculatorStore.extraPayments = $calculatorStore.extraPayments.map((ep) =>
				ep.month === m ? { ...ep, amount: ep.amount + a, type: extraType } : ep
			);
		} else {
			$calculatorStore.extraPayments = [
				...$calculatorStore.extraPayments,
				{ month: m, amount: a, type: extraType }
			];
		}

		calculateAll();
		open = false;
		onclose?.();
	}

	function handleCancel() {
		open = false;
		onclose?.();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onclick={handleCancel} role="dialog" aria-modal="true" aria-label="Pagamento extra">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="bg-background p-6 rounded-xl max-w-sm w-full mx-4" onclick={(e) => e.stopPropagation()}>
			<h2 class="text-xl font-semibold mb-4">Pagamento Extra</h2>

			<div class="space-y-4">
				<div>
					<label for="extra-modal-month" class="text-base font-medium">Mes</label>
					<SwipeInput
						id="extra-modal-month"
						inputmode="numeric"
						placeholder="Mes"
						value={extraMonth}
						onchange={updateMonth}
						min="1"
						class="mt-1.5"
					/>
				</div>

				<div>
					<label for="extra-modal-amount" class="text-base font-medium">Valor (R$)</label>
					<SwipeInput
						id="extra-modal-amount"
						inputmode="numeric"
						placeholder="Ex: 5.000"
						value={extraAmount}
						onchange={updateAmount}
						min="0"
						class="mt-1.5"
					/>
					<p class="text-xs text-muted-foreground mt-1">Arraste para cima/baixo para ajustar o valor</p>
				</div>

				<div>
					<label for="extra-modal-type" class="text-base font-medium">Tipo</label>
					<select
						id="extra-modal-type"
						class="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base mt-1.5"
						bind:value={extraType}
					>
						<option value="reduce_term">Reduzir prazo</option>
						<option value="reduce_installment">Reduzir parcela</option>
					</select>
				</div>
			</div>

			<div class="flex gap-3 mt-5">
				<button class="flex-1 h-12 rounded-lg border border-input bg-background text-base font-medium hover:bg-accent cursor-pointer" onclick={handleCancel}>
					Cancelar
				</button>
				<button class="flex-1 h-12 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 cursor-pointer" onclick={handleSave}>
					Adicionar
				</button>
			</div>
		</div>
	</div>
{/if}