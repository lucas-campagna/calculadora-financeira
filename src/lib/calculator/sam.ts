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
  const pmt =
    monthlyRate === 0
      ? principal / termMonths
      : principal *
        (monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths)));

  const getExtraPayment = (month: number): ExtraPayment | undefined =>
    extraPayments.find((ep) => ep.month === month);

  for (let i = 1; i <= termMonths && balance > 0.01; i++) {
    const extra = getExtraPayment(i);
    const interest = balance * monthlyRate;
    const sacInstallment = fixedAmort + interest;
    const samPayment = (sacInstallment + pmt) / 2;
    const samPrincipal = Math.max(samPayment - interest, 0);
    const extraAmount = extra
      ? Math.min(extra.amount, balance - samPrincipal)
      : 0;
    const totalPrincipal = samPrincipal + extraAmount;
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
