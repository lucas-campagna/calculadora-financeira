export type AmortizationSystem = "price" | "sac" | "sam" | "americano";

export interface Installment {
  number: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  extraPayment?: number;
}

export interface ExtraPayment {
  month: number;
  amount: number;
  type: "reduce_installment" | "reduce_term";
}

export interface FinancingInput {
  system: AmortizationSystem;
  principal: number;
  annualRate: number;
  termMonths: number;
  downPayment?: number;
  extraPayments: ExtraPayment[];
}

export interface FinancingResult {
  system: AmortizationSystem;
  systemLabel: string;
  studyId?: string;
  studyName?: string;
  totalPaid: number;
  totalInterest: number;
  totalPrincipal: number;
  firstInstallment: number;
  lastInstallment: number;
  installments: Installment[];
  effectiveRate: number;
}

export interface Study {
  id: string;
  name: string;
  system: AmortizationSystem;
  principal: string;
  annualRate: string;
  termMonths: string;
  downPayment: string;
  extraPayments: ExtraPayment[];
}

export const SYSTEM_LABELS: Record<AmortizationSystem, string> = {
  price: "PRICE (Parcelas Fixas)",
  sac: "SAC (Amortizacoes Fixas)",
  sam: "SAM (Misto)",
  americano: "Americano",
};
