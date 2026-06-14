<script lang="ts">
	import type { FinancingResult } from '$lib/calculator/types';
	import { formatCurrency, formatPercent } from '$lib/calculator';
	import Card from '$lib/components/ui/card.svelte';
	import CardHeader from '$lib/components/ui/card-header.svelte';
	import CardTitle from '$lib/components/ui/card-title.svelte';
	import CardContent from '$lib/components/ui/card-content.svelte';
	import { resultStore } from '$lib/stores/calculator-store';

	function StatItem({ label, value }: { label: string; value: string }) {
		return `
			<div class="flex flex-col items-center p-3 bg-muted rounded-lg">
				<span class="text-xs text-muted-foreground">${label}</span>
				<span class="text-lg font-bold">${value}</span>
			</div>
		`;
	}
</script>

{#if $resultStore}
	{@const result = $resultStore}
	<Card>
		<CardHeader>
			<CardTitle>Resultado — {result.systemLabel}</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<div class="flex flex-col items-center p-3 bg-muted rounded-lg">
					<span class="text-xs text-muted-foreground">Valor Total Pago</span>
					<span class="text-lg font-bold">{formatCurrency(result.totalPaid)}</span>
				</div>
				<div class="flex flex-col items-center p-3 bg-muted rounded-lg">
					<span class="text-xs text-muted-foreground">Total de Juros</span>
					<span class="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</span>
				</div>
				<div class="flex flex-col items-center p-3 bg-muted rounded-lg">
					<span class="text-xs text-muted-foreground">Primeira Parcela</span>
					<span class="text-lg font-bold">{formatCurrency(result.firstInstallment)}</span>
				</div>
				<div class="flex flex-col items-center p-3 bg-muted rounded-lg">
					<span class="text-xs text-muted-foreground">Última Parcela</span>
					<span class="text-lg font-bold">{formatCurrency(result.lastInstallment)}</span>
				</div>
			</div>
			<div class="mt-3 flex gap-4 text-sm text-muted-foreground justify-center">
				<span>Taxa efetiva: {formatPercent(result.effectiveRate)}</span>
				<span>|</span>
				<span>Total de parcelas: {result.installments.length}</span>
			</div>
		</CardContent>
	</Card>
{/if}