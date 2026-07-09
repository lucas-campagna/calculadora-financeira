import { writable, derived } from "svelte/store";
import { calculate } from "$lib/calculator";
import type {
  AmortizationSystem,
  ExtraPayment,
  FinancingResult,
  Study,
} from "$lib/calculator/types";

type FieldKey = "principal" | "annualRate" | "termMonths" | "downPayment";

export interface StudiesState {
  studies: Study[];
  activeStudyId: string;
  commonValues: Record<FieldKey, number>;
  overrides: Record<string, Record<FieldKey, number>>;
  snapshot: { studies: Study[]; commonValues: Record<FieldKey, number> };
}

interface AllResults {
  [studyId: string]: FinancingResult | null;
}

const DEFAULT_VALUES: Record<FieldKey, number> = {
  principal: 500000,
  annualRate: 10,
  termMonths: 360,
  downPayment: 0,
};

function createDefaultStudies(): Study[] {
  return [
    {
      id: "1",
      name: "SAC",
      system: "sac",
      extraPayments: [],
    },
    {
      id: "2",
      name: "PRICE",
      system: "price",
      extraPayments: [],
    },
  ];
}

const STORAGE_KEY = "calcfin_studies";

function loadState(): StudiesState {
  const defaults = createDefaultStudies();
  if (typeof window === "undefined") {
    return {
      studies: defaults,
      activeStudyId: "1",
      commonValues: { ...DEFAULT_VALUES },
      overrides: {},
      snapshot: {
        studies: JSON.parse(JSON.stringify(defaults)),
        commonValues: { ...DEFAULT_VALUES },
      },
    };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.studies && parsed.studies.length > 0 && parsed.activeStudyId) {
        const loadedStudies: Study[] = parsed.studies.map((s: Study) => ({
          id: s.id,
          name: s.name,
          system: s.system,
          extraPayments: s.extraPayments || [],
          disabled: s.disabled ?? false,
        }));
        const commonValues: Record<FieldKey, number> = {
          principal:
            Number(parsed.commonValues?.principal) || DEFAULT_VALUES.principal,
          annualRate:
            Number(parsed.commonValues?.annualRate) ||
            DEFAULT_VALUES.annualRate,
          termMonths:
            Number(parsed.commonValues?.termMonths) ||
            DEFAULT_VALUES.termMonths,
          downPayment:
            Number(parsed.commonValues?.downPayment) ||
            DEFAULT_VALUES.downPayment,
        };
        const overrides: Record<string, Record<FieldKey, number>> = {};
        if (parsed.overrides) {
          for (const [studyId, fields] of Object.entries(
            parsed.overrides as Record<string, Record<FieldKey, string>>,
          )) {
            overrides[studyId] = {
              principal: Number(fields.principal) || 0,
              annualRate: Number(fields.annualRate) || 0,
              termMonths: Number(fields.termMonths) || 0,
              downPayment: Number(fields.downPayment) || 0,
            };
          }
        }
        return {
          studies: loadedStudies,
          activeStudyId: parsed.activeStudyId,
          commonValues,
          overrides,
          snapshot: {
            studies: JSON.parse(JSON.stringify(loadedStudies)),
            commonValues: { ...commonValues },
          },
        };
      }
    }
  } catch {
    /* ignore */
  }
  return {
    studies: defaults,
    activeStudyId: "1",
    commonValues: { ...DEFAULT_VALUES },
    overrides: {},
    snapshot: {
      studies: JSON.parse(JSON.stringify(defaults)),
      commonValues: { ...DEFAULT_VALUES },
    },
  };
}

const initialState = loadState();

function createStudiesStore() {
  const { subscribe, set, update } = writable<StudiesState>(initialState);

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const SAVE_DELAY = 500;

  function save(state: StudiesState) {
    if (typeof window === "undefined") return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            studies: state.studies,
            activeStudyId: state.activeStudyId,
            commonValues: state.commonValues,
            overrides: state.overrides,
          }),
        );
      } catch {
        /* ignore */
      }
    }, SAVE_DELAY);
  }

  subscribe((state) => {
    save(state);
  });

  function getEffectiveValue(
    state: StudiesState,
    studyId: string,
    field: FieldKey,
  ): number {
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
        activeStudyId: study.id,
      }));
      calculateAll();
    },
    updateStudy(id: string, patch: Partial<Omit<Study, "id">>) {
      update((s) => ({
        ...s,
        studies: s.studies.map((st) =>
          st.id === id ? { ...st, ...patch } : st,
        ),
      }));
      calculateAll();
    },
    toggleDisabled(id: string) {
      update((s) => ({
        ...s,
        studies: s.studies.map((st) =>
          st.id === id ? { ...st, disabled: !st.disabled } : st,
        ),
      }));
      calculateAll();
    },
    setActive(id: string) {
      update((s) => ({ ...s, activeStudyId: id }));
    },
    getEffectiveValue(studyId: string, field: FieldKey): number {
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
            overrides: newOverrides,
          };
        } else {
          return {
            ...s,
            overrides: {
              ...s.overrides,
              [studyId]: {
                ...(s.overrides[studyId] ?? {}),
                [field]: currentEffective,
              },
            },
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
            [studyId]: { ...(s.overrides[studyId] ?? {}), [field]: common },
          },
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
          overrides: newOverrides,
        };
      });
      calculateAll();
    },
    updateField(field: FieldKey, value: string | number) {
      const numValue = typeof value === "number" ? value : Number(value) || 0;
      update((s) => {
        const studyId = s.activeStudyId;
        const hasOverride = s.overrides[studyId]?.[field] !== undefined;

        if (hasOverride) {
          return {
            ...s,
            overrides: {
              ...s.overrides,
              [studyId]: { ...s.overrides[studyId], [field]: numValue },
            },
          };
        } else {
          return {
            ...s,
            commonValues: { ...s.commonValues, [field]: numValue },
          };
        }
      });
      calculateAll();
    },
    addExtraPayment(studyId: string, payment: ExtraPayment) {
      update((s) => {
        const study = s.studies.find((st) => st.id === studyId);
        if (!study) return s;
        const existing = study.extraPayments.find(
          (ep) => ep.month === payment.month,
        );
        let newPayments: ExtraPayment[];
        if (existing) {
          newPayments = study.extraPayments.map((ep) =>
            ep.month === payment.month
              ? {
                  ...ep,
                  amount: ep.amount + payment.amount,
                  type: payment.type,
                }
              : ep,
          );
        } else {
          newPayments = [...study.extraPayments, payment];
        }
        return {
          ...s,
          studies: s.studies.map((st) =>
            st.id === studyId ? { ...st, extraPayments: newPayments } : st,
          ),
        };
      });
      calculateAll();
    },
    updateExtraPayment(studyId: string, payment: ExtraPayment) {
      update((s) => {
        const study = s.studies.find((st) => st.id === studyId);
        if (!study) return s;
        const newPayments = study.extraPayments.map((ep) =>
          ep.month === payment.month ? payment : ep,
        );
        return {
          ...s,
          studies: s.studies.map((st) =>
            st.id === studyId ? { ...st, extraPayments: newPayments } : st,
          ),
        };
      });
      calculateAll();
    },
    removeExtraPayment(studyId: string, month: number) {
      update((s) => {
        const study = s.studies.find((st) => st.id === studyId);
        if (!study) return s;
        const newPayments = study.extraPayments.filter(
          (ep) => ep.month !== month,
        );
        return {
          ...s,
          studies: s.studies.map((st) =>
            st.id === studyId ? { ...st, extraPayments: newPayments } : st,
          ),
        };
      });
      calculateAll();
    },
    value(field: FieldKey): number {
      let result = DEFAULT_VALUES[field];
      const unsubscribe = subscribe((s) => {
        result = s.overrides[s.activeStudyId]?.[field] ?? s.commonValues[field];
      });
      unsubscribe();
      return result;
    },
    restore() {
      const defaults = createDefaultStudies();
      set({
        studies: defaults,
        activeStudyId: "1",
        commonValues: { ...DEFAULT_VALUES },
        overrides: {},
        snapshot: {
          studies: JSON.parse(JSON.stringify(defaults)),
          commonValues: { ...DEFAULT_VALUES },
        },
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem("hasHeldChart");
      }
      calculateAll();
    },
    reset() {
      const defaults = createDefaultStudies();
      set({
        studies: defaults,
        activeStudyId: "1",
        commonValues: { ...DEFAULT_VALUES },
        overrides: {},
        snapshot: {
          studies: JSON.parse(JSON.stringify(defaults)),
          commonValues: { ...DEFAULT_VALUES },
        },
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem("hasHeldChart");
      }
      calculateAll();
    },
  };
}

export const studiesStore = createStudiesStore();

export const activeStudy = derived(
  studiesStore,
  ($s) => $s.studies.find((st) => st.id === $s.activeStudyId) ?? $s.studies[0],
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

    function getEffectiveValue(studyId: string, field: FieldKey): number {
      const override = currentState.overrides[studyId]?.[field];
      return override ?? currentState.commonValues[field];
    }

    const results: AllResults = {};
    for (const study of currentState.studies) {
      const principal = getEffectiveValue(study.id, "principal");
      const annualRate = getEffectiveValue(study.id, "annualRate");
      const termMonths = getEffectiveValue(study.id, "termMonths");
      const downPayment = getEffectiveValue(study.id, "downPayment");

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
        system: study.system,
      };

      const result = calculate(input);
      results[study.id] = {
        ...result,
        studyId: study.id,
        studyName: study.name,
      };

      if (version !== calculateVersion) return;
    }

    allResultsStore.set(results);
  }, THROTTLE_MS);
}

export const isMobile = writable(true);
export const isDesktop = writable(false);

if (typeof window !== "undefined") {
  const check = () => window.innerWidth < 768;
  isMobile.set(check());
  isDesktop.set(!check());
  window.addEventListener("resize", () => {
    isMobile.set(check());
    isDesktop.set(!check());
  });
}

export type { FieldKey };
export { type Study, type AllResults };
