<script lang="ts">
	import type { FinancingType, AmortizationSystem } from '$lib/calculator/types';
	import { FINANCING_TYPE_LABELS, SYSTEM_LABELS } from '$lib/calculator/types';
	import { calculatorStore, resultStore } from '$lib/stores/calculator-store';
	import { calculate } from '$lib/calculator';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import ExtraPaymentsEditor from '$lib/components/extra-payments-editor.svelte';

	let showExtras = $state(false);

	let typeOptions: { value: FinancingType; label: string }[] = [
		{ value: 'imobiliario', label: FINANCING_TYPE_LABELS.imobiliario },
		{ value: 'veiculos', label: FINANCING_TYPE_LABELS.veiculos },
		{ value: 'pessoal', label: FINANCING_TYPE_LABELS.pessoal }
	];

	let systemOptions: { value: AmortizationSystem; label: string }[] = [
		{ value: 'price', label: SYSTEM_LABELS.price },
		{ value: 'sac', label: SYSTEM_LABELS.sac },
		{ value: 'sam', label: SYSTEM_LABELS.sam },
		{ value: 'americano', label: SYSTEM_LABELS.americano }
	];

	function handleCalculate() {
		const principal = parseFloat($calculatorStore.principal) || 0;
		const annualRate = parseFloat($calculatorStore.annualRate) || 0;
		const termMonths = parseInt($calculatorStore.termMonths) || 0;
		const downPayment = parseFloat($calculatorStore.downPayment) || 0;

		if (principal > 0 && annualRate > 0 && termMonths > 0) {
			const result = calculate({
				type: $calculatorStore.type,
				system: $calculatorStore.system,
				principal,
				annualRate,
				termMonths,
				downPayment: downPayment > 0 ? downPayment : undefined,
				extraPayments: $calculatorStore.extraPayments
			});
			resultStore.set(result);
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Simular Financiamento</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<div>
				<Label for="type">Tipo de Financiamento</Label>
				<div class="grid grid-cols-3 gap-2 mt-1">
					{#each typeOptions as option}
						<button
							class="px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors {$calculatorStore.type === option.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-accent'}"
							onclick={() => ($calculatorStore.type = option.value)}
						>
							{option.label.split(' ').at(-1)}
						</button>
					{/each}
				</div>
			</div>

			<div>
				<Label for="system">Sistema de Amortização</Label>
				<div class="grid grid-cols-2 gap-2 mt-1">
					{#each systemOptions as option}
						<button
							class="px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors {$calculatorStore.system === option.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-accent'}"
							onclick={() => ($calculatorStore.system = option.value)}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<Label for="principal">Valor do Financiamento (R$)</Label>
					<Input
						id="principal"
						type="text"
						placeholder="Ex: 500000"
						value={$calculatorStore.principal}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							$calculatorStore.principal = target.value.replace(/[^\d]/g, '');
						}}
						class="mt-1"
					/>
				</div>

				<div>
					<Label for="downPayment">Entrada (R$) — opcional</Label>
					<Input
						id="downPayment"
						type="text"
						placeholder="Ex: 100000"
						value={$calculatorStore.downPayment}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							$calculatorStore.downPayment = target.value.replace(/[^\d]/g, '');
						}}
						class="mt-1"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<Label for="annualRate">Taxa de Juros (% ao ano)</Label>
					<Input
						id="annualRate"
						type="text"
						placeholder="Ex: 10.5"
						value={$calculatorStore.annualRate}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							$calculatorStore.annualRate = target.value;
						}}
						class="mt-1"
					/>
				</div>

				<div>
					<Label for="termMonths">Prazo (meses)</Label>
					<Input
						id="termMonths"
						type="text"
						placeholder="Ex: 360"
						value={$calculatorStore.termMonths}
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							$calculatorStore.termMonths = target.value.replace(/[^\d]/g, '');
						}}
						class="mt-1"
					/>
				</div>
			</div>

			<div>
				<button
					class="text-sm text-primary hover:underline"
					onclick={() => (showExtras = !showExtras)}
				>
					{showExtras ? '▲ Ocultar' : '▼ Adicionar'} pagamentos extras
				</button>
				{#if showExtras}
					<ExtraPaymentsEditor />
				{/if}
			</div>

			<Button variant="default" size="lg" class="w-full" onclick={handleCalculate}>
				Calcular
			</Button>
		</div>
	</CardContent>
</Card>