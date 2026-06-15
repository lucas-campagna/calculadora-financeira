import { writable, derived } from 'svelte/store';
import { calculate } from '$lib/calculator';
import type { AmortizationSystem, ExtraPayment, FinancingResult, Study } from '$lib/calculator/types';

interface StudiesState {
	studies: Study[];
	activeStudyId: string;
	syncLocked: boolean;
}

interface AllResults {
	[studyId: string]: FinancingResult | null;
}

const DEFAULT_VALUES = {
	principal: '500000',
	annualRate: '10',
	termMonths: '360',
	downPayment: '0'
};

function createDefaultStudies(): Study[] {
	return [
		{ id: '1', name: 'PRICE', system: 'price', ...DEFAULT_VALUES, extraPayments: [] },
		{ id: '2', name: 'SAC', system: 'sac', ...DEFAULT_VALUES, extraPayments: [] },
		{ id: '3', name: 'SAM', system: 'sam', ...DEFAULT_VALUES, extraPayments: [] },
		{ id: '4', name: 'Americano', system: 'americano', ...DEFAULT_VALUES, extraPayments: [] }
	];
}

const STORAGE_KEY = 'calcfin_studies';

function loadState(): StudiesState {
	if (typeof window === 'undefined') {
		return { studies: createDefaultStudies(), activeStudyId: '1', syncLocked: true };
	}
	try {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved);
			if (parsed.studies && parsed.studies.length > 0 && parsed.activeStudyId) {
				return {
					studies: parsed.studies,
					activeStudyId: parsed.activeStudyId,
					syncLocked: parsed.syncLocked !== undefined ? parsed.syncLocked : true
				};
			}
		}
	} catch { /* ignore */ }
	return { studies: createDefaultStudies(), activeStudyId: '1', syncLocked: true };
}

const initialState = loadState();

function createStudiesStore() {
	const { subscribe, set, update } = writable<StudiesState>(initialState);

	let saveTimer: ReturnType<typeof setTimeout> | null = null;
	const SAVE_DELAY = 500;

	function save(state: StudiesState) {
		if (typeof window === 'undefined') return;
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(() => {
			try {
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
			} catch { /* ignore */ }
		}, SAVE_DELAY);
	}

	subscribe((state) => {
		save(state);
	});

	return {
		subscribe,
		set,
		update,
		addStudy(study: Study) {
			update((s) => ({
				...s,
				studies: [...s.studies, study],
				activeStudyId: study.id
			}));
			calculateAll();
		},
		updateStudy(id: string, patch: Partial<Omit<Study, 'id'>>) {
			update((s) => ({
				...s,
				studies: s.studies.map((st) => (st.id === id ? { ...st, ...patch } : st))
			}));
			calculateAll();
		},
		setActive(id: string) {
			update((s) => ({ ...s, activeStudyId: id }));
		},
		toggleLock() {
			update((s) => ({ ...s, syncLocked: !s.syncLocked }));
		},
		updateField(field: keyof Pick<Study, 'principal' | 'annualRate' | 'termMonths' | 'downPayment'>, value: string) {
			update((s) => {
				const active = s.studies.find((st) => st.id === s.activeStudyId);
				if (!active) return s;

				const updatedStudies = s.studies.map((st) => {
					if (s.syncLocked) {
						return { ...st, [field]: value };
					}
					return st.id === s.activeStudyId ? { ...st, [field]: value } : st;
				});

				return { ...s, studies: updatedStudies };
			});
			calculateAll();
		},
		addExtraPayment(studyId: string, payment: ExtraPayment) {
			update((s) => {
				const study = s.studies.find((st) => st.id === studyId);
				if (!study) return s;
				const existing = study.extraPayments.find((ep) => ep.month === payment.month);
				let newPayments: ExtraPayment[];
				if (existing) {
					newPayments = study.extraPayments.map((ep) =>
						ep.month === payment.month ? { ...ep, amount: ep.amount + payment.amount, type: payment.type } : ep
					);
				} else {
					newPayments = [...study.extraPayments, payment];
				}
				return {
					...s,
					studies: s.studies.map((st) =>
						st.id === studyId ? { ...st, extraPayments: newPayments } : st
					)
				};
			});
			calculateAll();
		},
		reset() {
			const defaults = createDefaultStudies();
			set({ studies: defaults, activeStudyId: '1', syncLocked: true });
			calculateAll();
		}
	};
}

export const studiesStore = createStudiesStore();

export const activeStudy = derived(studiesStore, ($s) =>
	$s.studies.find((st) => st.id === $s.activeStudyId) ?? $s.studies[0]
);

export const allResultsStore = writable<AllResults>({});

let calculateVersion = 0;
let throttleTimer: ReturnType<typeof setTimeout> | null = null;
const THROTTLE_MS = 300;

let currentState: StudiesState = initialState;

studiesStore.subscribe((v) => {
	currentState = v;
});

export function calculateAll() {
	const version = ++calculateVersion;

	if (throttleTimer) {
		clearTimeout(throttleTimer);
	}

	throttleTimer = setTimeout(() => {
		throttleTimer = null;
		if (version !== calculateVersion) return;

		const results: AllResults = {};
		for (const study of currentState.studies) {
			const principal = parseFloat(study.principal) || 0;
			const annualRate = parseFloat(study.annualRate) || 0;
			const termMonths = parseInt(study.termMonths) || 0;
			const downPayment = parseFloat(study.downPayment) || 0;

			if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
				results[study.id] = null;
				continue;
			}

			const input = {
				principal,
				annualRate,
				termMonths,
				downPayment: downPayment > 0 ? downPayment : undefined,
				extraPayments: study.extraPayments,
				system: study.system
			};

			const result = calculate(input);
			results[study.id] = { ...result, studyId: study.id, studyName: study.name };

			if (version !== calculateVersion) return;
		}

		allResultsStore.set(results);
	}, THROTTLE_MS);
}

export const isMobile = writable(false);

if (typeof window !== 'undefined') {
	const check = () => window.innerWidth < 768;
	isMobile.set(check());
	window.addEventListener('resize', () => isMobile.set(check()));
}

export { type Study, type AllResults };