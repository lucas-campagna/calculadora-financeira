<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		className = '',
		children
	}: {
		className?: string;
		children: import('svelte').Snippet;
	} = $props();

	let classes = $derived(cn('p-6 pt-0', className));
</script>

<div class={classes}>
	{@render children()}
</div>