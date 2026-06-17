import { describe, it, expect } from "vitest";
import {
  calculate,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatInputValue,
  parseFormattedValue,
} from "./index";
import type { FinancingInput } from "./types";

describe("formatCurrency", () => {
  it("formats BRL currency correctly", () => {
    expect(formatCurrency(1000)).toContain("1.000,00");
    expect(formatCurrency(1234.56)).toContain("1.234,56");
    expect(formatCurrency(0)).toContain("0,00");
  });

  it("handles small values", () => {
    expect(formatCurrency(0.01)).toContain("0,01");
  });

  it("handles large values", () => {
    expect(formatCurrency(1000000)).toContain("1.000.000,00");
  });
});

describe("formatNumber", () => {
  it("formats numbers with 2 decimal places", () => {
    expect(formatNumber(1234)).toBe("1.234,00");
    expect(formatNumber(1234.56)).toBe("1.234,56");
    expect(formatNumber(0)).toBe("0,00");
  });

  it("rounds to 2 decimal places", () => {
    expect(formatNumber(123.456)).toBe("123,46");
    expect(formatNumber(123.454)).toBe("123,45");
  });
});

describe("formatPercent", () => {
  it("formats percentage correctly", () => {
    expect(formatPercent(10)).toBe("10,00%");
    expect(formatPercent(12.5)).toBe("12,50%");
  });

  it("handles small percentages", () => {
    expect(formatPercent(0.5)).toBe("0,50%");
  });

  it("handles large percentages", () => {
    expect(formatPercent(100)).toBe("100,00%");
  });
});

describe("formatInputValue", () => {
  it("formats integer values with thousand separators", () => {
    expect(formatInputValue("1000")).toBe("1.000");
    expect(formatInputValue("1234567")).toBe("1.234.567");
  });

  it("returns empty string for empty input", () => {
    expect(formatInputValue("")).toBe("");
  });

  it("handles non-numeric characters", () => {
    expect(formatInputValue("abc")).toBe("");
  });
});

describe("parseFormattedValue", () => {
  it("removes thousand separators and decimal comma", () => {
    expect(parseFormattedValue("1.234,56")).toBe("123456");
  });

  it("handles plain numbers", () => {
    expect(parseFormattedValue("123456")).toBe("123456");
  });
});

describe("calculate", () => {
  const baseInput: FinancingInput = {
    system: "price",
    principal: 100_000,
    annualRate: 12,
    termMonths: 12,
    extraPayments: [],
  };

  it("calculates PRICE system correctly", () => {
    const result = calculate(baseInput);

    expect(result.system).toBe("price");
    expect(result.systemLabel).toBe("PRICE");
    expect(result.installments.length).toBe(12);
    expect(result.totalPaid).toBeCloseTo(106_274.48, 2);
    expect(result.totalInterest).toBeCloseTo(6_274.48, 2);
  });

  it("calculates SAC system correctly", () => {
    const result = calculate({ ...baseInput, system: "sac" });

    expect(result.system).toBe("sac");
    expect(result.systemLabel).toBe("SAC");
    expect(result.installments.length).toBe(12);
    expect(result.totalPaid).toBeCloseTo(106_167.72, 2);
    expect(result.totalInterest).toBeCloseTo(6_167.72, 2);
  });

  it("applies down payment correctly", () => {
    const result = calculate({ ...baseInput, downPayment: 10000 });

    expect(result.totalPrincipal).toBeLessThan(100000);
  });

  it("calculates first and last installment correctly", () => {
    const result = calculate(baseInput);

    expect(result.firstInstallment).toBe(result.installments[0].payment);
    expect(result.lastInstallment).toBe(
      result.installments[result.installments.length - 1].payment,
    );
  });

  it("handles zero annual rate", () => {
    const result = calculate({ ...baseInput, annualRate: 0 });

    expect(result.totalInterest).toBe(0);
  });

  it("calculates effective rate correctly", () => {
    const result = calculate(baseInput);

    expect(result.effectiveRate).toBe(
      (result.totalInterest / result.totalPrincipal) * 100,
    );
  });
});

describe("calculate with extra payments", () => {
  it("applies extra payment that reduces term", () => {
    const input: FinancingInput = {
      system: "price",
      principal: 100000,
      annualRate: 12,
      termMonths: 12,
      extraPayments: [{ month: 3, amount: 20000, type: "reduce_term" }],
    };

    const result = calculate(input);

    expect(result.installments.length).toBeLessThan(12);
  });

  it("applies extra payment that reduces installment", () => {
    const input: FinancingInput = {
      system: "price",
      principal: 100000,
      annualRate: 12,
      termMonths: 12,
      extraPayments: [{ month: 3, amount: 5000, type: "reduce_installment" }],
    };

    const result = calculate(input);

    expect(result.installments[2].extraPayment).toBe(5000);
  });
});

describe("installment structure", () => {
  it("each installment has correct properties", () => {
    const result = calculate({
      system: "price",
      principal: 100000,
      annualRate: 12,
      termMonths: 12,
      extraPayments: [],
    });

    result.installments.forEach((inst) => {
      expect(inst).toHaveProperty("number");
      expect(inst).toHaveProperty("payment");
      expect(inst).toHaveProperty("principal");
      expect(inst).toHaveProperty("interest");
      expect(inst).toHaveProperty("balance");
    });
  });

  it("balance decreases over time", () => {
    const result = calculate({
      system: "price",
      principal: 100000,
      annualRate: 12,
      termMonths: 12,
      extraPayments: [],
    });

    for (let i = 1; i < result.installments.length; i++) {
      expect(result.installments[i].balance).toBeLessThan(
        result.installments[i - 1].balance,
      );
    }
  });

  it("installment numbers are sequential", () => {
    const result = calculate({
      system: "price",
      principal: 100000,
      annualRate: 12,
      termMonths: 12,
      extraPayments: [],
    });

    result.installments.forEach((inst, i) => {
      expect(inst.number).toBe(i + 1);
    });
  });
});
