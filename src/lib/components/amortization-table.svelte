<script lang="ts">
	import { formatCurrency } from '$lib/calculator';
	import { allResultsStore } from '$lib/stores/calculator-store';
	import type { AmortizationSystem } from '$lib/calculator/types';

	let { system = 'price' as AmortizationSystem }: { system?: AmortizationSystem } = $props();

	let expanded = $state(false);
	let showAll = $state(false);

	const PAGE_SIZE = 12;

	let currentResult = $derived($allResultsStore[system]);
</script>

{#if currentResult}
	<div class="mt-2">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-lg sm:text-xl font-semibold">Tabela — {currentResult.systemLabel}</h3>
			<button class="text-base text-primary hover:underline py-1" onclick={() => (expanded = !expanded)}>
				{expanded ? '▲ Ver resumo' : '▼ Ver tudo'}
			</button>
		</div>

		<div class="overflow-x-auto -mx-4 px-4">
			<table class="w-full text-base border-collapse min-w-[600px]">
				<thead>
					<tr class="border-b bg-muted">
						<th class="px-3 py-3 text-left font-medium">Mês</th>
						<th class="px-3 py-3 text-right font-medium">Parcela</th>
						<th class="px-3 py-3 text-right font-medium">Amortização</th>
						<th class="px-3 py-3 text-right font-medium">Juros</th>
						<th class="px-3 py-3 text-right font-medium">Saldo</th>
						{#if currentResult.installments.some((i) => i.extraPayment)}
							<th class="px-3 py-3 text-right font-medium">Aporte Extra</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each currentResult.installments.slice(0, expanded ? undefined : showAll ? undefined : PAGE_SIZE) as installment, i}
						<tr class="border-b hover:bg-muted/50 {i % 2 === 0 ? '' : 'bg-muted/30'}">
							<td class="px-3 py-2.5">{installment.number}</td>
							<td class="px-3 py-2.5 text-right">{formatCurrency(installment.payment)}</td>
							<td class="px-3 py-2.5 text-right">{formatCurrency(installment.principal)}</td>
							<td class="px-3 py-2.5 text-right text-destructive">{formatCurrency(installment.interest)}</td>
							<td class="px-3 py-2.5 text-right">{formatCurrency(installment.balance)}</td>
							{#if currentResult.installments.some((inst) => inst.extraPayment)}
								<td class="px-3 py-2.5 text-right">
									{installment.extraPayment ? formatCurrency(installment.extraPayment) : '—'}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if !expanded && currentResult.installments.length > PAGE_SIZE && !showAll}
			<div class="text-center mt-3">
				<button
					class="text-base text-primary hover:underline py-1"
					onclick={() => (showAll = true)}
				>
					Mostrar todas as {currentResult.installments.length} parcelas
				</button>
			</div>
		{/if}
	</div>
{/if}