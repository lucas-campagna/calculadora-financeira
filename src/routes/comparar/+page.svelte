<script lang="ts">
	import { onMount } from 'svelte';
	import { calculate } from '$lib/calculator';
	import { formatCurrency, formatPercent } from '$lib/calculator';
	import type { FinancingResult } from '$lib/calculator/types';
	import { calculatorStore, resultStore } from '$lib/stores/calculator-store';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';

	let priceResult: FinancingResult | null = $state(null);
	let sacResult: FinancingResult | null = $state(null);
	let samResult: FinancingResult | null = $state(null);

	function compare() {
		const principal = parseFloat($calculatorStore.principal) || 0;
		const annualRate = parseFloat($calculatorStore.annualRate) || 0;
		const termMonths = parseInt($calculatorStore.termMonths) || 0;
		const downPayment = parseFloat($calculatorStore.downPayment) || 0;

		if (principal <= 0 || annualRate <= 0 || termMonths <= 0) return;

		const input = {
			type: $calculatorStore.type as any,
			principal,
			annualRate,
			termMonths,
			downPayment: downPayment > 0 ? downPayment : undefined,
			extraPayments: $calculatorStore.extraPayments
		};

		priceResult = calculate({ ...input, system: 'price' });
		sacResult = calculate({ ...input, system: 'sac' });
		samResult = calculate({ ...input, system: 'sam' });
	}
</script>

<svelte:head>
	<title>Comparar Sistemas de Amortização — PRICE vs SAC vs SAM</title>
	<meta name="description" content="Compare PRICE, SAC e SAM lado a lado. Veja qual sistema de amortização é mais vantajoso para o seu financiamento." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl sm:text-3xl font-bold">Comparar Sistemas</h1>
		<p class="text-muted-foreground mt-1">
			Compare PRICE, SAC e SAM lado a lado para o mesmo financiamento.
		</p>
	</div>

	<div class="space-y-4 mb-6">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<label class="text-sm font-medium" for="comp-principal">Valor (R$)</label>
				<input
					id="comp-principal"
					type="text"
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
					placeholder="Ex: 500000"
					value={$calculatorStore.principal}
					oninput={(e) => { $calculatorStore.principal = (e.target as HTMLInputElement).value.replace(/[^\d]/g, ''); }}
				/>
			</div>
			<div>
				<label class="text-sm font-medium" for="comp-rate">Taxa (% a.a.)</label>
				<input
					id="comp-rate"
					type="text"
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
					placeholder="Ex: 10.5"
					value={$calculatorStore.annualRate}
					oninput={(e) => { $calculatorStore.annualRate = (e.target as HTMLInputElement).value; }}
				/>
			</div>
			<div>
				<label class="text-sm font-medium" for="comp-term">Prazo (meses)</label>
				<input
					id="comp-term"
					type="text"
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
					placeholder="Ex: 360"
					value={$calculatorStore.termMonths}
					oninput={(e) => { $calculatorStore.termMonths = (e.target as HTMLInputElement).value.replace(/[^\d]/g, ''); }}
				/>
			</div>
			<div>
				<label class="text-sm font-medium" for="comp-down">Entrada (R$)</label>
				<input
					id="comp-down"
					type="text"
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
					placeholder="Opcional"
					value={$calculatorStore.downPayment}
					oninput={(e) => { $calculatorStore.downPayment = (e.target as HTMLInputElement).value.replace(/[^\d]/g, ''); }}
				/>
			</div>
		</div>
		<button class="w-full h-11 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90" onclick={compare}>
			Comparar
		</button>
	</div>

	{#if priceResult && sacResult && samResult}
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>PRICE</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between"><span>Total Pago:</span><span class="font-bold">{formatCurrency(priceResult.totalPaid)}</span></div>
						<div class="flex justify-between"><span>Juros:</span><span class="font-bold text-destructive">{formatCurrency(priceResult.totalInterest)}</span></div>
						<div class="flex justify-between"><span>1ª Parcela:</span><span class="font-bold">{formatCurrency(priceResult.firstInstallment)}</span></div>
						<div class="flex justify-between"><span>Última Parcela:</span><span class="font-bold">{formatCurrency(priceResult.lastInstallment)}</span></div>
						<div class="flex justify-between"><span>Parcelas:</span><span class="font-bold">{priceResult.installments.length}</span></div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>SAC</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between"><span>Total Pago:</span><span class="font-bold">{formatCurrency(sacResult.totalPaid)}</span></div>
						<div class="flex justify-between"><span>Juros:</span><span class="font-bold text-destructive">{formatCurrency(sacResult.totalInterest)}</span></div>
						<div class="flex justify-between"><span>1ª Parcela:</span><span class="font-bold">{formatCurrency(sacResult.firstInstallment)}</span></div>
						<div class="flex justify-between"><span>Última Parcela:</span><span class="font-bold">{formatCurrency(sacResult.lastInstallment)}</span></div>
						<div class="flex justify-between"><span>Parcelas:</span><span class="font-bold">{sacResult.installments.length}</span></div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>SAM</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between"><span>Total Pago:</span><span class="font-bold">{formatCurrency(samResult.totalPaid)}</span></div>
						<div class="flex justify-between"><span>Juros:</span><span class="font-bold text-destructive">{formatCurrency(samResult.totalInterest)}</span></div>
						<div class="flex justify-between"><span>1ª Parcela:</span><span class="font-bold">{formatCurrency(samResult.firstInstallment)}</span></div>
						<div class="flex justify-between"><span>Última Parcela:</span><span class="font-bold">{formatCurrency(samResult.lastInstallment)}</span></div>
						<div class="flex justify-between"><span>Parcelas:</span><span class="font-bold">{samResult.installments.length}</span></div>
					</div>
				</CardContent>
			</Card>
		</div>

		<div class="mt-4 p-4 bg-muted rounded-lg">
			<h3 class="font-semibold mb-2">Resumo Comparativo</h3>
			<div class="text-sm space-y-1">
				<p>O sistema <strong>PRICE</strong> tem parcelas fixas de {formatCurrency(priceResult.firstInstallment)}.</p>
				<p>O sistema <strong>SAC</strong> começa com parcelas de {formatCurrency(sacResult.firstInstallment)} e termina em {formatCurrency(sacResult.lastInstallment)}.</p>
				<p>O sistema <strong>SAM</strong> (misto) tem parcelas entre {formatCurrency(samResult.firstInstallment)} e {formatCurrency(samResult.lastInstallment)}.</p>
				<p class="mt-2 font-medium">
					Economia SAC vs PRICE: {formatCurrency(priceResult.totalPaid - sacResult.totalPaid)} em juros
				</p>
			</div>
		</div>
	{/if}
</div>