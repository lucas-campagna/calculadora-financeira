<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import { formatInputValue } from '$lib/calculator';
	import { SWIPE_TICK_PERCENT } from '$lib/constants';

	const TICK_PX = 30;

	let {
		class: className = '',
		id = '',
		placeholder = '',
		value = '',
		inputmode = 'numeric' as 'numeric' | 'decimal' | 'text' | 'tel' | 'search' | 'email' | 'url' | 'none',
		decimal = false,
		min = '0',
		locked = false,
		onlocktoggle = () => {},
		onrevert = () => {},
		onchange: handleChange = (_v: string) => {},
		this: inputRef = undefined as HTMLInputElement | undefined
	}: {
		class?: string;
		id?: string;
		placeholder?: string;
		value?: string;
		inputmode?: 'numeric' | 'decimal' | 'text' | 'tel' | 'search' | 'email' | 'url' | 'none';
		decimal?: boolean;
		min?: string;
		locked?: boolean;
		onlocktoggle?: () => void;
		onrevert?: () => void;
		onchange?: (v: string) => void;
		this?: HTMLInputElement | undefined;
	} = $props();

	let touchStartY = 0;
	let lastTickY = 0;
	let isSwiping = $state(false);
	let swipeDirection = $state<'up' | 'down' | null>(null);
	let inputEl: HTMLInputElement | undefined = $state(undefined);

	$effect(() => {
		inputRef = inputEl;
	});

	function getNumericValue(): number {
		if (decimal) {
			const cleaned = value.replace(/\./g, '').replace(',', '.');
			return parseFloat(cleaned) || 0;
		}
		const digits = value.replace(/[^\d]/g, '');
		return parseInt(digits, 10) || 0;
	}

	function applyMin(v: number): number {
		const minVal = parseFloat(min) || 0;
		return Math.max(minVal, v);
	}

	function applyTick(direction: 'up' | 'down') {
		const current = getNumericValue();
		if (current === 0 && direction === 'down') return;
		const tick = Math.max(1, Math.round(current * (SWIPE_TICK_PERCENT / 100)));
		let next: number;
		if (direction === 'up') {
			next = current + tick;
		} else {
			next = applyMin(current - tick);
		}
		if (decimal) {
			handleChange(next.toFixed(2).replace('.', ','));
		} else {
			handleChange(String(next));
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
		lastTickY = touchStartY;
		isSwiping = true;
		swipeDirection = null;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isSwiping) return;
		const currentY = e.touches[0].clientY;
		const totalDiff = touchStartY - currentY;
		if (Math.abs(totalDiff) > 10) {
			swipeDirection = totalDiff > 0 ? 'up' : 'down';
			e.preventDefault();
		}
		const ticksY = lastTickY - currentY;
		const ticksCount = Math.trunc(ticksY / TICK_PX);
		if (ticksCount !== 0) {
			lastTickY -= ticksCount * TICK_PX;
			const dir = ticksCount > 0 ? 'up' : 'down';
			const count = Math.abs(ticksCount);
			for (let i = 0; i < count; i++) {
				applyTick(dir);
			}
		}
	}

	function handleTouchEnd() {
		isSwiping = false;
		swipeDirection = null;
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (decimal) {
			let v = target.value;
			const num = parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
			v = applyMin(num).toFixed(2).replace('.', ',');
			handleChange(v);
		} else {
			let raw = target.value.replace(/[^\d]/g, '');
			if (raw === '') raw = min;
			const num = parseInt(raw, 10) || 0;
			handleChange(String(applyMin(num)));
		}
	}

	function handleBlur() {
		if (decimal) {
			if (!value || value === '' || value === ',') {
				handleChange(applyMin(0).toFixed(2).replace('.', ','));
			}
		} else {
			const num = parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
			handleChange(String(applyMin(num)));
		}
	}

	let displayValue = $derived(decimal ? value : formatInputValue(value));

	let swipeIndicator = $derived(
		isSwiping && swipeDirection === 'up' ? '▲' : isSwiping && swipeDirection === 'down' ? '▼' : ''
	);

	onMount(() => {
		if (inputEl) {
			inputEl.addEventListener('touchstart', handleTouchStart, { passive: true });
			inputEl.addEventListener('touchmove', handleTouchMove, { passive: false });
			inputEl.addEventListener('touchend', handleTouchEnd, { passive: true });
			inputEl.addEventListener('touchcancel', handleTouchEnd, { passive: true });
		}
		return () => {
			if (inputEl) {
				inputEl.removeEventListener('touchstart', handleTouchStart);
				inputEl.removeEventListener('touchmove', handleTouchMove);
				inputEl.removeEventListener('touchend', handleTouchEnd);
				inputEl.removeEventListener('touchcancel', handleTouchEnd);
			}
		};
	});
</script>

<div class="relative">
	<input
		bind:this={inputEl}
		{id}
		type="text"
		{placeholder}
		{inputmode}
		value={displayValue}
		oninput={handleInput}
		onblur={handleBlur}
		class={cn(
			'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none transition-colors',
			isSwiping ? 'border-primary bg-primary/5' : '',
			locked ? 'border-muted bg-muted text-muted-foreground' : 'border-input',
			className
		)}
	/>
	{#if swipeIndicator}
		<div class="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm pointer-events-none">
			{swipeIndicator}
		</div>
	{:else}
		<div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
			{#if !locked}
				<button
					class="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
					onclick={(e) => { e.stopPropagation(); onrevert(); }}
					aria-label="Reverter para valor comum"
					type="button"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
				</button>
			{/if}
			<button
				class="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
				onclick={(e) => { e.stopPropagation(); onlocktoggle(); }}
				aria-label={locked ? 'Desbloquear campo' : 'Bloquear campo'}
				type="button"
			>
				{#if locked}
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 5-5 1.6 1.6 0 0 1 1 .4"/></svg>
				{/if}
			</button>
		</div>
	{/if}
</div>