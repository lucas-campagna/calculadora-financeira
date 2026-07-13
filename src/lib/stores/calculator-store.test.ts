import { describe, it, expect, beforeEach } from "vitest";
import { studiesStore } from "./calculator-store";
import type { Study } from "$lib/calculator/types";
import { get } from "svelte/store";

describe("calculator-store", () => {
  beforeEach(() => {
    studiesStore.set({
      studies: [
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
      ],
      activeStudyId: "1",
      commonValues: {
        principal: 500000,
        annualRate: 10,
        termMonths: 360,
        downPayment: 0,
      },
      overrides: {},
      snapshot: {
        studies: [
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
        ],
        commonValues: {
          principal: 500000,
          annualRate: 10,
          termMonths: 360,
          downPayment: 0,
        },
      },
    });
  });

  describe("studiesStore basic operations", () => {
    it("has default values", () => {
      const state = get(studiesStore);
      expect(state.commonValues.principal).toBe(500000);
      expect(state.commonValues.annualRate).toBe(10);
      expect(state.commonValues.termMonths).toBe(360);
      expect(state.commonValues.downPayment).toBe(0);
    });

    it("has two default studies", () => {
      const state = get(studiesStore);
      expect(state.studies).toHaveLength(2);
      expect(state.studies[0].system).toBe("sac");
      expect(state.studies[1].system).toBe("price");
    });

    it("has first study as active by default", () => {
      const state = get(studiesStore);
      expect(state.activeStudyId).toBe("1");
    });
  });

  describe("setActive", () => {
    it("changes active study", () => {
      studiesStore.setActive("2");
      const state = get(studiesStore);
      expect(state.activeStudyId).toBe("2");
    });
  });

  describe("addStudy", () => {
    it("adds a new study", () => {
      const newStudy: Study = {
        id: "3",
        name: "Novo",
        system: "sam",
        extraPayments: [],
      };
      studiesStore.addStudy(newStudy);
      const state = get(studiesStore);
      expect(state.studies).toHaveLength(3);
      expect(state.activeStudyId).toBe("3");
    });

    it("sets new study as active", () => {
      const newStudy: Study = {
        id: "3",
        name: "Novo",
        system: "sam",
        extraPayments: [],
      };
      studiesStore.addStudy(newStudy);
      const state = get(studiesStore);
      expect(state.activeStudyId).toBe("3");
    });
  });

  describe("updateStudy", () => {
    it("updates existing study", () => {
      studiesStore.updateStudy("1", { name: "SAC Updated" });
      const state = get(studiesStore);
      expect(state.studies.find((s) => s.id === "1")?.name).toBe("SAC Updated");
    });
  });

  describe("toggleFieldLock", () => {
    it("creates override when field is locked", () => {
      studiesStore.toggleFieldLock("principal");
      const state = get(studiesStore);
      expect(state.overrides["1"]?.principal).toBe(500000);
    });

    it("removes override and updates common when field is unlocked", () => {
      studiesStore.toggleFieldLock("principal");
      studiesStore.toggleFieldLock("principal");
      const state = get(studiesStore);
      expect(state.overrides["1"]).toBeUndefined();
      expect(state.commonValues.principal).toBe(500000);
    });
  });

  describe("revertField", () => {
    it("removes override for field", () => {
      studiesStore.updateField("principal", 600000);
      studiesStore.revertField("principal");
      const state = get(studiesStore);
      expect(state.overrides["1"]?.principal).toBeUndefined();
    });
  });

  describe("revertFieldToCommon", () => {
    it("sets override to common value", () => {
      studiesStore.updateField("principal", 600000);
      studiesStore.revertFieldToCommon("principal");
      const state = get(studiesStore);
      expect(state.overrides["1"]?.principal).toBe(600000);
    });
  });

  describe("commitFieldToCommon", () => {
    it("updates common values with current effective value", () => {
      studiesStore.updateField("principal", 600000);
      studiesStore.commitFieldToCommon("principal");
      const state = get(studiesStore);
      expect(state.commonValues.principal).toBe(600000);
    });

    it("removes override after commit", () => {
      studiesStore.updateField("principal", 600000);
      studiesStore.commitFieldToCommon("principal");
      const state = get(studiesStore);
      expect(state.overrides["1"]?.principal).toBeUndefined();
    });
  });

  describe("updateField", () => {
    it("updates common value when field is unlocked", () => {
      studiesStore.updateField("principal", 700000);
      const state = get(studiesStore);
      expect(state.commonValues.principal).toBe(700000);
    });

    it("updates override when field is locked", () => {
      studiesStore.toggleFieldLock("principal");
      studiesStore.updateField("principal", 700000);
      const state = get(studiesStore);
      expect(state.overrides["1"]?.principal).toBe(700000);
    });

    it("overwrites previous override value", () => {
      studiesStore.toggleFieldLock("principal");
      studiesStore.updateField("principal", 600000);
      studiesStore.updateField("principal", 700000);
      const state = get(studiesStore);
      expect(state.overrides["1"]?.principal).toBe(700000);
    });
  });

  describe("updateStudyColor", () => {
    it("updates study color", () => {
      studiesStore.updateStudyColor("1", "#ff0000");
      const state = get(studiesStore);
      expect(state.studies.find((s) => s.id === "1")?.color).toBe("#ff0000");
    });

    it("does not affect other studies", () => {
      studiesStore.updateStudyColor("1", "#ff0000");
      const state = get(studiesStore);
      expect(state.studies.find((s) => s.id === "2")?.color).toBeUndefined();
    });
  });

  describe("cloneStudy", () => {
    it("clones a study with new id", () => {
      const newId = studiesStore.cloneStudy("1");
      const state = get(studiesStore);
      expect(state.studies).toHaveLength(3);
      expect(newId).toBeTruthy();
      const cloned = state.studies.find((s) => s.id === newId);
      expect(cloned?.name).toBe("SAC 2");
      expect(cloned?.system).toBe("sac");
    });

    it("sets cloned study as active", () => {
      const newId = studiesStore.cloneStudy("1");
      const state = get(studiesStore);
      expect(state.activeStudyId).toBe(newId);
    });

    it("appends number to name if name ends with number", () => {
      studiesStore.updateStudy("1", { name: "Test 1" });
      const newId = studiesStore.cloneStudy("1");
      const state = get(studiesStore);
      const cloned = state.studies.find((s) => s.id === newId);
      expect(cloned?.name).toBe("Test 2");
    });

    it("copies extra payments to cloned study", () => {
      studiesStore.addExtraPayment("1", {
        month: 12,
        amount: 5000,
        type: "reduce_term",
      });
      const newId = studiesStore.cloneStudy("1");
      const state = get(studiesStore);
      const cloned = state.studies.find((s) => s.id === newId);
      expect(cloned?.extraPayments).toHaveLength(1);
      expect(cloned?.extraPayments[0].month).toBe(12);
    });

    it("copies overrides to cloned study", () => {
      studiesStore.toggleFieldLock("principal");
      studiesStore.updateField("principal", 600000);
      const newId = studiesStore.cloneStudy("1");
      const state = get(studiesStore);
      expect(state.overrides[newId!]?.principal).toBe(600000);
    });
  });
});
