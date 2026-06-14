<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		value = '',
		type = 'text',
		placeholder = '',
		id = '',
		oninput: handleInput = (_e: Event) => {},
		step = '',
		min = '',
		max = ''
	}: {
		class?: string;
		value?: string;
		type?: string;
		placeholder?: string;
		id?: string;
		oninput?: (e: Event) => void;
		step?: string;
		min?: string;
		max?: string;
	} = $props();

	let classes = $derived(
		cn(
			'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)
	);
</script>

<input
	{type}
	{value}
	{placeholder}
	{id}
	class={classes}
	oninput={handleInput}
	{step}
	{min}
	{max}
/>