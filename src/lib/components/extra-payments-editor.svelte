<script lang="ts">
	import type { ExtraPayment } from '$lib/calculator/types';
	import { calculatorStore } from '$lib/stores/calculator-store';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';

	function addExtraPayment() {
		$calculatorStore.extraPayments = [
			...$calculatorStore.extraPayments,
			{ month: 1, amount: 0, type: 'reduce_term' }
		];
	}

	function removeExtraPayment(index: number) {
		$calculatorStore.extraPayments = $calculatorStore.extraPayments.filter((_, i) => i !== index);
	}

	function updateExtraPayment(index: number, field: keyof ExtraPayment, value: number | string) {
		const updated = [...$calculatorStore.extraPayments];
		if (field === 'type') {
			updated[index] = { ...updated[index], type: value as 'reduce_installment' | 'reduce_term' };
		} else {
			updated[index] = { ...updated[index], [field]: Number(value) };
		}
		$calculatorStore.extraPayments = updated;
	}
</script>

<div class="mt-3 space-y-3">
	{#each $calculatorStore.extraPayments as ep, i}
		<div class="flex flex-wrap gap-2 items-end border rounded-md p-3">
			<div class="flex-1 min-w-[80px]">
				<label for="extra-month-{i}" class="text-xs text-muted-foreground">Mês</label>
				<Input
					id="extra-month-{i}"
					type="number"
					value={String(ep.month)}
					min="1"
					oninput={(e: Event) => updateExtraPayment(i, 'month', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="flex-1 min-w-[100px]">
				<label for="extra-amount-{i}" class="text-xs text-muted-foreground">Valor (R$)</label>
				<Input
					id="extra-amount-{i}"
					type="number"
					value={String(ep.amount)}
					min="0"
					oninput={(e: Event) => updateExtraPayment(i, 'amount', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="flex-1 min-w-[120px]">
				<label for="extra-type-{i}" class="text-xs text-muted-foreground">Tipo</label>
				<select
					id="extra-type-{i}"
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					value={ep.type}
					onchange={(e: Event) => updateExtraPayment(i, 'type', (e.target as HTMLSelectElement).value)}
				>
					<option value="reduce_term">Reduzir prazo</option>
					<option value="reduce_installment">Reduzir parcela</option>
				</select>
			</div>
			<Button variant="destructive" size="sm" onclick={() => removeExtraPayment(i)}>✕</Button>
		</div>
	{/each}
	<Button variant="outline" size="sm" onclick={addExtraPayment}>+ Adicionar pagamento extra</Button>
</div>