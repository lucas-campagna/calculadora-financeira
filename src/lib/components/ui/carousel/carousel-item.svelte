<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    class: className = "",
    children,
  }: {
    class?: string;
    children: import("svelte").Snippet;
  } = $props();
</script>

<div data-embla-slide="" class={cn("min-h-0 w-full flex-shrink-0", className)}>
  {@render children()}
</div>
