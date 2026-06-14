<script lang="ts">
	let {
		open = false,
		title = '',
		children,
		onclose
	}: {
		open?: boolean;
		title?: string;
		children: import('svelte').Snippet;
		onclose?: () => void;
	} = $props();

	function handleClose() {
		open = false;
		onclose?.();
	}

	function handleBackdrop() {
		handleClose();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 bg-black/80" onclick={handleBackdrop} role="presentation">
		<div
			class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg"
			role="dialog"
			aria-modal="true"
		>
			<div class="flex flex-col space-y-1.5 text-center sm:text-left">
				<h2 class="text-lg font-semibold leading-none tracking-tight">{title}</h2>
			</div>
			<div class="max-h-[80vh] overflow-y-auto">
				{@render children()}
			</div>
			<div class="flex justify-end">
				<button
					class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
					onclick={handleClose}
				>
					Fechar
				</button>
			</div>
		</div>
	</div>
{/if}