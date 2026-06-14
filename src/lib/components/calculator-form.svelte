<script lang="ts">
	import { SYSTEM_LABELS, formatInputValue } from '$lib/calculator';
	import { calculatorStore } from '$lib/stores/calculator-store';
	import { calculateAll } from '$lib/stores/calculator-store';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import ExtraPaymentsEditor from '$lib/components/extra-payments-editor.svelte';

	let showExtras = $state(false);

	let displayPrincipal = $derived(formatInputValue($calculatorStore.principal));
	let displayDownPayment = $derived(formatInputValue($calculatorStore.downPayment));
	let displayTermMonths = $derived(formatInputValue($calculatorStore.termMonths));

	function handleCurrencyInput(e: Event, field: 'principal' | 'downPayment') {
		const target = e.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$calculatorStore[field] = raw;
	}

	function handleNumberInput(e: Event, field: 'termMonths') {
		const target = e.target as HTMLInputElement;
		const raw = target.value.replace(/[^\d]/g, '');
		$calculatorStore[field] = raw;
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
					<Input
						id="principal"
						type="text"
						inputmode="numeric"
						placeholder="Ex: 500.000"
						value={displayPrincipal}
						oninput={(e: Event) => handleCurrencyInput(e, 'principal')}
						class="mt-1.5"
					/>
				</div>

				<div>
					<Label for="downPayment" class="text-base">Entrada (R$) — opcional</Label>
					<Input
						id="downPayment"
						type="text"
						inputmode="numeric"
						placeholder="Ex: 100.000"
						value={displayDownPayment}
						oninput={(e: Event) => handleCurrencyInput(e, 'downPayment')}
						class="mt-1.5"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div>
					<Label for="annualRate" class="text-base">Taxa de Juros (% ao ano)</Label>
					<Input
						id="annualRate"
						type="text"
						inputmode="decimal"
						placeholder="Ex: 10.5"
						value={$calculatorStore.annualRate}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							$calculatorStore.annualRate = target.value;
						}}
						class="mt-1.5"
					/>
				</div>

				<div>
					<Label for="termMonths" class="text-base">Prazo (meses)</Label>
					<Input
						id="termMonths"
						type="text"
						inputmode="numeric"
						placeholder="Ex: 360"
						value={displayTermMonths}
						oninput={(e: Event) => handleNumberInput(e, 'termMonths')}
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