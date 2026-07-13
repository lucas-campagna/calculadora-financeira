import type { Installment, ExtraPayment } from "./types";

export function calculateSam(
  principal: number,
  monthlyRate: number,
  termMonths: number,
  extraPayments: ExtraPayment[] = [],
): Installment[] {
  const installments: Installment[] = [];
  let balance = principal;

  const fixedAmort = principal / termMonths;
  const originalPmt =
    monthlyRate === 0
      ? principal / termMonths
      : principal *
        (monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)));

  let remainingMonths = termMonths;
  let currentPmt = originalPmt;

  const getExtraPayment = (month: number): ExtraPayment | undefined =>
    extraPayments.find((ep) => ep.month === month);

  for (let i = 1; i <= termMonths && balance > 0.01; i++) {
    const extra = getExtraPayment(i);
    const interest = balance * monthlyRate;
    const sacAmort = balance / remainingMonths;
    const sacInstallment = sacAmort + interest;
    const priceInstallment =
      monthlyRate === 0
        ? balance / remainingMonths
        : balance *
          (monthlyRate / (1 - Math.pow(1 + monthlyRate, -remainingMonths)));
    const samPayment = (sacInstallment + priceInstallment) / 2;
    const samPrincipal = Math.max(samPayment - interest, 0);
    const extraAmount = extra
      ? Math.min(extra.amount, balance - samPrincipal)
      : 0;
    const totalPrincipal = samPrincipal + extraAmount;
    const payment = totalPrincipal + interest;

    balance -= totalPrincipal;
    remainingMonths--;

    if (extra && extra.type === "reduce_installment" && balance > 0.01) {
      remainingMonths = termMonths - i;
      if (remainingMonths > 0) {
        currentPmt =
          monthlyRate === 0
            ? balance / remainingMonths
            : balance *
              (monthlyRate / (1 - Math.pow(1 + monthlyRate, -remainingMonths)));
      }
    }

    installments.push({
      number: i,
      payment,
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
