<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    className = "",
    children,
  }: {
    className?: string;
    children: import("svelte").Snippet;
  } = $props();

  let classes = $derived(cn("flex flex-col space-y-1.5 p-6", className));
</script>

<div class={classes}>
  {@render children()}
</div>
