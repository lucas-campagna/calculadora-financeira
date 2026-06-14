<script lang="ts">
	import '../app.css';
	import { calculatorStore, isMobile } from '$lib/stores/calculator-store';
	import AdsenseScript from '$lib/components/ads/adsense-script.svelte';
	import AdUnit from '$lib/components/ads/ad-unit.svelte';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Início' },
		{ href: '/imobiliario', label: 'Imobiliário' },
		{ href: '/veiculos', label: 'Veículos' },
		{ href: '/pessoal', label: 'Pessoal' },
		{ href: '/comparar', label: 'Comparar' }
	];
</script>

<AdsenseScript />

<div class="min-h-screen flex flex-col">
	<header class="border-b bg-background sticky top-0 z-40">
		<div class="container mx-auto px-4 py-3 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-primary">
				CalcFinanciamento
			</a>
			<nav class="hidden sm:flex gap-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>

		{#if $isMobile}
			<nav class="flex border-t overflow-x-auto px-2">
				{#each navItems as item}
					<a
						href={item.href}
						class="px-3 py-2 text-xs whitespace-nowrap hover:bg-accent transition-colors flex-shrink-0"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		{/if}
	</header>

	<AdUnit slot="" format="auto" class="container mx-auto px-4 mt-4" />

	<main class="flex-1 container mx-auto px-4 py-6">
		{@render children()}
	</main>

	<footer class="border-t bg-muted/50 py-6">
		<div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
			<p>Calculadora de Financiamento — Simulação educacional. Consulte um profissional antes de decisões financeiras.</p>
		</div>
	</footer>
</div>