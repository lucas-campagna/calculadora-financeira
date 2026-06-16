<script lang="ts">
  import { onMount } from "svelte";

  let { publisherId = "ca-pub-1972364870511142" }: { publisherId?: string } =
    $props();

  onMount(() => {
    if (
      typeof window !== "undefined" &&
      !document.querySelector("script[data-adsense]")
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-adsense", "true");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  });
</script>
