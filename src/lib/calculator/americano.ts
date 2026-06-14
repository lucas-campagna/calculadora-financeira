import type { Installment, ExtraPayment } from './types';

export function calculateAmericano(
	principal: number,
	monthlyRate: number,
	termMonths: number,
	extraPayments: ExtraPayment[] = []
): Installment[] {
	const installments: Installment[] = [];
	let balance = principal;

	const getExtraPayment = (month: number): ExtraPayment | undefined =>
		extraPayments.find((ep) => ep.month === month);

	for (let i = 1; i <= termMonths; i++) {
		const extra = getExtraPayment(i);
		const interest = balance * monthlyRate;

		if (i === termMonths) {
			const payment = balance + interest;
			const extraAmount = extra ? extra.amount : 0;
			installments.push({
				number: i,
				payment: payment + extraAmount,
				principal: balance + extraAmount,
				interest,
				balance: 0,
				extraPayment: extraAmount > 0 ? extraAmount : undefined
			});
			balance = 0;
		} else {
			const extraAmount = extra ? extra.amount : 0;
			installments.push({
				number: i,
				payment: interest + extraAmount,
				principal: extraAmount,
				interest,
				balance: Math.max(balance, 0),
				extraPayment: extraAmount > 0 ? extraAmount : undefined
			});
			balance -= extraAmount;
		}
	}

	return installments;
}