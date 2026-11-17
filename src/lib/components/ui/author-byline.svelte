<script lang="ts">
  import { t } from "$lib/i18n";

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
      {t("common.by")} <span class="font-medium text-foreground">{name}</span> — {role}
    </p>
    {#if lastUpdated}
      <p class="text-xs text-muted-foreground">{t("common.updatedAt")} {lastUpdated}</p>
    {/if}
  </div>
</div>
