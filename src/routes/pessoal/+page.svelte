<script lang="ts">
	import CalculatorForm from '$lib/components/calculator-form.svelte';
</script>

<svelte:head>
	<title>Empréstimo Pessoal — Calculadora</title>
	<meta name="description" content="Simule empréstimo pessoal com diferentes sistemas de amortização. Veja parcelas, juros totais e tabela completa." />
</svelte:head>

<div class="max-w-4xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl sm:text-3xl font-bold">Empréstimo Pessoal</h1>
		<p class="text-muted-foreground mt-1">
			Simule seu empréstimo pessoal. Compare taxas, prazos e sistemas de amortização.
		</p>
	</div>

	<CalculatorForm />
</div>