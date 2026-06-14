import type { Installment, ExtraPayment } from './types';

export function calculatePrice(
	principal: number,
	monthlyRate: number,
	termMonths: number,
	extraPayments: ExtraPayment[] = []
): Installment[] {
	const installments: Installment[] = [];
	let balance = principal;
	let remainingTerm = termMonths;

	const getExtraPayment = (month: number): ExtraPayment | undefined =>
		extraPayments.find((ep) => ep.month === month);

	for (let i = 1; i <= termMonths && balance > 0.01; i++) {
		const extra = getExtraPayment(i);
		const interest = balance * monthlyRate;
		const pmt = balance * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -remainingTerm)));
		const payment = Math.min(pmt, balance + interest);
		const principal_portion = payment - interest;
		const extraAmount = extra ? Math.min(extra.amount, balance - principal_portion) : 0;

		const totalPayment = payment + extraAmount;
		const totalPrincipal = principal_portion + extraAmount;
		balance -= totalPrincipal;

		if (extra && extra.type === 'reduce_term') {
			remainingTerm = Math.ceil(
				-Math.log(1 - (balance * monthlyRate) / pmt) / Math.log(1 + monthlyRate)
			);
		}

		installments.push({
			number: i,
			payment: totalPayment,
			principal: totalPrincipal,
			interest,
			balance: Math.max(balance, 0),
			extraPayment: extraAmount > 0 ? extraAmount : undefined
		});

		if (extra && extra.type === 'reduce_installment') {
			remainingTerm = Math.ceil(
				-Math.log(1 - (balance * monthlyRate) / pmt) / Math.log(1 + monthlyRate)
			);
		}
		remainingTerm--;
	}

	return installments;
}