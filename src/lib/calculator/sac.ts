import type { Installment, ExtraPayment } from "./types";

export function calculateSac(
  principal: number,
  monthlyRate: number,
  termMonths: number,
  extraPayments: ExtraPayment[] = [],
): Installment[] {
  const installments: Installment[] = [];
  let balance = principal;
  const amortization = principal / termMonths;

  const getExtraPayment = (month: number): ExtraPayment | undefined =>
    extraPayments.find((ep) => ep.month === month);

  for (let i = 1; i <= termMonths && balance > 0.01; i++) {
    const extra = getExtraPayment(i);
    const interest = balance * monthlyRate;
    const amort = Math.min(amortization, balance);
    const extraAmount = extra ? Math.min(extra.amount, balance - amort) : 0;
    const totalPrincipal = amort + extraAmount;
    const payment = totalPrincipal + interest;

    balance -= totalPrincipal;

    installments.push({
      number: i,
      payment,
      principal: totalPrincipal,
      interest,
      balance: Math.max(balance, 0),
      extraPayment: extraAmount > 0 ? extraAmount : undefined,
    });
  }

  return installments;
}
