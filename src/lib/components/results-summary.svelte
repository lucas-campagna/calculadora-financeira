<script lang="ts">
	import { formatCurrency, formatPercent } from '$lib/calculator';
	import { allResultsStore } from '$lib/stores/calculator-store';
	import type { AmortizationSystem } from '$lib/calculator/types';

	const systems: { key: AmortizationSystem; label: string; color: string }[] = [
		{ key: 'price', label: 'PRICE', color: 'bg-blue-500' },
		{ key: 'sac', label: 'SAC', color: 'bg-green-500' },
		{ key: 'sam', label: 'SAM', color: 'bg-yellow-500' },
		{ key: 'americano', label: 'Americano', color: 'bg-purple-500' }
	];
</script>

{#if $allResultsStore.price}
	<div class="space-y-4">
		<h2 class="text-base font-semibold">Resultado</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#each systems as sys}
				{@const result = $allResultsStore[sys.key]}
				{#if result}
					<div class="border rounded-lg p-4">
						<div class="flex items-center gap-2 mb-3">
							<div class="w-3 h-3 rounded-full {sys.color}"></div>
							<h3 class="text-sm font-bold">{sys.label}</h3>
						</div>
						<div class="space-y-1 text-sm">
							<div class="flex justify-between">
								<span class="text-muted-foreground">Total Pago</span>
								<span class="font-bold">{formatCurrency(result.totalPaid)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Juros</span>
								<span class="font-bold text-destructive">{formatCurrency(result.totalInterest)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">1ª Parcela</span>
								<span class="font-bold">{formatCurrency(result.firstInstallment)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Última Parcela</span>
								<span class="font-bold">{formatCurrency(result.lastInstallment)}</span>
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