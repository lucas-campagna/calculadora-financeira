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

  let insElement: HTMLModElement | null = null;

  onMount(() => {
    if (insElement) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
          element: insElement,
        });
      } catch (e) {
        console.warn("AdSense not loaded yet");
      }
    }
  });
</script>

{#if slot}
  <div
    class={`ad-container min-h-[90px] flex items-center justify-center bg-muted/30 rounded-md ${className}`}
  >
    <amp-ad
      width="100vw"
      height="90"
      type="adsense"
      data-ad-client="ca-pub-1972364870511142"
      data-ad-slot="8500998005"
      data-auto-format="rspv"
      data-full-width=""
    >
    </amp-ad>
  </div>
{:else}
  <div
    class={`ad-placeholder min-h-[90px] flex items-center justify-center bg-muted/30 rounded-md text-sm text-muted-foreground ${className}`}
  >
    Espaço publicitário
  </div>
{/if}
