<script lang="ts">
  import { onMount } from "svelte";
  import { cn } from "$lib/utils";
  import { formatInputValue } from "$lib/calculator";
  import { SWIPE_TICK_PERCENT, MAX_MONTHS } from "$lib/constants";

  const TICK_PX = 30;

  let {
    class: className = "",
    id = "",
    placeholder = "",
    value = "",
    inputmode = "numeric" as
      | "numeric"
      | "decimal"
      | "text"
      | "tel"
      | "search"
      | "email"
      | "url"
      | "none"
      | "month",
    min = "0",
    max = inputmode === "month" ? String(MAX_MONTHS) : "",
    locked = false,
    showRevert = undefined as boolean | undefined,
    showLock = true,
    onlocktoggle = () => {},
    onrevert = () => {},
    onchange: handleChange = (_v: string) => {},
    this: inputRef = undefined as HTMLInputElement | undefined,
  }: {
    class?: string;
    id?: string;
    placeholder?: string;
    value?: string;
    inputmode?:
      | "numeric"
      | "decimal"
      | "text"
      | "tel"
      | "search"
      | "email"
      | "url"
      | "none"
      | "month";
    min?: string;
    max?: string;
    locked?: boolean;
    showRevert?: boolean;
    showLock?: boolean;
    onlocktoggle?: () => void;
    onrevert?: () => void;
    onchange?: (v: string) => void;
    this?: HTMLInputElement | undefined;
  } = $props();

  const decimal = inputmode === "decimal";
  let touchStartY = 0;
  let lastTickY = 0;
  let isSwiping = $state(false);
  let swipeDirection = $state<"up" | "down" | null>(null);
  let inputEl: HTMLInputElement | undefined = $state(undefined);
  let isTyping = $state(false);
  let lastEmittedValue = "";

  $effect(() => {
    inputRef = inputEl;
  });

  function getDisplayValue(): string {
    return decimal ? value : formatInputValue(value);
  }

  $effect(() => {
    if (!isTyping) {
      displayValue = getDisplayValue();
    }
  });

  function getNumericValue(): number {
    if (decimal) {
      const cleaned = value.replace(/\./g, "").replace(",", ".");
      return parseFloat(cleaned) || 0;
    }
    const digits = value.replace(/[^\d]/g, "");
    return parseInt(digits, 10) || 0;
  }

  function applyMin(v: number): number {
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || Infinity;
    return Math.min(Math.max(minVal, v), maxVal);
  }

  function applyTick(direction: "up" | "down") {
    const current = getNumericValue();
    if (current === 0 && direction === "down") return;
    const tick = Math.max(1, Math.round(current * (SWIPE_TICK_PERCENT / 100)));
    let next: number;
    if (direction === "up") {
      next = current + tick;
    } else {
      next = applyMin(current - tick);
    }
    if (decimal) {
      const v = next.toFixed(2).replace(".", ",");
      displayValue = v;
      lastEmittedValue = v;
      handleChange(v);
    } else {
      const finalVal = applyMin(next);
      const numStr = String(finalVal);
      displayValue = finalVal.toLocaleString("pt-BR");
      lastEmittedValue = numStr;
      handleChange(numStr);
    }
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY;
    lastTickY = touchStartY;
    isSwiping = true;
    isTyping = true;
    swipeDirection = null;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping) return;
    const currentY = e.touches[0].clientY;
    const totalDiff = touchStartY - currentY;
    if (Math.abs(totalDiff) > 10) {
      swipeDirection = totalDiff > 0 ? "up" : "down";
      e.preventDefault();
    }
    const ticksY = lastTickY - currentY;
    const ticksCount = Math.trunc(ticksY / TICK_PX);
    if (ticksCount !== 0) {
      lastTickY -= ticksCount * TICK_PX;
      const dir = ticksCount > 0 ? "up" : "down";
      const count = Math.abs(ticksCount);
      for (let i = 0; i < count; i++) {
        applyTick(dir);
      }
    }
  }

  function handleTouchEnd() {
    isSwiping = false;
    isTyping = false;
    swipeDirection = null;
  }

  function handleInput(e: Event) {
    isTyping = true;
    const target = e.target as HTMLInputElement;
    if (decimal) {
      let v = target.value;
      const num = parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
      v = applyMin(num).toFixed(2).replace(".", ",");
      displayValue = v;
      lastEmittedValue = v;
      handleChange(v);
    } else {
      let raw = target.value.replace(/[^\d]/g, "");
      if (raw === "") raw = min;
      const num = parseInt(raw, 10) || 0;
      const formatted = num.toLocaleString("pt-BR");
      displayValue = formatted;
      const emitted = String(applyMin(num));
      lastEmittedValue = emitted;
      handleChange(emitted);
    }
  }

  function handleBlur() {
    isTyping = false;
    if (decimal) {
      if (!value || value === "" || value === ",") {
        const v = applyMin(0).toFixed(2).replace(".", ",");
        lastEmittedValue = v;
        handleChange(v);
      }
    } else {
      const num = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
      const emitted = String(applyMin(num));
      lastEmittedValue = emitted;
      handleChange(emitted);
    }
  }

  let displayValue = $state("");

  let swipeIndicator = $derived(
    isSwiping && swipeDirection === "up"
      ? "▲"
      : isSwiping && swipeDirection === "down"
        ? "▼"
        : "",
  );

  let monthBreakdown = $derived.by(() => {
    if (inputmode !== "month") return null;
    const num = getNumericValue();
    if (num === 0) return null;
    const years = Math.floor(num / 12);
    const months = num % 12;
    const parts: string[] = [];
    if (years > 0) {
      parts.push(years === 1 ? "1 ano" : `${years} anos`);
    }
    if (months > 0) {
      parts.push(months === 1 ? "1 mês" : `${months} meses`);
    }
    return parts.join(" e ");
  });


  onMount(() => {
    if (inputEl) {
      inputEl.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      inputEl.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      inputEl.addEventListener("touchend", handleTouchEnd, { passive: true });
      inputEl.addEventListener("touchcancel", handleTouchEnd, {
        passive: true,
      });
    }
    return () => {
      if (inputEl) {
        inputEl.removeEventListener("touchstart", handleTouchStart);
        inputEl.removeEventListener("touchmove", handleTouchMove);
        inputEl.removeEventListener("touchend", handleTouchEnd);
        inputEl.removeEventListener("touchcancel", handleTouchEnd);
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
    inputmode={inputmode === "month" ? "numeric" : inputmode}
    bind:value={displayValue}
    onblur={handleBlur}
    oninput={handleInput}
    class={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none transition-colors",
      isSwiping ? "border-primary bg-primary/5" : "",
      className,
    )}
  />
  {#if monthBreakdown}
    <div
      class="absolute inset-y-0 flex items-center text-xs text-muted-foreground/60 text-left pointer-events-none overflow-hidden text-nowrap right-7 text-ellipsis"
      class:opacity-30={!displayValue || displayValue === "0"}
      class:opacity-100={displayValue && displayValue !== "0"}
      class:left-6={displayValue.length == 1}
      class:left-8={displayValue.length == 2}
      class:left-10={displayValue.length == 3}
      class:left-13={displayValue.length >= 4}
      class:right-13={!swipeIndicator && showRevert}
    >
      {monthBreakdown}
    </div>
  {/if}
  {#if swipeIndicator}
    <div
      class="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm pointer-events-none"
    >
      {swipeIndicator}
    </div>
  {:else}
    <div
      class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
    >
      {#if showRevert ?? !locked}
        <button
          class="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
          onclick={(e) => {
            e.stopPropagation();
            onrevert();
          }}
          aria-label="Reverter para valor comum"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
              d="M3 3v5h5"
            /></svg
          >
        </button>
      {/if}
      {#if showLock}
        <button
          class="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
          onclick={(e) => {
            e.stopPropagation();
            onlocktoggle();
          }}
          aria-label={locked ? "Desbloquear campo" : "Bloquear campo"}
          type="button"
        >
          {#if locked}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
                d="M7 11V7a5 5 0 0 1 10 0v4"
              /></svg
            >
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
                d="M7 11V7a5 5 0 0 1 5-5 1.6 1.6 0 0 1 1 .4"
              /></svg
            >
          {/if}
        </button>
      {/if}
    </div>
  {/if}
</div>
