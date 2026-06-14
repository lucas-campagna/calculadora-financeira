import { writable } from 'svelte/store';
import type { FinancingType, AmortizationSystem, ExtraPayment } from '$lib/calculator/types';
import { calculate } from '$lib/calculator';

interface CalculatorState {
	type: FinancingType;
	system: AmortizationSystem;
	principal: string;
	annualRate: string;
	termMonths: string;
	downPayment: string;
	extraPayments: ExtraPayment[];
	calculated: boolean;
}

const initialState: CalculatorState = {
	type: 'imobiliario',
	system: 'price',
	principal: '',
	annualRate: '',
	termMonths: '',
	downPayment: '',
	extraPayments: [],
	calculated: false
};

function createCalculatorStore() {
	const { subscribe, set, update } = writable<CalculatorState>(initialState);

	return {
		subscribe,
		set,
		update,
		reset: () => set(initialState),
		calculate: () => {
			let result = null as ReturnType<typeof calculate> | null;
			update((state) => {
				const principal = parseFloat(state.principal) || 0;
				const annualRate = parseFloat(state.annualRate) || 0;
				const termMonths = parseInt(state.termMonths) || 0;
				const downPayment = parseFloat(state.downPayment) || 0;

				if (principal > 0 && annualRate > 0 && termMonths > 0) {
					result = calculate({
						type: state.type,
						system: state.system,
						principal,
						annualRate,
						termMonths,
						downPayment: downPayment > 0 ? downPayment : undefined,
						extraPayments: state.extraPayments
					});
				}
				return { ...state, calculated: true };
			});
			return result;
		}
	};
}

export const calculatorStore = createCalculatorStore();

export const resultStore = writable<ReturnType<typeof calculate> | null>(null);

export const isMobile = writable(false);

if (typeof window !== 'undefined') {
	const check = () => window.innerWidth < 768;
	isMobile.set(check());
	window.addEventListener('resize', () => isMobile.set(check()));
}