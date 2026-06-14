export type AmortizationSystem = 'price' | 'sac' | 'sam' | 'americano';

export type FinancingType = 'imobiliario' | 'veiculos' | 'pessoal';

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
	type: 'reduce_installment' | 'reduce_term';
}

export interface FinancingInput {
	type: FinancingType;
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
	totalPaid: number;
	totalInterest: number;
	totalPrincipal: number;
	firstInstallment: number;
	lastInstallment: number;
	installments: Installment[];
	effectiveRate: number;
}

export interface ComparisonResult {
	price: FinancingResult;
	sac: FinancingResult;
	system: AmortizationSystem;
	input: FinancingInput;
}

export const SYSTEM_LABELS: Record<AmortizationSystem, string> = {
	price: 'PRICE (Parcelas Fixas)',
	sac: 'SAC (Amortizações Fixas)',
	sam: 'SAM (Misto)',
	americano: 'Americano'
};

export const FINANCING_TYPE_LABELS: Record<FinancingType, string> = {
	imobiliario: 'Financiamento Imobiliário',
	veiculos: 'Financiamento de Veículos',
	pessoal: 'Empréstimo Pessoal'
};