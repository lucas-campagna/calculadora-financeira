<script lang="ts">
	import { calculatorStore } from '$lib/stores/calculator-store';
	import { calculateAll } from '$lib/stores/calculator-store';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import SwipeInput from '$lib/components/ui/swipe-input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import ExtraPaymentsEditor from '$lib/components/extra-payments-editor.svelte';

	let showExtras = $state(false);

	function updateField(field: 'principal' | 'downPayment' | 'termMonths', raw: string) {
		$calculatorStore[field] = raw;
	}

	function updateRate(raw: string) {
		$calculatorStore.annualRate = raw;
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Simular Financiamento</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-5">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div>
					<Label for="principal" class="text-base">Valor do Financiamento (R$)</Label>
					<SwipeInput
						id="principal"
						inputmode="numeric"
						placeholder="Ex: 500.000"
						value={$calculatorStore.principal}
						onchange={(v) => updateField('principal', v)}
						min="1"
						class="mt-1.5"
					/>
				</div>

				<div>
					<Label for="downPayment" class="text-base">Entrada (R$)</Label>
					<SwipeInput
						id="downPayment"
						inputmode="numeric"
						placeholder="Ex: 100.000"
						value={$calculatorStore.downPayment}
						onchange={(v) => updateField('downPayment', v)}
						min="0"
						class="mt-1.5"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div>
					<Label for="annualRate" class="text-base">Taxa de Juros (% ao ano)</Label>
					<SwipeInput
						id="annualRate"
						inputmode="decimal"
						placeholder="Ex: 10,5"
						decimal={true}
						value={$calculatorStore.annualRate}
						onchange={updateRate}
						min="0.01"
						class="mt-1.5"
					/>
				</div>

				<div>
					<Label for="termMonths" class="text-base">Prazo (meses)</Label>
					<SwipeInput
						id="termMonths"
						inputmode="numeric"
						placeholder="Ex: 360"
						value={$calculatorStore.termMonths}
						onchange={(v) => updateField('termMonths', v)}
						min="1"
						class="mt-1.5"
					/>
				</div>
			</div>

			<div>
				<button
					class="text-base text-primary hover:underline py-1"
					onclick={() => (showExtras = !showExtras)}
				>
					{showExtras ? '▲ Ocultar' : '▼ Adicionar'} pagamentos extras
				</button>
				{#if showExtras}
					<ExtraPaymentsEditor />
				{/if}
			</div>

			<Button variant="default" size="lg" class="w-full text-lg h-14" onclick={calculateAll}>
				Calcular
			</Button>
		</div>
	</CardContent>
</Card>