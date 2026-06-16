<script lang="ts">
  import { onMount } from "svelte";

  let {
    slot = "",
    format = "auto",
    class: className = "",
  }: {
    slot?: string;
    format?: string;
    class?: string;
  } = $props();

  onMount(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch (e) {
      console.warn("AdSense not loaded yet");
    }
  });
</script>

{#if slot}
  <div
    class={`ad-container min-h-[90px] flex items-center justify-center bg-muted/30 rounded-md ${className}`}
  >
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-1972364870511142"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    ></ins>
  </div>
{:else}
  <div
    class={`ad-placeholder min-h-[90px] flex items-center justify-center bg-muted/30 rounded-md text-sm text-muted-foreground ${className}`}
  >
    Espaço publicitário
  </div>
{/if}
