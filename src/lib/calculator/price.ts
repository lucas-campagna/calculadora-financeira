import type { Installment, ExtraPayment } from "./types";

export function calculatePrice(
  principal: number,
  monthlyRate: number,
  termMonths: number,
  extraPayments: ExtraPayment[] = [],
): Installment[] {
  const installments: Installment[] = [];
  let balance = principal;

  const getExtraPayments = (month: number): ExtraPayment[] =>
    extraPayments.filter((ep) => ep.month === month);

  const pmt =
    monthlyRate === 0
      ? principal / termMonths
      : principal *
        (monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)));

  let currentPmt = pmt;
  let remainingTerm = termMonths;

  for (let i = 1; i <= termMonths && balance > 0.01; i++) {
    const extras = getExtraPayments(i);
    const interest = balance * monthlyRate;
    let payment = Math.min(currentPmt, balance + interest);
    const principal_portion = payment - interest;
    const totalExtraAmount = extras.reduce(
      (sum, extra) => sum + Math.min(extra.amount, balance - principal_portion),
      0,
    );
    const hasReduceTerm = extras.some((ep) => ep.type === "reduce_term");
    const hasReduceInstallment = extras.some(
      (ep) => ep.type === "reduce_installment",
    );

    const totalPayment = payment + totalExtraAmount;
    const totalPrincipal = principal_portion + totalExtraAmount;
    balance -= totalPrincipal;

    if (hasReduceTerm && balance > 0.01) {
      remainingTerm = Math.ceil(
        -Math.log(1 - (balance * monthlyRate) / currentPmt) /
          Math.log(1 + monthlyRate),
      );
      if (i >= remainingTerm) {
        break;
      }
    }

    if (hasReduceInstallment && balance > 0.01) {
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
