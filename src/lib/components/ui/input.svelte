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
		max = '',
		inputmode = undefined as 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url' | 'none' | undefined,
		readonly = false
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
		inputmode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url' | 'none';
		readonly?: boolean;
	} = $props();

	let classes = $derived(
		cn(
			'flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
	{inputmode}
	{readonly}
/>