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

	// svelte-ignore state_referenced_locally
	let expanded = $state(defaultExpanded);
	let viewMode = $state<'financing' | 'field'>('financing');
	let selectedField = $state<'payment' | 'principal' | 'interest' | 'balance'>('payment');

	const SYSTEMS: AmortizationSystem[] = ['price', 'sac', 'sam', 'americano'];
	const FIELDS: { key: 'payment' | 'principal' | 'interest' | 'balance'; label: string }[] = [
		{ key: 'payment', label: 'Parcela' },
		{ key: 'principal', label: 'Amort.' },
		{ key: 'interest', label: 'Juros' },
		{ key: 'balance', label: 'Saldo' }
	];

	let currentResult = $derived($allResultsStore[system]);
	let allResults = $derived({
		price: $allResultsStore.price,
		sac: $allResultsStore.sac,
		sam: $allResultsStore.sam,
		americano: $allResultsStore.americano
	});

	function getVal(sys: AmortizationSystem, month: number, field: 'payment' | 'principal' | 'interest' | 'balance'): number | null {
		const r = allResults[sys];
		if (!r) return null;
		const inst = r.installments.find((i: Installment) => i.number === month);
		return inst ? inst[field] : null;
	}

	let maxMonths = $derived(Math.max(
		...SYSTEMS.map(s => allResults[s]?.installments?.length ?? 0)
	));
</script>

{#if currentResult}
	<div class={flexMode ? 'flex flex-col flex-1 min-h-0' : ''}>
		<div class="flex items-center gap-2 mb-2">
			<div class="flex rounded-md border overflow-hidden">
				<button
					class="px-2 py-1 text-xs font-medium transition-colors {viewMode === 'financing' ? 'bg-primary text-primary-foreground' : 'bg-background'}"
					onclick={() => (viewMode = 'financing')}
				>
					Financiamento
				</button>
				<button
					class="px-2 py-1 text-xs font-medium transition-colors {viewMode === 'field' ? 'bg-primary text-primary-foreground' : 'bg-background'}"
					onclick={() => (viewMode = 'field')}
				>
					Campos
				</button>
			</div>
		</div>

		{#if viewMode === 'financing'}
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
		{:else}
			<div class="flex flex-wrap gap-1 mb-2">
				{#each FIELDS as f}
					<button
						class="px-2 py-1 text-xs font-medium rounded transition-colors {selectedField === f.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
						onclick={() => (selectedField = f.key)}
					>
						{f.label}
					</button>
				{/each}
			</div>
			<div class={flexMode ? 'flex-1 min-h-0 overflow-auto border rounded-lg' : 'overflow-auto border rounded-lg'} style={flexMode ? '' : 'max-height: 45vh'}>
				<table class="w-full text-xs border-collapse min-w-[500px]">
					<thead class="sticky top-0 z-10">
						<tr class="border-b bg-muted">
							<th class="px-2 py-1 text-left font-medium bg-muted">Mes</th>
							{#each SYSTEMS as sys}
								<th class="px-2 py-1 text-right font-medium bg-muted">{sys === 'price' ? 'PRICE' : sys === 'sac' ? 'SAC' : sys === 'sam' ? 'SAM' : 'Americano'}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each currentResult.installments as inst, i}
							<tr
								class="border-b hover:bg-primary/10 cursor-pointer active:bg-primary/20 transition-colors {i % 2 === 0 ? '' : 'bg-muted/30'}"
								onclick={() => onrowclick(inst.number)}
								role="button"
								tabindex="0"
								onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') onrowclick(inst.number); }}
							>
								<td class="px-2 py-1">{inst.number}</td>
								{#each SYSTEMS as sys}
									{@const v = getVal(sys, inst.number, selectedField)}
									<td class="px-2 py-1 text-right {selectedField === 'interest' ? 'text-destructive' : ''}">
										{v !== null ? formatCurrency(v) : '—'}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if !defaultExpanded && viewMode === 'financing'}
			<div class="flex justify-end mt-1">
				<button class="text-xs text-primary hover:underline py-1" onclick={() => (expanded = !expanded)}>
					{expanded ? '▲ Ver resumo' : '▼ Ver tudo'}
				</button>
			</div>
		{/if}

		<p class="text-xs text-muted-foreground mt-1">Toque em uma parcela para adicionar pagamento extra.</p>
	</div>
{/if}