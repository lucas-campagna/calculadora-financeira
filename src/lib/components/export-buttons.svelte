<script lang="ts">
  import { formatCurrency } from "$lib/calculator";
  import jspdf from "jspdf";
  import papaparse from "papaparse";
  import { get } from "svelte/store";
  import { allResultsStore, studiesStore } from "$lib/stores/calculator-store";
  import { copyShareLink } from "$lib/stores/share-state";
  import Button from "$lib/components/ui/button.svelte";
  import Book from "$lib/components/ui/icons/book.svelte";
  import { Link } from "@lucide/svelte";
  import { t } from "$lib/i18n";

  let copyFeedback = $state<string | null>(null);

  function exportCSV() {
    const study = $studiesStore.studies.find(
      (s) => s.id === $studiesStore.activeStudyId,
    );
    const result = study ? $allResultsStore[study.id] : null;
    if (!study || !result) return;

    const data = result.installments.map((i) => ({
      [t("export.csv.month")]: i.number,
      [t("export.csv.payment")]: i.payment.toFixed(2),
      [t("export.csv.amortization")]: i.principal.toFixed(2),
      [t("export.csv.interest")]: i.interest.toFixed(2),
      [t("export.csv.balance")]: i.balance.toFixed(2),
      ...(i.extraPayment
        ? { [t("export.csv.extra")]: i.extraPayment.toFixed(2) }
        : {}),
    }));

    const csv = papaparse.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t("export.filenamePrefix")}-${study.name.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const study = $studiesStore.studies.find(
      (s) => s.id === $studiesStore.activeStudyId,
    );
    const result = study ? $allResultsStore[study.id] : null;
    if (!study || !result) return;
    const doc = new jspdf();

    doc.setFontSize(18);
    doc.text(t("export.pdf.title", { name: study.name }), 14, 20);

    doc.setFontSize(10);
    doc.text(
      `${t("export.pdf.totalPaid")}: ${formatCurrency(result.totalPaid)}`,
      14,
      32,
    );
    doc.text(
      `${t("export.pdf.totalInterest")}: ${formatCurrency(result.totalInterest)}`,
      14,
      38,
    );
    doc.text(
      `${t("export.pdf.firstInstallment")}: ${formatCurrency(result.firstInstallment)}`,
      14,
      44,
    );
    doc.text(
      `${t("export.pdf.lastInstallment")}: ${formatCurrency(result.lastInstallment)}`,
      14,
      50,
    );
    doc.text(
      `${t("export.pdf.installments")}: ${result.installments.length}`,
      14,
      56,
    );

    doc.setFontSize(12);
    doc.text(t("export.pdf.amortizationTable"), 14, 66);

    let y = 74;
    doc.setFontSize(8);
    doc.text(t("table.month"), 14, y);
    doc.text(t("table.payment"), 30, y);
    doc.text(t("table.amortization"), 55, y);
    doc.text(t("table.interest"), 75, y);
    doc.text(t("table.balance"), 95, y);
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

    doc.save(
      `${t("export.filenamePrefix")}-${study.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    );
  }

  async function copyLink() {
    const ok = await copyShareLink(get(studiesStore));
    copyFeedback = ok ? t("common.copied") : t("common.copyError");
    if (ok) {
      setTimeout(() => (copyFeedback = null), 2000);
    }
  }
</script>

{#if $studiesStore.studies.find((s) => s.id === $studiesStore.activeStudyId)}
  <div class="flex gap-3 flex-wrap items-center">
    <Button
      variant="outline"
      size="default"
      onclick={() => (window as any)?.toggleDoc()}
      ><Book color="#3e3e3e" /></Button
    >
    <Button variant="outline" size="default" onclick={copyLink}>
      <Link class="w-4 h-4 mr-1" />
      {t("common.copyLink")}
    </Button>
    {#if $allResultsStore[$studiesStore.activeStudyId]}
      <Button variant="outline" size="default" onclick={exportCSV}>
        {t("common.export")} CSV
      </Button>
      <Button variant="outline" size="default" onclick={exportPDF}>
        {t("common.export")} PDF
      </Button>
    {/if}
    {#if copyFeedback}
      <span class="text-xs text-green-600 dark:text-green-400 ml-1"
        >{copyFeedback}</span
      >
    {/if}
  </div>
{/if}
