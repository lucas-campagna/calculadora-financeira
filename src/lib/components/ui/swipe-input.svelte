<script lang="ts">
	import { cn } from '$lib/utils';
	import { formatInputValue } from '$lib/calculator';
	import { SWIPE_TICK_PERCENT } from '$lib/constants';

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
	let isSwiping = $state(false);
	let swipeDirection = $state<'up' | 'down' | null>(null);

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
		isSwiping = true;
		swipeDirection = null;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isSwiping) return;
		const diff = touchStartY - e.touches[0].clientY;
		if (Math.abs(diff) > 20) {
			swipeDirection = diff > 0 ? 'up' : 'down';
		}
	}

	function handleTouchEnd() {
		if (swipeDirection) {
			applyTick(swipeDirection);
		}
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
		isSwiping && swipeDirection === 'up' ? '+' : isSwiping && swipeDirection === 'down' ? '-' : ''
	);
</script>

<div class="relative">
	<input
		bind:this={inputRef}
		{id}
		type="text"
		{placeholder}
		{inputmode}
		value={displayValue}
		oninput={handleInput}
		onblur={handleBlur}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
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