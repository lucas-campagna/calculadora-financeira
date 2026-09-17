<script lang="ts">
  interface Props {
    name: string;
    role: string;
    lastUpdated?: string;
  }

  let { name, role, lastUpdated }: Props = $props();
</script>

<div class="flex items-center gap-3 py-4 border-t">
  <div class="flex-1">
    <p class="text-sm text-muted-foreground">
      Por <span class="font-medium text-foreground">{name}</span> — {role}
    </p>
    {#if lastUpdated}
      <p class="text-xs text-muted-foreground">Atualizado em {lastUpdated}</p>
    {/if}
  </div>
</div>
