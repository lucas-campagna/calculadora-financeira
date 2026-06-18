export { calculatePrice } from "./price";
export { calculateSac } from "./sac";
export { calculateSam } from "./sam";
export { calculateAmericano } from "./americano";
export type {
  AmortizationSystem,
  Installment,
  ExtraPayment,
  FinancingInput,
  FinancingResult,
} from "./types";
export { SYSTEM_LABELS } from "./types";

import { calculatePrice } from "./price";
import { calculateSac } from "./sac";
import { calculateSam } from "./sam";
import { calculateAmericano } from "./americano";
import type {
  AmortizationSystem,
  FinancingInput,
  FinancingResult,
} from "./types";

const calculators: Record<AmortizationSystem, typeof calculatePrice> = {
  price: calculatePrice,
  sac: calculateSac,
  sam: calculateSam,
  americano: calculateAmericano,
};

export function calculate(input: FinancingInput): FinancingResult {
  const { system, annualRate, termMonths, downPayment, extraPayments } = input;
  const principal = downPayment
    ? input.principal - downPayment
    : input.principal;
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const systemLabel =
    system === "price"
      ? "PRICE"
      : system === "sac"
        ? "SAC"
        : system === "sam"
          ? "SAM"
          : "Americano";

  const installments = calculators[system](
    principal,
    monthlyRate,
    termMonths,
    extraPayments,
  );
  const totalPaid = installments.reduce((sum, i) => sum + i.payment, 0);
  const totalInterest = installments.reduce((sum, i) => sum + i.interest, 0);
  const totalPrincipal = installments.reduce((sum, i) => sum + i.principal, 0);

  return {
    system,
    systemLabel,
    totalPaid,
    totalInterest,
    totalPrincipal,
    firstInstallment: installments[0]?.payment ?? 0,
    lastInstallment: installments[installments.length - 1]?.payment ?? 0,
    installments,
    effectiveRate:
      totalInterest > 0 ? (totalInterest / totalPrincipal) * 100 : 0,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatInputValue(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR");
}

export function parseFormattedValue(formatted: string): string {
  return formatted.replace(/\./g, "").replace(/,/g, "");
}
