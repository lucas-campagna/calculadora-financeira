<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		className = '',
		children
	}: {
		className?: string;
		children: import('svelte').Snippet;
	} = $props();

	let classes = $derived(cn('text-sm text-muted-foreground', className));
</script>

<p class={classes}>
	{@render children()}
</p>