import LZString from "lz-string";
import type { StudiesState } from "./calculator-store";
import type {
  AmortizationSystem,
  ExtraPayment,
  Study,
} from "$lib/calculator/types";

type FieldKey = "principal" | "annualRate" | "termMonths" | "downPayment";

const SYSTEM_CHARS: Record<AmortizationSystem, string> = {
  price: "p",
  sac: "s",
  sam: "m",
  americano: "a",
};

const CHAR_SYSTEM: Record<string, AmortizationSystem> = {
  p: "price",
  s: "sac",
  m: "sam",
  a: "americano",
};

const TYPE_CHARS: Record<ExtraPayment["type"], string> = {
  reduce_term: "t",
  reduce_installment: "i",
};

const CHAR_TYPE: Record<string, ExtraPayment["type"]> = {
  t: "reduce_term",
  i: "reduce_installment",
};

const DEFAULT_VALUES: Record<FieldKey, number> = {
  principal: 500000,
  annualRate: 10,
  termMonths: 360,
  downPayment: 0,
};

interface CompactState {
  s: unknown[];
  a: string;
  c?: Record<string, number>;
  o?: [string, Record<string, number>][];
}

function buildSnapshot(
  studies: Study[],
  commonValues: Record<FieldKey, number>,
): StudiesState["snapshot"] {
  return {
    studies: JSON.parse(JSON.stringify(studies)),
    commonValues: { ...commonValues },
  };
}

export function encodeStateToUrl(state: StudiesState): string {
  const compactStudies = state.studies.map((study) => {
    const extras = study.extraPayments.map((ep) => [
      ep.month,
      ep.amount,
      TYPE_CHARS[ep.type],
    ]);
    return [
      study.id,
      study.name,
      SYSTEM_CHARS[study.system],
      study.color ?? null,
      study.disabled ? 1 : 0,
      extras,
    ] as [string, string, string, string | null, 0 | 1, number[][]];
  });

  const nonDefaultCommon: Record<string, number> = {};
  for (const [key, defVal] of Object.entries(DEFAULT_VALUES) as [
    FieldKey,
    number,
  ][]) {
    if (state.commonValues[key] !== defVal) {
      nonDefaultCommon[key] = state.commonValues[key];
    }
  }

  let compactOverrides: CompactState["o"] | undefined;
  const overrideEntries = Object.entries(state.overrides);
  if (overrideEntries.length > 0) {
    const filtered = overrideEntries
      .map(([studyId, fields]) => {
        const nonDefault: Record<string, number> = {};
        for (const [key, defVal] of Object.entries(DEFAULT_VALUES) as [
          FieldKey,
          number,
        ][]) {
          const val = fields[key];
          if (val !== undefined && val !== defVal) {
            nonDefault[key] = val;
          }
        }
        return [studyId, nonDefault] as [string, Record<string, number>];
      })
      .filter(([, fields]) => Object.keys(fields).length > 0);

    if (filtered.length > 0) {
      compactOverrides = filtered;
    }
  }

  const compact: CompactState = {
    s: compactStudies,
    a: state.activeStudyId,
    ...(Object.keys(nonDefaultCommon).length > 0 && { c: nonDefaultCommon }),
    ...(compactOverrides && { o: compactOverrides }),
  };

  const encoded = LZString.compressToEncodedURIComponent(
    JSON.stringify(compact),
  );
  const base =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "/";
  return `${base}?s=${encoded}`;
}

export function decodeStateFromUrl(search: string): StudiesState | null {
  try {
    const params = new URLSearchParams(search);
    const encoded = params.get("s");
    if (!encoded) return null;

    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const compact = JSON.parse(json) as CompactState;

    if (!Array.isArray(compact.s) || typeof compact.a !== "string") return null;

    const studies: Study[] = compact.s.map((item) => {
      const arr = item as unknown[];
      const [id, name, sysChar, color, disabled, extras] = arr as [
        string,
        string,
        string,
        string | null,
        0 | 1,
        unknown[],
      ];
      const system = CHAR_SYSTEM[sysChar] ?? "price";
      const extraPayments: ExtraPayment[] = (extras as unknown[]).map((ep) => {
        const [month, amount, typeChar] = ep as [number, number, string];
        return {
          month,
          amount,
          type: CHAR_TYPE[typeChar] ?? "reduce_term",
        };
      });
      return {
        id,
        name,
        system,
        color: color ?? undefined,
        disabled: disabled === 1,
        extraPayments,
      };
    });

    if (studies.length === 0) return null;

    let activeStudyId = compact.a;
    if (!studies.find((s) => s.id === activeStudyId)) {
      activeStudyId = studies[0].id;
    }

    const commonValues: Record<FieldKey, number> = { ...DEFAULT_VALUES };
    if (compact.c) {
      for (const [key, val] of Object.entries(compact.c)) {
        const fk = key as FieldKey;
        commonValues[fk] = Number(val) || DEFAULT_VALUES[fk];
      }
    }

    const overrides: Record<string, Record<FieldKey, number>> = {};
    if (compact.o) {
      for (const [studyId, fields] of compact.o) {
        overrides[studyId] = {
          principal: Number(fields.principal) || 0,
          annualRate: Number(fields.annualRate) || 0,
          termMonths: Number(fields.termMonths) || 0,
          downPayment: Number(fields.downPayment) || 0,
        };
      }
    }

    return {
      studies,
      activeStudyId,
      commonValues,
      overrides,
      snapshot: buildSnapshot(studies, commonValues),
    };
  } catch {
    return null;
  }
}

export async function copyShareLink(state: StudiesState): Promise<boolean> {
  const url = encodeStateToUrl(state);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
