<script lang="ts">
	import { formatCurrency } from '$lib/calculator';
	import jspdf from 'jspdf';
	import papaparse from 'papaparse';
	import { resultStore } from '$lib/stores/calculator-store';
	import Button from '$lib/components/ui/button.svelte';

	function exportCSV() {
		if (!$resultStore) return;
		const data = $resultStore.installments.map((i) => ({
			Mês: i.number,
			Parcela: i.payment.toFixed(2),
			Amortização: i.principal.toFixed(2),
			Juros: i.interest.toFixed(2),
			'Saldo Devedor': i.balance.toFixed(2),
			...(i.extraPayment ? { 'Aporte Extra': i.extraPayment.toFixed(2) } : {})
		}));

		const csv = papaparse.unparse(data);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `financiamento-${$resultStore.systemLabel.toLowerCase()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function exportPDF() {
		if (!$resultStore) return;
		const doc = new jspdf();
		const result = $resultStore;

		doc.setFontSize(18);
		doc.text(`Simulação - ${result.systemLabel}`, 14, 20);

		doc.setFontSize(10);
		doc.text(`Valor Total Pago: ${formatCurrency(result.totalPaid)}`, 14, 32);
		doc.text(`Total de Juros: ${formatCurrency(result.totalInterest)}`, 14, 38);
		doc.text(`Primeira Parcela: ${formatCurrency(result.firstInstallment)}`, 14, 44);
		doc.text(`Última Parcela: ${formatCurrency(result.lastInstallment)}`, 14, 50);
		doc.text(`Número de Parcelas: ${result.installments.length}`, 14, 56);

		doc.setFontSize(12);
		doc.text('Tabela de Amortização', 14, 66);

		let y = 74;
		doc.setFontSize(8);
		doc.text('Mês', 14, y);
		doc.text('Parcela', 30, y);
		doc.text('Amort.', 55, y);
		doc.text('Juros', 75, y);
		doc.text('Saldo', 95, y);
		y += 6;

		for (const inst of result.installments) {
			if (y > 280) {
				doc.addPage();
				y = 20;
			}
			doc.text(String(inst.number), 14, y);
			doc.text(formatCurrency(inst.payment), 30, y);
			doc.text(formatCurrency(inst.principal), 55, y);
			doc.text(formatCurrency(inst.interest), 75, y);
			doc.text(formatCurrency(inst.balance), 95, y);
			y += 5;
		}

		doc.save(`financiamento-${result.systemLabel.toLowerCase()}.pdf`);
	}
</script>

{#if $resultStore}
	<div class="flex gap-2 flex-wrap">
		<Button variant="outline" size="sm" onclick={exportCSV}>
			📄 Exportar CSV
		</Button>
		<Button variant="outline" size="sm" onclick={exportPDF}>
			📑 Exportar PDF
		</Button>
	</div>
{/if}