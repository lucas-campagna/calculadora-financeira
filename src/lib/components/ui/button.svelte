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
		default: 'h-12 px-5 py-3 text-base',
		sm: 'h-10 px-4 py-2 text-sm',
		lg: 'h-14 px-8 py-4 text-lg',
		icon: 'h-12 w-12'
	};

	let classes = $derived(
		cn(
			'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
			variantClasses[variant],
			sizeClasses[size],
			className
		)
	);
</script>

<button {type} class={classes} {disabled} {onclick}>
	{@render children()}
</button>