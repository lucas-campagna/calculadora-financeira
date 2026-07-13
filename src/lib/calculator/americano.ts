import type { Installment, ExtraPayment } from "./types";

export function calculateAmericano(
  principal: number,
  monthlyRate: number,
  termMonths: number,
  extraPayments: ExtraPayment[] = [],
): Installment[] {
  const installments: Installment[] = [];
  let balance = principal;

  const getExtraPayments = (month: number): ExtraPayment[] =>
    extraPayments.filter((ep) => ep.month === month);

  for (let i = 1; i <= termMonths; i++) {
    const extras = getExtraPayments(i);
    const interest = balance * monthlyRate;
    const totalExtraAmount = extras.reduce((sum, ep) => sum + ep.amount, 0);

    if (i === termMonths) {
      const payment = balance + interest;
      installments.push({
        number: i,
        payment: payment + totalExtraAmount,
        principal: balance + totalExtraAmount,
        interest,
        balance: 0,
        extraPayment: totalExtraAmount > 0 ? totalExtraAmount : undefined,
      });
      balance = 0;
    } else {
      installments.push({
        number: i,
        payment: interest + totalExtraAmount,
        principal: totalExtraAmount,
        interest,
        balance: Math.max(balance, 0),
        extraPayment: totalExtraAmount > 0 ? totalExtraAmount : undefined,
      });
      balance -= totalExtraAmount;
    }
  }

  const actualTerm = installments.length;
  const excessPayments = extraPayments
    .filter((ep) => ep.month > actualTerm)
    .reduce((sum, ep) => sum + ep.amount, 0);

  if (excessPayments > 0 && installments.length > 0) {
    const lastIdx = installments.length - 1;
    const last = installments[lastIdx];
    installments[lastIdx] = {
      ...last,
      payment: last.payment + excessPayments,
      principal: last.principal + excessPayments,
      extraPayment: (last.extraPayment || 0) + excessPayments,
    };
  }

  return installments;
}
