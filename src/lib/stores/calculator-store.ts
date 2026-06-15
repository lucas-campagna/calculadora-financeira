import { writable, derived } from 'svelte/store';
import { calculate } from '$lib/calculator';
import type { AmortizationSystem, ExtraPayment, FinancingResult, Study } from '$lib/calculator/types';

type FieldKey = 'principal' | 'annualRate' | 'termMonths' | 'downPayment';

interface StudiesState {
	studies: Study[];
	activeStudyId: string;
	commonValues: Record<FieldKey, string>;
	overrides: Record<string, Record<FieldKey, string>>;
	snapshot: { studies: Study[]; commonValues: Record<FieldKey, string> };
}

interface AllResults {
	[studyId: string]: FinancingResult | null;
}

const DEFAULT_VALUES: Record<FieldKey, string> = {
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
	const defaults = createDefaultStudies();
	if (typeof window === 'undefined') {
		return {
			studies: defaults,
			activeStudyId: '1',
			commonValues: { ...DEFAULT_VALUES },
			overrides: {},
			snapshot: { studies: JSON.parse(JSON.stringify(defaults)), commonValues: { ...DEFAULT_VALUES } }
		};
	}
	try {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved);
			if (parsed.studies && parsed.studies.length > 0 && parsed.activeStudyId) {
				const loadedStudies: Study[] = parsed.studies;
				const commonValues: Record<FieldKey, string> = {
					principal: parsed.commonValues?.principal ?? DEFAULT_VALUES.principal,
					annualRate: parsed.commonValues?.annualRate ?? DEFAULT_VALUES.annualRate,
					termMonths: parsed.commonValues?.termMonths ?? DEFAULT_VALUES.termMonths,
					downPayment: parsed.commonValues?.downPayment ?? DEFAULT_VALUES.downPayment
				};
				return {
					studies: loadedStudies,
					activeStudyId: parsed.activeStudyId,
					commonValues,
					overrides: parsed.overrides ?? {},
					snapshot: {
						studies: JSON.parse(JSON.stringify(loadedStudies)),
						commonValues: { ...commonValues }
					}
				};
			}
		}
	} catch { /* ignore */ }
	return {
		studies: defaults,
		activeStudyId: '1',
		commonValues: { ...DEFAULT_VALUES },
		overrides: {},
		snapshot: { studies: JSON.parse(JSON.stringify(defaults)), commonValues: { ...DEFAULT_VALUES } }
	};
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
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
					studies: state.studies,
					activeStudyId: state.activeStudyId,
					commonValues: state.commonValues,
					overrides: state.overrides
				}));
			} catch { /* ignore */ }
		}, SAVE_DELAY);
	}

	subscribe((state) => {
		save(state);
	});

	function getEffectiveValue(state: StudiesState, studyId: string, field: FieldKey): string {
		const override = state.overrides[studyId]?.[field];
		return override ?? state.commonValues[field];
	}

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
		getEffectiveValue(studyId: string, field: FieldKey): string {
			let result = DEFAULT_VALUES[field];
			const unsubscribe = subscribe((s) => {
				result = getEffectiveValue(s, studyId, field);
			});
			unsubscribe();
			return result;
		},
		isFieldLocked(field: FieldKey): boolean {
			let result = true;
			const unsubscribe = subscribe((s) => {
				result = s.overrides[s.activeStudyId]?.[field] === undefined;
			});
			unsubscribe();
			return result;
		},
		toggleFieldLock(field: FieldKey) {
			update((s) => {
				const studyId = s.activeStudyId;
				const currentEffective = getEffectiveValue(s, studyId, field);
				const hasOverride = s.overrides[studyId]?.[field] !== undefined;

				if (hasOverride) {
					const newOverrides = { ...s.overrides };
					delete newOverrides[studyId]?.[field];
					if (Object.keys(newOverrides[studyId] ?? {}).length === 0) {
						delete newOverrides[studyId];
					}
					return {
						...s,
						commonValues: { ...s.commonValues, [field]: currentEffective },
						overrides: newOverrides
					};
				} else {
					return {
						...s,
						overrides: {
							...s.overrides,
							[studyId]: {
								...(s.overrides[studyId] ?? {}),
								[field]: currentEffective
							}
						}
					};
				}
			});
			calculateAll();
		},
		revertField(field: FieldKey) {
			update((s) => {
				const studyId = s.activeStudyId;
				const newOverrides = { ...s.overrides };
				delete newOverrides[studyId]?.[field];
				if (Object.keys(newOverrides[studyId] ?? {}).length === 0) {
					delete newOverrides[studyId];
				}
				return { ...s, overrides: newOverrides };
			});
			calculateAll();
		},
		revertFieldToCommon(field: FieldKey) {
			update((s) => {
				const studyId = s.activeStudyId;
				const common = s.commonValues[field];
				return {
					...s,
					overrides: {
						...s.overrides,
						[studyId]: { ...(s.overrides[studyId] ?? {}), [field]: common }
					}
				};
			});
			calculateAll();
		},
		commitFieldToCommon(field: FieldKey) {
			update((s) => {
				const studyId = s.activeStudyId;
				const currentEffective = getEffectiveValue(s, studyId, field);
				const newOverrides = { ...s.overrides };
				delete newOverrides[studyId]?.[field];
				if (Object.keys(newOverrides[studyId] ?? {}).length === 0) {
					delete newOverrides[studyId];
				}
				return {
					...s,
					commonValues: { ...s.commonValues, [field]: currentEffective },
					overrides: newOverrides
				};
			});
			calculateAll();
		},
		updateField(field: FieldKey, value: string) {
			update((s) => {
				const studyId = s.activeStudyId;
				const hasOverride = s.overrides[studyId]?.[field] !== undefined;

				if (hasOverride) {
					return {
						...s,
						overrides: {
							...s.overrides,
							[studyId]: { ...s.overrides[studyId], [field]: value }
						}
					};
				} else {
					return {
						...s,
						commonValues: { ...s.commonValues, [field]: value }
					};
				}
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
		restore() {
			const defaults = createDefaultStudies();
			set({
				studies: defaults,
				activeStudyId: '1',
				commonValues: { ...DEFAULT_VALUES },
				overrides: {},
				snapshot: { studies: JSON.parse(JSON.stringify(defaults)), commonValues: { ...DEFAULT_VALUES } }
			});
			calculateAll();
		},
		reset() {
			const defaults = createDefaultStudies();
			set({
				studies: defaults,
				activeStudyId: '1',
				commonValues: { ...DEFAULT_VALUES },
				overrides: {},
				snapshot: { studies: JSON.parse(JSON.stringify(defaults)), commonValues: { ...DEFAULT_VALUES } }
			});
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

		function getEffectiveValue(studyId: string, field: FieldKey): string {
			const override = currentState.overrides[studyId]?.[field];
			return override ?? currentState.commonValues[field];
		}

		const results: AllResults = {};
		for (const study of currentState.studies) {
			const principal = parseFloat(getEffectiveValue(study.id, 'principal')) || 0;
			const annualRate = parseFloat(getEffectiveValue(study.id, 'annualRate')) || 0;
			const termMonths = parseInt(getEffectiveValue(study.id, 'termMonths')) || 0;
			const downPayment = parseFloat(getEffectiveValue(study.id, 'downPayment')) || 0;

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

export type { FieldKey };
export { type Study, type AllResults };