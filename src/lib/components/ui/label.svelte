<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    class: className = "",
    for: labelFor = "",
    children,
  }: {
    class?: string;
    for?: string;
    children: import("svelte").Snippet;
  } = $props();

  let classes = $derived(
    cn(
      "text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    ),
  );
</script>

<label for={labelFor} class={classes}>
  {@render children()}
</label>
