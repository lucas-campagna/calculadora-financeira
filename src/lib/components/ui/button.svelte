<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		type = 'button' as 'button' | 'submit' | 'reset',
		variant = 'default' as 'default' | 'outline' | 'ghost' | 'destructive',
		size = 'default' as 'default' | 'sm' | 'lg' | 'icon',
		disabled = false,
		onclick,
		children
	}: {
		class?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: 'default' | 'outline' | 'ghost' | 'destructive';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		children: import('svelte').Snippet;
	} = $props();

	const variantClasses: Record<string, string> = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
		destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
	};

	const sizeClasses: Record<string, string> = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 px-3',
		lg: 'h-11 px-8',
		icon: 'h-10 w-10'
	};

	let classes = $derived(
		cn(
			'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
			variantClasses[variant],
			sizeClasses[size],
			className
		)
	);
</script>

<button {type} class={classes} {disabled} {onclick}>
	{@render children()}
</button>