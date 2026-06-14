<script lang="ts">
	import { formatCurrency, formatInputValue } from '$lib/calculator';
	import { calculatorStore, allResultsStore, calculateAll } from '$lib/stores/calculator-store';

	let displayPrincipal = $derived(formatInputValue($calculatorStore.principal));
	let displayDownPayment = $derived(formatInputValue($calculatorStore.downPayment));
	let displayTermMonths = $derived(formatInputValue($calculatorStore.termMonths));

	function compare() {
		calculateAll();
	}
</script>

<svelte:head>
	<title>Comparar Sistemas de Amortização — PRICE vs SAC vs SAM</title>
	<meta name="description" content="Compare PRICE, SAC e SAM lado a lado. Veja qual sistema de amortização é mais vantajoso para o seu financiamento." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl sm:text-4xl font-bold">Comparar Sistemas</h1>
		<p class="text-lg text-muted-foreground mt-2">
			Compare PRICE, SAC e SAM lado a lado para o mesmo financiamento.
		</p>
	</div>

	<div class="space-y-5 mb-6">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
			<div>
				<label class="text-base font-medium" for="comp-principal">Valor (R$)</label>
				<input
					id="comp-principal"
					type="text"
					inputmode="numeric"
					class="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base mt-1.5"
					placeholder="Ex: 500.000"
					value={displayPrincipal}
					oninput={(e) => { $calculatorStore.principal = (e.target as HTMLInputElement).value.replace(/[^\d]/g, ''); }}
				/>
			</div>
			<div>
				<label class="text-base font-medium" for="comp-rate">Taxa (% a.a.)</label>
				<input
					id="comp-rate"
					type="text"
					class="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base mt-1.5"
					placeholder="Ex: 10.5"
					value={$calculatorStore.annualRate}
					oninput={(e) => { $calculatorStore.annualRate = (e.target as HTMLInputElement).value; }}
				/>
			</div>
			<div>
				<label class="text-base font-medium" for="comp-term">Prazo (meses)</label>
				<input
					id="comp-term"
					type="text"
					inputmode="numeric"
					class="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base mt-1.5"
					placeholder="Ex: 360"
					value={displayTermMonths}
					oninput={(e) => { $calculatorStore.termMonths = (e.target as HTMLInputElement).value.replace(/[^\d]/g, ''); }}
				/>
			</div>
			<div>
				<label class="text-base font-medium" for="comp-down">Entrada (R$)</label>
				<input
					id="comp-down"
					type="text"
					inputmode="numeric"
					class="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base mt-1.5"
					placeholder="Opcional"
					value={displayDownPayment}
					oninput={(e) => { $calculatorStore.downPayment = (e.target as HTMLInputElement).value.replace(/[^\d]/g, ''); }}
				/>
			</div>
		</div>
		<button class="w-full h-14 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 cursor-pointer" onclick={compare}>
			Comparar
		</button>
	</div>

	{#if $allResultsStore.price && $allResultsStore.sac && $allResultsStore.sam}
		{@const priceResult = $allResultsStore.price}
		{@const sacResult = $allResultsStore.sac}
		{@const samResult = $allResultsStore.sam}
		<div class="p-4 bg-muted rounded-lg">
			<h3 class="font-semibold mb-2 text-lg">Resumo Comparativo</h3>
			<div class="text-base space-y-1">
				<p>O sistema <strong>PRICE</strong> tem parcelas fixas de {formatCurrency(priceResult!.firstInstallment)}.</p>
				<p>O sistema <strong>SAC</strong> começa com parcelas de {formatCurrency(sacResult!.firstInstallment)} e termina em {formatCurrency(sacResult!.lastInstallment)}.</p>
				<p>O sistema <strong>SAM</strong> (misto) tem parcelas entre {formatCurrency(samResult!.firstInstallment)} e {formatCurrency(samResult!.lastInstallment)}.</p>
				<p class="mt-2 font-medium">
					Economia SAC vs PRICE: {formatCurrency(priceResult!.totalPaid - sacResult!.totalPaid)} em juros
				</p>
			</div>
		</div>
	{/if}
</div>