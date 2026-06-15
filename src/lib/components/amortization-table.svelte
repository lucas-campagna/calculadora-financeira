<script lang="ts">
	import { formatCurrency } from '$lib/calculator';
	import { allResultsStore } from '$lib/stores/calculator-store';
	import type { AmortizationSystem, Installment } from '$lib/calculator/types';

	let {
		system = 'price' as AmortizationSystem,
		onrowclick = (_month: number) => {}
	}: {
		system?: AmortizationSystem;
		onrowclick?: (month: number) => void;
	} = $props();

	let expanded = $state(false);
	let showAll = $state(false);

	const PAGE_SIZE = 12;

	let currentResult = $derived($allResultsStore[system]);
</script>

{#if currentResult}
	<div class="mt-2">
		<div class="flex items-center justify-between mb-2">
			<h3 class="text-sm font-semibold">Tabela — {currentResult.systemLabel}</h3>
			<button class="text-sm text-primary hover:underline py-1" onclick={() => (expanded = !expanded)}>
				{expanded ? '▲ Ver resumo' : '▼ Ver tudo'}
			</button>
		</div>

		<p class="text-xs text-muted-foreground mb-2">Toque em uma parcela para adicionar pagamento extra.</p>

		<div class="overflow-x-auto -mx-4 px-4">
			<div class="relative">
				<table class="w-full text-sm border-collapse min-w-[600px]">
					<thead class="sticky top-0 z-10">
						<tr class="border-b bg-muted">
							<th class="px-3 py-2 text-left font-medium bg-muted">Mes</th>
							<th class="px-3 py-2 text-right font-medium bg-muted">Parcela</th>
							<th class="px-3 py-2 text-right font-medium bg-muted">Amortizacao</th>
							<th class="px-3 py-2 text-right font-medium bg-muted">Juros</th>
							<th class="px-3 py-2 text-right font-medium bg-muted">Saldo</th>
							{#if currentResult.installments.some((i: Installment) => i.extraPayment)}
								<th class="px-3 py-2 text-right font-medium bg-muted">Aporte Extra</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each currentResult.installments.slice(0, expanded ? undefined : showAll ? undefined : PAGE_SIZE) as installment, i}
							<tr
								class="border-b hover:bg-primary/10 cursor-pointer active:bg-primary/20 transition-colors {i % 2 === 0 ? '' : 'bg-muted/30'}"
								onclick={() => onrowclick(installment.number)}
								role="button"
								tabindex="0"
								onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') onrowclick(installment.number); }}
							>
								<td class="px-3 py-2">{installment.number}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(installment.payment)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(installment.principal)}</td>
								<td class="px-3 py-2 text-right text-destructive">{formatCurrency(installment.interest)}</td>
								<td class="px-3 py-2 text-right">{formatCurrency(installment.balance)}</td>
								{#if currentResult.installments.some((inst: Installment) => inst.extraPayment)}
									<td class="px-3 py-2 text-right">
										{installment.extraPayment ? formatCurrency(installment.extraPayment) : '—'}
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		{#if !expanded && currentResult.installments.length > PAGE_SIZE && !showAll}
			<div class="text-center mt-2">
				<button
					class="text-sm text-primary hover:underline py-1"
					onclick={() => (showAll = true)}
				>
					Mostrar todas as {currentResult.installments.length} parcelas
				</button>
			</div>
		{/if}
	</div>
{/if}