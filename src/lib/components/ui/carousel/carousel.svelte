<script lang="ts">
  import type { CarouselAPI } from "./context.js";
  import emblaCarouselSvelte from "embla-carousel-svelte";

  let {
    opts = {},
    plugins = [],
    setApi,
    orientation = "horizontal",
    class: className = "",
    style = "",
    children,
  }: {
    opts?: Record<string, any>;
    plugins?: any[];
    setApi?: (api: CarouselAPI) => void;
    orientation?: "horizontal" | "vertical";
    class?: string;
    style?: string;
    children: import("svelte").Snippet;
  } = $props();

  function initEmbla(node: HTMLDivElement) {
    const handler = (event: CustomEvent) => {
      const embla = event.detail;
      const api: CarouselAPI = {
        scrollNext: () => embla.scrollNext(),
        scrollPrev: () => embla.scrollPrev(),
        scrollTo: (index: number) => embla.scrollTo(index),
        selectedScrollSnap: () => embla.selectedScrollSnap(),
        scrollSnapList: () => embla.scrollSnapList(),
        on: (event: string, callback: () => void) => embla.on(event, callback),
        off: (event: string, callback: () => void) =>
          embla.off(event, callback),
        canScrollNext: () => embla.canScrollNext(),
        canScrollPrev: () => embla.canScrollPrev(),
        plugins: embla.plugins || [],
        options: embla.options || {},
        destroy: () => embla.destroy(),
        reInit: () => embla.reInit(),
      };
      setApi?.(api);
    };

    node.addEventListener("emblaInit", handler as EventListener);

    const emblaAction = emblaCarouselSvelte(node, {
      options: { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      plugins,
    }) as { destroy?: () => void; update?: (opts: any) => void };

    return {
      destroy: () => {
        node.removeEventListener("emblaInit", handler as EventListener);
        emblaAction?.destroy?.();
      },
      update: (newOpts: any) => {
        emblaAction?.update?.(newOpts);
      },
    };
  }
</script>

<div use:initEmbla class={className} {style}>
  {@render children()}
</div>
