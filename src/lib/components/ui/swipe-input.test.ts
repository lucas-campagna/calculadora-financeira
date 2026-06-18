import { describe, it, expect } from "vitest";
import { formatInputValue } from "$lib/calculator";
import { SWIPE_TICK_PERCENT, MAX_MONTHS } from "$lib/constants";

describe("SwipeInput helper functions", () => {
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

  describe("applyMin", () => {
    const applyMin = (v: number, min: string, max: string): number => {
      const minVal = parseFloat(min) || 0;
      const maxVal = parseFloat(max) || Infinity;
      return Math.min(Math.max(minVal, v), maxVal);
    };

    it("applies min constraint", () => {
      expect(applyMin(5, "10", "")).toBe(10);
      expect(applyMin(0, "0", "")).toBe(0);
    });

    it("applies max constraint", () => {
      expect(applyMin(50, "0", "30")).toBe(30);
      expect(applyMin(100, "0", "100")).toBe(100);
    });

    it("returns value when within range", () => {
      expect(applyMin(50, "0", "100")).toBe(50);
      expect(applyMin(10, "5", "20")).toBe(10);
    });

    it("handles MAX_MONTHS constraint", () => {
      expect(applyMin(2500, "1", String(MAX_MONTHS))).toBe(2400);
      expect(applyMin(100, "1", String(MAX_MONTHS))).toBe(100);
    });
  });

  describe("getNumericValue", () => {
    const getNumericValue = (value: string, inputmode: string): number => {
      if (inputmode === "tax") {
        return parseFloat(value.replace(",", ".")) || 0;
      }
      const digits = value.replace(/[^\d]/g, "");
      return parseInt(digits, 10) || 0;
    };

    it("parses regular numeric values", () => {
      expect(getNumericValue("1234", "numeric")).toBe(1234);
      expect(getNumericValue("1000000", "numeric")).toBe(1000000);
    });

    it("parses tax values with comma decimal", () => {
      expect(getNumericValue("12,34", "tax")).toBe(12.34);
      expect(getNumericValue("0,5", "tax")).toBe(0.5);
    });

    it("returns 0 for invalid values", () => {
      expect(getNumericValue("", "numeric")).toBe(0);
      expect(getNumericValue("abc", "numeric")).toBe(0);
    });
  });

  describe("getDisplayValue for numeric mode", () => {
    const getDisplayValue = (value: string): string => {
      const digits = value.replace(/[^\d]/g, "");
      if (!digits) return "";
      const num = parseInt(digits, 10);
      if (isNaN(num)) return "";
      return (num / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    it("formats value as currency (cents)", () => {
      expect(getDisplayValue("100")).toBe("1,00");
      expect(getDisplayValue("1234")).toBe("12,34");
      expect(getDisplayValue("100000")).toBe("1.000,00");
    });

    it("returns empty for empty value", () => {
      expect(getDisplayValue("")).toBe("");
    });
  });

  describe("getDisplayValue for tax mode", () => {
    const getDisplayValue = (value: string): string => {
      const num = parseFloat(value.replace(",", ".")) || 0;
      return num.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    it("formats tax value with 2 decimals", () => {
      expect(getDisplayValue("12,34")).toBe("12,34");
      expect(getDisplayValue("10")).toBe("10,00");
    });
  });

  describe("monthBreakdown calculation", () => {
    const getMonthBreakdown = (num: number): string | null => {
      if (num === 0) return null;
      const years = Math.floor(num / 12);
      const months = num % 12;
      const parts: string[] = [];
      if (years > 0) {
        parts.push(years === 1 ? "1 ano" : `${years} anos`);
      }
      if (months > 0) {
        parts.push(months === 1 ? "1 mês" : `${months} meses`);
      }
      return parts.join(" e ");
    };

    it("shows both years and months", () => {
      expect(getMonthBreakdown(369)).toBe("30 anos e 9 meses");
      expect(getMonthBreakdown(15)).toBe("1 ano e 3 meses");
    });

    it("shows only months when years is 0", () => {
      expect(getMonthBreakdown(11)).toBe("11 meses");
      expect(getMonthBreakdown(1)).toBe("1 mês");
    });

    it("shows only years when months is 0", () => {
      expect(getMonthBreakdown(24)).toBe("2 anos");
      expect(getMonthBreakdown(12)).toBe("1 ano");
    });

    it("returns null for 0", () => {
      expect(getMonthBreakdown(0)).toBeNull();
    });
  });

  describe("taxBreakdown calculation", () => {
    const getTaxBreakdown = (num: number): string | null => {
      if (num === 0) return null;
      const monthlyRate = (Math.pow(1 + num / 100, 1 / 12) - 1) * 100;
      return `${monthlyRate.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })}% a.m.`;
    };

    it("calculates monthly rate from annual", () => {
      const result = getTaxBreakdown(12);
      expect(result).toContain("% a.m.");
      expect(result).not.toBeNull();
    });

    it("returns null for 0", () => {
      expect(getTaxBreakdown(0)).toBeNull();
    });
  });

  describe("applyTick calculation", () => {
    const calculateTick = (
      current: number,
      inputmode: string,
      swipeTickPercent: number,
    ): number => {
      const isNumeric = inputmode === "numeric";
      const divisor = isNumeric ? 100 : 1;
      const tick =
        inputmode === "tax"
          ? Math.max(0.01, current * (swipeTickPercent / 100))
          : Math.max(divisor, Math.round(current * (swipeTickPercent / 100)));
      return tick;
    };

    it("numeric mode uses divisor as minimum tick", () => {
      expect(calculateTick(1000, "numeric", SWIPE_TICK_PERCENT)).toBe(100);
      expect(calculateTick(10, "numeric", SWIPE_TICK_PERCENT)).toBe(100);
    });

    it("tax mode uses percentage with 0.01 minimum", () => {
      const tick = calculateTick(10, "tax", SWIPE_TICK_PERCENT);
      expect(tick).toBeGreaterThanOrEqual(0.01);
      expect(tick).toBeLessThan(1);
    });

    it("month mode uses divisor as minimum tick", () => {
      const tick = calculateTick(100, "month", SWIPE_TICK_PERCENT);
      expect(tick).toBeGreaterThanOrEqual(1);
    });

    it("numeric mode uses at least 100 as tick", () => {
      const tick = calculateTick(1000, "numeric", SWIPE_TICK_PERCENT);
      expect(tick).toBe(100);
    });
  });
});
