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
	extraPayments: []
};

const STORAGE_KEY = 'calcfin_state';

function loadState(): CalculatorState {
	if (typeof window === 'undefined') return initialState;
	try {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved);
			if (parsed.principal && parsed.annualRate && parsed.termMonths) {
				return {
					principal: parsed.principal ?? initialState.principal,
					annualRate: parsed.annualRate ?? initialState.annualRate,
					termMonths: parsed.termMonths ?? initialState.termMonths,
					downPayment: parsed.downPayment ?? initialState.downPayment,
					extraPayments: Array.isArray(parsed.extraPayments) ? parsed.extraPayments : []
				};
			}
		}
	} catch { /* ignore */ }
	return initialState;
}

function createCalculatorStore() {
	const { subscribe, set, update } = writable<CalculatorState>(loadState());

	return {
		subscribe,
		set,
		update,
		reset: () => set(initialState)
	};
}

export const calculatorStore = createCalculatorStore();

let saveTimer: ReturnType<typeof setTimeout> | null = null;
const SAVE_DELAY = 500;

calculatorStore.subscribe((v) => {
	if (typeof window === 'undefined') return;
	if (saveTimer) clearTimeout(saveTimer);
	saveTimer = setTimeout(() => {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(v));
		} catch { /* ignore */ }
	}, SAVE_DELAY);
});

export const allResultsStore = writable<AllResults>({
	price: null,
	sac: null,
	sam: null,
	americano: null
});

let calculateVersion = 0;
let throttleTimer: ReturnType<typeof setTimeout> | null = null;
const THROTTLE_MS = 300;

let currentStoreValue: CalculatorState = initialState;

calculatorStore.subscribe((v) => {
	currentStoreValue = v;
});

export function calculateAll() {
	const version = ++calculateVersion;

	if (throttleTimer) {
		clearTimeout(throttleTimer);
	}

	throttleTimer = setTimeout(() => {
		throttleTimer = null;
		if (version !== calculateVersion) return;

		const principal = parseFloat(currentStoreValue.principal) || 0;
		const annualRate = parseFloat(currentStoreValue.annualRate) || 0;
		const termMonths = parseInt(currentStoreValue.termMonths) || 0;
		const downPayment = parseFloat(currentStoreValue.downPayment) || 0;

		if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
			allResultsStore.set({ price: null, sac: null, sam: null, americano: null });
			return;
		}

		const input = {
			principal,
			annualRate,
			termMonths,
			downPayment: downPayment > 0 ? downPayment : undefined,
			extraPayments: currentStoreValue.extraPayments
		};

		if (version !== calculateVersion) return;

		allResultsStore.set({
			price: calculate({ ...input, system: 'price' }),
			sac: calculate({ ...input, system: 'sac' }),
			sam: calculate({ ...input, system: 'sam' }),
			americano: calculate({ ...input, system: 'americano' })
		});
	}, THROTTLE_MS);
}

export const isMobile = writable(false);

if (typeof window !== 'undefined') {
	const check = () => window.innerWidth < 768;
	isMobile.set(check());
	window.addEventListener('resize', () => isMobile.set(check()));
}