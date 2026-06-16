<script lang="ts">
  import { formatCurrency, formatPercent } from "$lib/calculator";
  import { allResultsStore, studiesStore } from "$lib/stores/calculator-store";

  const COLORS = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-red-500",
  ];
</script>

{#if Object.keys($allResultsStore).length > 0}
  <div class="space-y-4">
    <h2 class="text-base font-semibold">Resultado</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each $studiesStore.studies as study, i}
        {@const result = $allResultsStore[study.id]}
        {#if result}
          <div
            class="border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
            onclick={() => studiesStore.setActive(study.id)}
          >
            <div class="flex items-center gap-2 mb-3">
              <div
                class="w-3 h-3 rounded-full {COLORS[i % COLORS.length]}"
              ></div>
              <h3 class="text-sm font-bold">{study.name}</h3>
            </div>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Total Pago</span>
                <span class="font-bold">{formatCurrency(result.totalPaid)}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Juros</span>
                <span class="font-bold text-destructive"
                  >{formatCurrency(result.totalInterest)}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">1ª Parcela</span>
                <span class="font-bold"
                  >{formatCurrency(result.firstInstallment)}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Última Parcela</span>
                <span class="font-bold"
                  >{formatCurrency(result.lastInstallment)}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Parcelas</span>
                <span class="font-bold">{result.installments.length}</span>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}
