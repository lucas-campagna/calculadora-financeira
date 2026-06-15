<script lang="ts">
	import '../app.css';
	import AdsenseScript from '$lib/components/ads/adsense-script.svelte';
	import AdUnit from '$lib/components/ads/ad-unit.svelte';

	let { children } = $props();

	const isDev = import.meta.env.DEV;
</script>

<AdsenseScript />

<div class="min-h-screen flex flex-col">
	<header class="border-b bg-background sticky top-0 z-40 flex items-center justify-center">
		<div class="container mx-auto px-4">
			{#if !isDev}
				<AdUnit slot="" format="auto" />
			{:else}
				<div class="h-[90px] flex items-center justify-center bg-muted/30 rounded-md text-xs text-muted-foreground">
					AdSense (dev mode)
				</div>
			{/if}
		</div>
	</header>

	<main class="flex-1 sm:container sm:mx-auto sm:px-4 sm:py-6">
		{@render children()}
	</main>

	<footer class="border-t bg-muted/50 py-6 hidden sm:block">
		<div class="container mx-auto px-4 text-center text-base text-muted-foreground">
			<p>Calculadora de Financiamento — Simulação educacional. Consulte um profissional antes de decisões financeiras.</p>
		</div>
	</footer>
</div>
