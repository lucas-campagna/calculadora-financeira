<script lang="ts">
  import { onMount } from "svelte";
  import { formatCurrency } from "$lib/calculator";
  import {
    allResultsStore,
    calculateAll,
    studiesStore,
  } from "$lib/stores/calculator-store";

  function getEconomy(
    baseTotalInterest: number,
    comparedTotalInterest: number,
  ): { interest: number; percent: number } {
    const interest = baseTotalInterest - comparedTotalInterest;
    const percent =
      baseTotalInterest > 0 ? (interest / baseTotalInterest) * 100 : 0;
    return { interest, percent };
  }

  onMount(() => {
    calculateAll();
  });
</script>

<svelte:head>
  <title
    >Comparar Sistemas de Amortização — PRICE vs SAC vs SAM vs Americano</title
  >
  <meta
    name="description"
    content="Compare PRICE, SAC, SAM e Americano lado a lado. Veja qual sistema de amortização e mais vantajoso para o seu financiamento."
  />
</svelte:head>

<div class="max-w-4xl mx-auto">
  <div class="mb-8">
    <h1 class="text-2xl font-bold">Comparar Estudos</h1>
    <p class="text-sm text-muted-foreground mt-1">
      Compare seus estudos de financiamento lado a lado.
    </p>
  </div>

  {#if $studiesStore.studies.length >= 2}
    {@const studies = $studiesStore.studies}
    {@const firstResult = $allResultsStore[studies[0].id]}

    {#if firstResult}
      <div class="mt-6 space-y-6">
        <div class="p-4 bg-muted rounded-lg">
          <h3 class="font-semibold mb-3 text-lg">Resumo Comparativo</h3>
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
                    >Total Pago</td
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
                    >Total Juros</td
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
                    >1ª Parcela</td
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
                    >Última Parcela</td
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
                    >Parcelas</td
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
              Economia em Juros (em relacao a {studies[0].name})
            </h3>
            <div class="space-y-2 text-sm">
              {#each studies.slice(1) as study}
                {@const r = $allResultsStore[study.id]}
                {@const base = $allResultsStore[studies[0].id]}
                {#if r && base}
                  {@const eco = getEconomy(base.totalInterest, r.totalInterest)}
                  <p>
                    <strong>{study.name}</strong>: economia de {formatCurrency(
                      eco.interest,
                    )} em juros ({eco.percent.toFixed(1)}% a menos)
                  </p>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <p class="text-muted-foreground">
      Adicione pelo menos 2 estudos para comparar.
    </p>
  {/if}
</div>
