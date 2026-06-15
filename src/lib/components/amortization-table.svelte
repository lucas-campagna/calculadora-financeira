<script lang="ts">
	import { formatCurrency } from '$lib/calculator';
	import { allResultsStore } from '$lib/stores/calculator-store';
	import type { AmortizationSystem, Installment } from '$lib/calculator/types';

	let {
		system = 'price' as AmortizationSystem,
		onrowclick = (_month: number) => {},
		defaultExpanded = false,
		flexMode = false
	}: {
		system?: AmortizationSystem;
		onrowclick?: (month: number) => void;
		defaultExpanded?: boolean;
		flexMode?: boolean;
	} = $props();

	let expanded = $state(defaultExpanded);

	let currentResult = $derived($allResultsStore[system]);
</script>

{#if currentResult}
	<div class={flexMode ? 'flex flex-col h-full' : ''}>
		<div class={flexMode ? 'flex-1 min-h-0 overflow-auto border rounded-lg' : 'overflow-auto border rounded-lg'} style={flexMode ? '' : 'max-height: 45vh'}>
			<table class="w-full text-xs border-collapse min-w-[500px]">
				<thead class="sticky top-0 z-10">
					<tr class="border-b bg-muted">
						<th class="px-2 py-1 text-left font-medium bg-muted">Mes</th>
						<th class="px-2 py-1 text-right font-medium bg-muted">Parcela</th>
						<th class="px-2 py-1 text-right font-medium bg-muted">Amort.</th>
						<th class="px-2 py-1 text-right font-medium bg-muted">Juros</th>
						<th class="px-2 py-1 text-right font-medium bg-muted">Saldo</th>
						{#if currentResult.installments.some((i: Installment) => i.extraPayment)}
							<th class="px-2 py-1 text-right font-medium bg-muted">Extra</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each currentResult.installments as installment, i}
						<tr
							class="border-b hover:bg-primary/10 cursor-pointer active:bg-primary/20 transition-colors {i % 2 === 0 ? '' : 'bg-muted/30'}"
							onclick={() => onrowclick(installment.number)}
							role="button"
							tabindex="0"
							onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') onrowclick(installment.number); }}
						>
							<td class="px-2 py-1">{installment.number}</td>
							<td class="px-2 py-1 text-right">{formatCurrency(installment.payment)}</td>
							<td class="px-2 py-1 text-right">{formatCurrency(installment.principal)}</td>
							<td class="px-2 py-1 text-right text-destructive">{formatCurrency(installment.interest)}</td>
							<td class="px-2 py-1 text-right">{formatCurrency(installment.balance)}</td>
							{#if currentResult.installments.some((inst: Installment) => inst.extraPayment)}
								<td class="px-2 py-1 text-right">
									{installment.extraPayment ? formatCurrency(installment.extraPayment) : '—'}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if !defaultExpanded}
			<div class="flex justify-end mt-1">
				<button class="text-xs text-primary hover:underline py-1" onclick={() => (expanded = !expanded)}>
					{expanded ? '▲ Ver resumo' : '▼ Ver tudo'}
				</button>
			</div>
		{/if}

		<p class="text-xs text-muted-foreground mt-1">Toque em uma parcela para adicionar pagamento extra.</p>
	</div>
{/if}