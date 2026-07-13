import type { Installment, ExtraPayment } from "./types";

export function calculateSac(
  principal: number,
  monthlyRate: number,
  termMonths: number,
  extraPayments: ExtraPayment[] = [],
): Installment[] {
  const installments: Installment[] = [];
  let balance = principal;
  let remainingMonths = termMonths;
  let amortization = principal / termMonths;

  const getExtraPayments = (month: number): ExtraPayment[] =>
    extraPayments.filter((ep) => ep.month === month);

  for (let i = 1; i <= termMonths && balance > 0.01; i++) {
    const extras = getExtraPayments(i);
    const interest = balance * monthlyRate;
    const amort = Math.min(amortization, balance);
    const totalExtraAmount = extras.reduce(
      (sum, extra) => sum + Math.min(extra.amount, balance - amort),
      0,
    );
    const totalPrincipal = amort + totalExtraAmount;
    const payment = totalPrincipal + interest;

    balance -= totalPrincipal;
    remainingMonths--;

    if (
      extras.some((ep) => ep.type === "reduce_installment") &&
      balance > 0.01
    ) {
      remainingMonths = termMonths - i;
      amortization = remainingMonths > 0 ? balance / remainingMonths : 0;
    }

    installments.push({
      number: i,
      payment,
      principal: totalPrincipal,
      interest,
      balance: Math.max(balance, 0),
      extraPayment: totalExtraAmount > 0 ? totalExtraAmount : undefined,
    });
  }

  const actualTerm = installments.length;
  const excessPayments = extraPayments
    .filter((ep) => ep.month > actualTerm)
    .reduce((sum, ep) => sum + ep.amount, 0);

  if (excessPayments > 0 && installments.length > 0) {
    const lastIdx = installments.length - 1;
    const last = installments[lastIdx];
    const extraAmount = Math.min(excessPayments, last.balance);
    installments[lastIdx] = {
      ...last,
      payment: last.payment + extraAmount,
      principal: last.principal + extraAmount,
      balance: Math.max(last.balance - extraAmount, 0),
      extraPayment: (last.extraPayment || 0) + extraAmount,
    };
  }

  return installments;
}
