<script lang="ts">
  import { formatCurrency } from "$lib/calculator";
  import jspdf from "jspdf";
  import papaparse from "papaparse";
  import { get } from "svelte/store";
  import { allResultsStore, studiesStore } from "$lib/stores/calculator-store";
  import { copyShareLink } from "$lib/stores/share-state";
  import { Link } from "@lucide/svelte";
  import { t } from "$lib/i18n";

  let {
    open = $bindable(false),
  }: {
    open?: boolean;
  } = $props();

  let copyFeedback = $state<string | null>(null);

  function getResult() {
    const study = $studiesStore.studies.find(
      (s) => s.id === $studiesStore.activeStudyId,
    );
    if (!study) return null;
    return { study, result: $allResultsStore[study.id] };
  }

  function exportCSV() {
    const data = getResult();
    if (!data || !data.result) return;
    const { study, result } = data;

    const csvData = result.installments.map((i) => ({
      [t("export.csv.month")]: i.number,
      [t("export.csv.payment")]: i.payment.toFixed(2),
      [t("export.csv.amortization")]: i.principal.toFixed(2),
      [t("export.csv.interest")]: i.interest.toFixed(2),
      [t("export.csv.balance")]: i.balance.toFixed(2),
      ...(i.extraPayment
        ? { [t("export.csv.extra")]: i.extraPayment.toFixed(2) }
        : {}),
    }));

    const csv = papaparse.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t("export.filenamePrefix")}-${study.name.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    open = false;
  }

  function exportPDF() {
    const data = getResult();
    if (!data || !data.result) return;
    const { study, result } = data;
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
    open = false;
  }

  async function copyLink() {
    const ok = await copyShareLink(get(studiesStore));
    copyFeedback = ok ? t("common.copied") : t("common.copyError");
    if (ok) {
      setTimeout(() => (copyFeedback = null), 2000);
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 bg-black/80 flex items-end justify-center"
    onclick={() => (open = false)}
    onkeydown={(e: KeyboardEvent) => {
      if (e.key === "Escape") {
        open = false;
      }
    }}
    role="dialog"
    aria-modal="true"
    aria-label={t("export.title")}
    tabindex="0"
  >
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      role="document"
      class="bg-background w-full max-w-md rounded-t-xl p-4"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-base font-semibold mb-3">{t("export.title")}</h2>

      <button
        class="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent cursor-pointer mb-3"
        onclick={copyLink}
      >
        <Link class="w-4 h-4" />
        {t("common.copyLink")}
      </button>
      {#if copyFeedback}
        <p class="text-xs text-green-600 dark:text-green-400 text-center mb-2">
          {copyFeedback}
        </p>
      {/if}

      {#each $studiesStore.studies as study}
        {@const result = $allResultsStore[study.id]}
        <div
          class="flex items-center justify-between py-2 border-b last:border-b-0"
        >
          <div>
            <span
              class="font-medium text-sm {study.id ===
              $studiesStore.activeStudyId
                ? 'text-primary'
                : ''}">{study.name}</span
            >
            <span class="text-xs text-muted-foreground ml-2"
              >{study.system.toUpperCase()}</span
            >
          </div>
          {#if result}
            <span class="text-xs text-muted-foreground"
              >{formatCurrency(result.totalPaid)}</span
            >
          {/if}
        </div>
      {/each}

      <div class="flex gap-3 mt-4">
        <button
          class="flex-1 h-10 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent cursor-pointer"
          onclick={exportCSV}
        >
          CSV
        </button>
        <button
          class="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 cursor-pointer"
          onclick={exportPDF}
        >
          PDF
        </button>
      </div>
    </div>
  </div>
{/if}
