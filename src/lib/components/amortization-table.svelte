<script lang="ts">
	import type { FinancingResult } from '$lib/calculator/types';
	import { formatCurrency } from '$lib/calculator';
	import { resultStore } from '$lib/stores/calculator-store';

	let expanded = $state(false);
	let showAll = $state(false);

	const PAGE_SIZE = 12;
</script>

{#if $resultStore}
	{@const result = $resultStore}
	<div class="mt-6">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-lg font-semibold">Tabela de Amortização</h3>
			<button class="text-sm text-primary hover:underline" onclick={() => (expanded = !expanded)}>
				{expanded ? '▲ Ver resumo' : '▼ Ver tudo'}
			</button>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-sm border-collapse">
				<thead>
					<tr class="border-b bg-muted">
						<th class="px-3 py-2 text-left font-medium">Mês</th>
						<th class="px-3 py-2 text-right font-medium">Parcela</th>
						<th class="px-3 py-2 text-right font-medium">Amortização</th>
						<th class="px-3 py-2 text-right font-medium">Juros</th>
						<th class="px-3 py-2 text-right font-medium">Saldo Devedor</th>
						{#if result.installments.some((i) => i.extraPayment)}
							<th class="px-3 py-2 text-right font-medium">Aporte Extra</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each result.installments.slice(0, expanded ? undefined : showAll ? undefined : PAGE_SIZE) as installment, i}
						<tr class="border-b hover:bg-muted/50 {i % 2 === 0 ? '' : 'bg-muted/30'}">
							<td class="px-3 py-2">{installment.number}</td>
							<td class="px-3 py-2 text-right">{formatCurrency(installment.payment)}</td>
							<td class="px-3 py-2 text-right">{formatCurrency(installment.principal)}</td>
							<td class="px-3 py-2 text-right text-destructive">{formatCurrency(installment.interest)}</td>
							<td class="px-3 py-2 text-right">{formatCurrency(installment.balance)}</td>
							{#if result.installments.some((inst) => inst.extraPayment)}
								<td class="px-3 py-2 text-right">
									{installment.extraPayment ? formatCurrency(installment.extraPayment) : '—'}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if !expanded && result.installments.length > PAGE_SIZE && !showAll}
			<div class="text-center mt-3">
				<button
					class="text-sm text-primary hover:underline"
					onclick={() => (showAll = true)}
				>
					Mostrar todas as {result.installments.length} parcelas
				</button>
			</div>
		{/if}
	</div>
{/if}