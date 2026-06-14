<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		className = '',
		children
	}: {
		className?: string;
		children: import('svelte').Snippet;
	} = $props();

	let classes = $derived(
		cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)
	);
</script>

<div class={classes}>
	{@render children()}
</div>