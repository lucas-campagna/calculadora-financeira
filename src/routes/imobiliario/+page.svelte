<script lang="ts">
	import CalculatorForm from '$lib/components/calculator-form.svelte';
	import ResultsSummary from '$lib/components/results-summary.svelte';
	import AmortizationTable from '$lib/components/amortization-table.svelte';
	import ComparisonChart from '$lib/components/comparison-chart.svelte';
	import ExportButtons from '$lib/components/export-buttons.svelte';
	import { calculatorStore } from '$lib/stores/calculator-store';
</script>

<svelte:head>
	<title>Financiamento Imobiliário — Calculadora</title>
	<meta name="description" content="Simule financiamento imobiliário com PRICE, SAC, SAM e Americano. Compare taxas e veja tabela de amortização." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl sm:text-3xl font-bold">Financiamento Imobiliário</h1>
		<p class="text-muted-foreground mt-1">
			Simule o financiamento do seu imóvel. Compare sistemas de amortização e encontre a melhor opção.
		</p>
	</div>

	<CalculatorForm />
</div>