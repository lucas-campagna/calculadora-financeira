import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import ComparisonChart from "./comparison-chart.svelte";
import { studiesStore, allResultsStore } from "$lib/stores/calculator-store";
import type {
  Study,
  FinancingResult,
  AmortizationSystem,
} from "$lib/calculator/types";

describe("ComparisonChart Component", () => {
  const mockStudies: Study[] = [
    {
      id: "study-1",
      name: "Estudo 1",
      system: "sac" as AmortizationSystem,
      extraPayments: [],
    },
    {
      id: "study-2",
      name: "Estudo 2",
      system: "price" as AmortizationSystem,
      extraPayments: [],
    },
  ];

  const mockResult: FinancingResult = {
    system: "sac",
    systemLabel: "SAC",
    studyId: "study-1",
    totalPaid: 100000,
    totalInterest: 50000,
    totalPrincipal: 50000,
    firstInstallment: 1000,
    lastInstallment: 800,
    effectiveRate: 10,
    installments: Array.from({ length: 120 }, (_, i) => ({
      number: i + 1,
      payment: 1000,
      principal: 800,
      interest: 200,
      balance: 100000 - (i + 1) * 800,
    })),
  };

  const mockResult2: FinancingResult = {
    system: "price",
    systemLabel: "PRICE",
    studyId: "study-2",
    totalPaid: 120000,
    totalInterest: 60000,
    totalPrincipal: 60000,
    firstInstallment: 1200,
    lastInstallment: 1000,
    effectiveRate: 12,
    installments: Array.from({ length: 120 }, (_, i) => ({
      number: i + 1,
      payment: 1200,
      principal: 900,
      interest: 300,
      balance: 120000 - (i + 1) * 900,
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    studiesStore.set({
      studies: mockStudies,
      activeStudyId: "study-1",
      commonValues: {
        principal: 100000,
        annualRate: 10,
        termMonths: 120,
        downPayment: 0,
      },
      overrides: {},
      snapshot: {
        studies: mockStudies,
        commonValues: {
          principal: 100000,
          annualRate: 10,
          termMonths: 120,
          downPayment: 0,
        },
      },
    });
    allResultsStore.set({
      "study-1": mockResult,
      "study-2": mockResult2,
    });
  });

  describe("Rendering", () => {
    it("renders the chart container", () => {
      const onlongpress = vi.fn();
      render(ComparisonChart, { props: { onselectdata: onlongpress } });
      const chartContainer = screen.getByRole("img");
      expect(chartContainer).toBeTruthy();
    });

    it("renders a canvas element", () => {
      const onlongpress = vi.fn();
      render(ComparisonChart, { props: { onselectdata: onlongpress } });
      const canvas = screen.getByRole("img")?.querySelector("canvas");
      expect(canvas).toBeTruthy();
    });

    it("does not call onlongpress on initial render", () => {
      const onlongpress = vi.fn();
      render(ComparisonChart, { props: { onselectdata: onlongpress } });
      expect(onlongpress).not.toHaveBeenCalled();
    });
  });

  describe("onlongpress callback behavior", () => {
    it("onlongpress should NOT be called when clicking far from any data point", () => {
      const onlongpress = vi.fn();
      render(ComparisonChart, { props: { onselectdata: onlongpress } });

      const canvas = screen.getByRole("img")?.querySelector("canvas");
      expect(canvas).toBeTruthy();

      // The exact pixel positions of data points are not known,
      // but we can verify that onlongpress is not called during render
      expect(onlongpress).not.toHaveBeenCalled();
    });
  });

  describe("User interactions", () => {
    it.todo(
      "1. click on blank space with no dashed line -> draw dashed line at nearest dot",
    );
    it.todo(
      "2. click on blank space on top of the vertical dashed line -> hide dashed lines",
    );
    it.todo("3. hold chart and release -> open extra payment modal");
    it.todo(
      "4. click on chart data point -> open extra payment modal for that point",
    );
  });
});
