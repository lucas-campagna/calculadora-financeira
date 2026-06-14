<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		className = '',
		children
	}: {
		className?: string;
		children: import('svelte').Snippet;
	} = $props();

	let classes = $derived(cn('text-2xl font-semibold leading-none tracking-tight', className));
</script>

<h3 class={classes}>
	{@render children()}
</h3>