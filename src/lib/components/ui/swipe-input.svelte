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
			'flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none',
			isSwiping ? 'border-primary bg-primary/5' : '',
			className
		)}
	/>
	{#if swipeIndicator}
		<div class="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-lg pointer-events-none">
			{swipeIndicator}
		</div>
	{/if}
</div>