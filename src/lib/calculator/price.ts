import type { Installment, ExtraPayment } from "./types";

export function calculatePrice(
  principal: number,
  monthlyRate: number,
  termMonths: number,
  extraPayments: ExtraPayment[] = [],
): Installment[] {
  const installments: Installment[] = [];
  let balance = principal;

  const getExtraPayment = (month: number): ExtraPayment | undefined =>
    extraPayments.find((ep) => ep.month === month);

  const pmt =
    monthlyRate === 0
      ? principal / termMonths
      : principal *
        (monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)));

  let currentPmt = pmt;
  let remainingTerm = termMonths;

  for (let i = 1; i <= termMonths && balance > 0.01; i++) {
    const extra = getExtraPayment(i);
    const interest = balance * monthlyRate;
    let payment = Math.min(currentPmt, balance + interest);
    const principal_portion = payment - interest;
    let extraAmount = extra
      ? Math.min(extra.amount, balance - principal_portion)
      : 0;

    const totalPayment = payment + extraAmount;
    const totalPrincipal = principal_portion + extraAmount;
    balance -= totalPrincipal;

    if (extra && extra.type === "reduce_term" && balance > 0.01) {
      remainingTerm = Math.ceil(
        -Math.log(1 - (balance * monthlyRate) / currentPmt) /
          Math.log(1 + monthlyRate),
      );
      if (i >= remainingTerm) {
        break;
      }
    }

    if (extra && extra.type === "reduce_installment" && balance > 0.01) {
      const monthsRemaining = termMonths - i;
      if (monthsRemaining > 0) {
        currentPmt =
          monthlyRate === 0
            ? balance / monthsRemaining
            : balance *
              (monthlyRate / (1 - Math.pow(1 + monthlyRate, -monthsRemaining)));
      }
    }

    installments.push({
      number: i,
      payment: totalPayment,
      principal: totalPrincipal,
      interest,
      balance: Math.max(balance, 0),
      extraPayment: extraAmount > 0 ? extraAmount : undefined,
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
