import { writable } from 'svelte/store';
import type { ExtraPayment } from '$lib/calculator/types';
import { calculate } from '$lib/calculator';
import type { FinancingResult } from '$lib/calculator/types';

interface CalculatorState {
	principal: string;
	annualRate: string;
	termMonths: string;
	downPayment: string;
	extraPayments: ExtraPayment[];
	calculated: boolean;
}

interface AllResults {
	price: FinancingResult | null;
	sac: FinancingResult | null;
	sam: FinancingResult | null;
	americano: FinancingResult | null;
}

const initialState: CalculatorState = {
	principal: '500000',
	annualRate: '10',
	termMonths: '360',
	downPayment: '0',
	extraPayments: [],
	calculated: false
};

function createCalculatorStore() {
	const { subscribe, set, update } = writable<CalculatorState>(initialState);

	return {
		subscribe,
		set,
		update,
		reset: () => set(initialState)
	};
}

export const calculatorStore = createCalculatorStore();

export const allResultsStore = writable<AllResults>({
	price: null,
	sac: null,
	sam: null,
	americano: null
});

export function calculateAll() {
	const state = getStoreValue();
	const principal = parseFloat(state.principal) || 0;
	const annualRate = parseFloat(state.annualRate) || 0;
	const termMonths = parseInt(state.termMonths) || 0;
	const downPayment = parseFloat(state.downPayment) || 0;

	if (principal <= 0 || annualRate <= 0 || termMonths <= 0) return;

	const input = {
		type: 'imobiliario' as const,
		principal,
		annualRate,
		termMonths,
		downPayment: downPayment > 0 ? downPayment : undefined,
		extraPayments: state.extraPayments
	};

	allResultsStore.set({
		price: calculate({ ...input, system: 'price' }),
		sac: calculate({ ...input, system: 'sac' }),
		sam: calculate({ ...input, system: 'sam' }),
		americano: calculate({ ...input, system: 'americano' })
	});
}

let currentStoreValue: CalculatorState = initialState;

function getStoreValue() {
	return currentStoreValue;
}

calculatorStore.subscribe((v) => {
	currentStoreValue = v;
});

export const isMobile = writable(false);

if (typeof window !== 'undefined') {
	const check = () => window.innerWidth < 768;
	isMobile.set(check());
	window.addEventListener('resize', () => isMobile.set(check()));
}