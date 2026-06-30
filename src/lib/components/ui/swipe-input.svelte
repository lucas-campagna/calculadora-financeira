<script lang="ts">
  import { cn } from "$lib/utils";

  const TICK_PX = 10;

  type SwipeInputProps = {
    class?: string;
    id?: string;
    placeholder?: string;
    value: number;
    step?: number;
    decimals?: number;
    min?: number;
    max?: number;
    label?: string;
    actionButtons?: { icon: () => string; onclick: () => void }[];
    onchange?: (v: number) => void;
    this?: HTMLInputElement | undefined;
  };

  let {
    class: className = "",
    id = "",
    placeholder = "",
    value,
    decimals = 0,
    step,
    min = 0,
    max,
    label,
    actionButtons = [],
    onchange: handleChange = (_v: number) => {},
    this: inputRef = undefined as HTMLInputElement | undefined,
  }: SwipeInputProps = $props();

  let touchStartY = 0;
  let lastTickY = 0;
  let isSwiping = $state(false);
  let swipeDirection = $state<"up" | "down" | null>(null);
  let inputEl: HTMLInputElement | undefined = $state(undefined);
  let swipeIndicatorEl: HTMLDivElement | undefined = $state(undefined);
  let actionButtonsEl: HTMLDivElement | undefined = $state(undefined);
  let lastTapTime = 0;
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  const formatter = $derived(
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  $effect(() => {
    inputRef = inputEl;
  });

  function applyMin(v: number): number {
    return Math.max(min, v);
  }

  function applyMax(v: number): number {
    return Math.min(max ?? v, v);
  }

  function applyLimits(v: number): number {
    return applyMin(applyMax(v));
  }

  function parseNumber(s: string | number): number {
    const v =
      typeof s === "string"
        ? parseInt(s.replace(/\D/g, "")) / 10 ** decimals || 0
        : s;
    return v;
  }

  function restartDragTimer() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function applyTick(direction: "up" | "down") {
    if (
      (direction === "down" && value === min) ||
      (direction === "up" && value === max && Number.isFinite(max))
    )
      return;
    const tick =
      step ??
      (value === 0
        ? 1
        : 1.0 * 10 ** (Math.floor(Math.log(value) / Math.log(10) + 1e-6) - 1));
    const next =
      direction === "up" ? applyMax(value + tick) : applyMin(value - tick);
    handleChange(tick * Math.round(next / tick));
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY;
    lastTickY = touchStartY;
    isSwiping = true;
    swipeDirection = null;
    holdTimer = setTimeout(() => {
      inputEl?.select();
    }, 500);
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping) return;
    const currentY = e.touches[0].clientY;
    const totalDiff = touchStartY - currentY;
    if (Math.abs(totalDiff) > 10) {
      swipeDirection = totalDiff > 0 ? "up" : "down";
      // e.preventDefault();
    }
    const ticksY = lastTickY - currentY;
    const ticksCount = Math.trunc(ticksY / TICK_PX);
    if (ticksCount !== 0) {
      restartDragTimer();
      e.preventDefault();
      lastTickY -= ticksCount * TICK_PX;
      const dir = ticksCount > 0 ? "up" : "down";
      const count = Math.abs(ticksCount);
      for (let i = 0; i < count; i++) {
        applyTick(dir);
      }
    }
  }

  function handleTouchEnd() {
    restartDragTimer();
    const now = Date.now();
    if (now - lastTapTime < 300) {
      inputEl?.select();
    }
    lastTapTime = now;
    isSwiping = false;
    swipeDirection = null;
  }

  function handleInput() {
    handleChange(parseNumber(displayValue));
  }

  function handleBlur() {
    handleChange(applyLimits(parseNumber(displayValue)));
  }

  let displayValue = $derived(formatter.format(value));

  let swipeIndicator = $derived(
    isSwiping && swipeDirection === "up"
      ? "▲"
      : isSwiping && swipeDirection === "down"
        ? "▼"
        : "",
  );

  $effect(() => {
    if (!inputEl) return;

    inputEl.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    inputEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    inputEl.addEventListener("touchend", handleTouchEnd, { passive: true });
    inputEl.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      inputEl?.removeEventListener("touchstart", handleTouchStart);
      inputEl?.removeEventListener("touchmove", handleTouchMove);
      inputEl?.removeEventListener("touchend", handleTouchEnd);
      inputEl?.removeEventListener("touchcancel", handleTouchEnd);
    };
  });
</script>

<div class="relative">
  <input
    bind:this={inputEl}
    {id}
    type="text"
    {placeholder}
    inputmode="numeric"
    bind:value={displayValue}
    onblur={handleBlur}
    oninput={handleInput}
    onfocus={() => inputEl?.select()}
    class={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none transition-colors",
      isSwiping ? "border-primary bg-primary/5" : "",
      className,
    )}
  />
  {#if label}
    <div
      class="absolute inset-y-0 flex items-center text-xs text-muted-foreground/60 text-left pointer-events-none overflow-hidden text-nowrap right-7 text-ellipsis"
      style:left={Math.max(0, 17 + displayValue.length * 7) + "px"}
      style:right={(swipeIndicator
        ? swipeIndicatorEl?.getBoundingClientRect().width || 0
        : actionButtonsEl?.getBoundingClientRect().width || 0) +
        17 +
        "px"}
    >
      {label}
    </div>
  {/if}
  {#if swipeIndicator}
    <div
      bind:this={swipeIndicatorEl}
      class="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm pointer-events-none"
    >
      {swipeIndicator}
    </div>
  {:else}
    <div
      bind:this={actionButtonsEl}
      class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
    >
      {#each actionButtons.toReversed() as button}
        <button
          class="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
          onclick={(e) => {
            e.stopPropagation();
            button.onclick();
          }}
          type="button"
        >
          {@html button.icon()}
        </button>
      {/each}
    </div>
  {/if}
</div>
