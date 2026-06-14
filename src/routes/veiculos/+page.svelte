<script lang="ts">
	import CalculatorForm from '$lib/components/calculator-form.svelte';
</script>

<svelte:head>
	<title>Financiamento de Veículos — Calculadora</title>
	<meta name="description" content="Simule financiamento de veículos com PRICE, SAC e outros sistemas. Compare parcelas e veja tabela de amortização." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl sm:text-3xl font-bold">Financiamento de Veículos</h1>
		<p class="text-muted-foreground mt-1">
			Simule o financiamento do seu carro ou moto. Compare sistemas de amortização e economize.
		</p>
	</div>

	<CalculatorForm />
</div>