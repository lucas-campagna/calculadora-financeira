<script lang="ts">
  import { onMount } from "svelte";
  import { formatCurrency } from "$lib/calculator";
  import {
    allResultsStore,
    calculateAll,
    studiesStore,
  } from "$lib/stores/calculator-store";
  import { href, seoUrl, t } from "$lib/i18n";

  function getEconomy(
    baseTotalInterest: number,
    comparedTotalInterest: number,
  ): { interest: number; percent: number } {
    const interest = baseTotalInterest - comparedTotalInterest;
    const percent =
      baseTotalInterest > 0 ? (interest / baseTotalInterest) * 100 : 0;
    return { interest, percent };
  }

  $effect(() => {
    if ($studiesStore.studies.length >= 2) {
      // headerAdsVisible.set(true);
    }
  });

  onMount(() => {
    calculateAll();
  });
</script>

<svelte:head>
  <title>{t("meta.compare.title")}</title>
  <meta name="description" content={t("meta.compare.description")} />
  <meta property="og:title" content={t("meta.compare.title")} />
  <meta property="og:description" content={t("meta.compare.description")} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={seoUrl("/comparar")} />
  <link rel="canonical" href={seoUrl("/comparar")} />
</svelte:head>

<div class="max-w-4xl mx-auto">
  <div class="mb-8">
    <h1 class="text-2xl font-bold">{t("compare.heading")}</h1>
    <p class="text-sm text-muted-foreground mt-1">
      {t("compare.subtitle")}
    </p>
  </div>

  {#if $studiesStore.studies.length >= 2}
    {@const studies = $studiesStore.studies}
    {@const firstResult = $allResultsStore[studies[0].id]}

    {#if firstResult}
      <div class="mt-6 space-y-6">
        <div class="p-4 bg-muted rounded-lg">
          <h3 class="font-semibold mb-3 text-lg">{t("compare.summary")}</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse min-w-[600px]">
              <thead>
                <tr class="border-b bg-muted">
                  <th class="px-3 py-2 text-left font-medium"></th>
                  {#each studies as study}
                    {@const r = $allResultsStore[study.id]}
                    {#if r}
                      <th class="px-3 py-2 text-center font-medium"
                        >{study.name}</th
                      >
                    {/if}
                  {/each}
                </tr>
              </thead>
              <tbody>
                <tr class="border-b">
                  <td class="px-3 py-2 font-medium text-muted-foreground"
                    >{t("common.totalPaid")}</td
                  >
                  {#each studies as study}
                    {@const r = $allResultsStore[study.id]}
                    {#if r}
                      <td class="px-3 py-2 text-right font-bold"
                        >{formatCurrency(r.totalPaid)}</td
                      >
                    {/if}
                  {/each}
                </tr>
                <tr class="border-b">
                  <td class="px-3 py-2 font-medium text-muted-foreground"
                    >{t("common.totalInterest")}</td
                  >
                  {#each studies as study}
                    {@const r = $allResultsStore[study.id]}
                    {#if r}
                      <td
                        class="px-3 py-2 text-right text-destructive font-bold"
                        >{formatCurrency(r.totalInterest)}</td
                      >
                    {/if}
                  {/each}
                </tr>
                <tr class="border-b">
                  <td class="px-3 py-2 font-medium text-muted-foreground"
                    >{t("common.firstInstallment")}</td
                  >
                  {#each studies as study}
                    {@const r = $allResultsStore[study.id]}
                    {#if r}
                      <td class="px-3 py-2 text-right"
                        >{formatCurrency(r.firstInstallment)}</td
                      >
                    {/if}
                  {/each}
                </tr>
                <tr class="border-b">
                  <td class="px-3 py-2 font-medium text-muted-foreground"
                    >{t("common.lastInstallment")}</td
                  >
                  {#each studies as study}
                    {@const r = $allResultsStore[study.id]}
                    {#if r}
                      <td class="px-3 py-2 text-right"
                        >{formatCurrency(r.lastInstallment)}</td
                      >
                    {/if}
                  {/each}
                </tr>
                <tr class="border-b">
                  <td class="px-3 py-2 font-medium text-muted-foreground"
                    >{t("common.installments")}</td
                  >
                  {#each studies as study}
                    {@const r = $allResultsStore[study.id]}
                    {#if r}
                      <td class="px-3 py-2 text-right"
                        >{r.installments.length}</td
                      >
                    {/if}
                  {/each}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {#if studies.length >= 2}
          <div class="p-4 bg-muted rounded-lg">
            <h3 class="font-semibold mb-2 text-sm">
              {t("compare.savings", { name: studies[0].name })}
            </h3>
            <div class="space-y-2 text-sm">
              {#each studies.slice(1) as study}
                {@const r = $allResultsStore[study.id]}
                {@const base = $allResultsStore[studies[0].id]}
                {#if r && base}
                  {@const eco = getEconomy(base.totalInterest, r.totalInterest)}
                  <p>
                    <strong>{study.name}</strong>: {t("compare.savingsLine", {
                      amount: formatCurrency(eco.interest),
                      percent: eco.percent.toFixed(1),
                    })}
                  </p>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="space-y-6">
      <div class="p-6 bg-muted rounded-lg">
        <h2 class="font-semibold mb-2">{t("compare.howTitle")}</h2>
        <ol
          class="text-sm text-muted-foreground space-y-2 list-decimal list-inside"
        >
          <li>{t("compare.how1")}</li>
          <li>{t("compare.how2")}</li>
          <li>{t("compare.how3")}</li>
        </ol>
      </div>
      <div class="p-4 bg-muted rounded-lg">
        <h3 class="font-semibold mb-3 text-lg">{t("compare.systemsTitle")}</h3>
        <div class="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <p class="font-medium text-primary">PRICE</p>
            <p class="text-muted-foreground">{t("compare.priceDesc")}</p>
          </div>
          <div>
            <p class="font-medium text-primary">SAC</p>
            <p class="text-muted-foreground">{t("compare.sacDesc")}</p>
          </div>
          <div>
            <p class="font-medium text-primary">SAM</p>
            <p class="text-muted-foreground">{t("compare.samDesc")}</p>
          </div>
          <div>
            <p class="font-medium text-primary">Americano</p>
            <p class="text-muted-foreground">{t("compare.americanDesc")}</p>
          </div>
        </div>
      </div>
      <p class="text-center text-muted-foreground">
        {t("compare.backBefore")}
        <a href={href("/")} class="text-primary hover:underline"
          >{t("compare.backLink")}</a
        >
        {t("compare.backAfter")}
      </p>
    </div>
  {/if}
</div>
