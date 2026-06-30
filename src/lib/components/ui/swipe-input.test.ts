import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import SwipeInput from "./swipe-input.svelte";

describe("SwipeInput Component", () => {
  describe("Basic Rendering", () => {
    it("renders with placeholder", () => {
      render(SwipeInput, { props: { placeholder: "Enter value", value: 0 } });
      expect(screen.getByPlaceholderText("Enter value")).toBeTruthy();
    });

    it("renders with id", () => {
      render(SwipeInput, { props: { id: "test-input", value: 0 } });
      expect(document.getElementById("test-input")).toBeTruthy();
    });

    it("selects all text on focus", () => {
      render(SwipeInput, {
        props: { decimals: 2, value: 12.34 },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.focus(input);
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(input.value.length);
    });

    it("selects all text on double tap", () => {
      vi.useFakeTimers();
      render(SwipeInput, {
        props: { decimals: 2, value: 12.34 },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.touchEnd(input, {
        touches: [],
        targetTouches: [],
        changedTouches: [
          { identifier: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0 },
        ],
      });
      vi.advanceTimersByTime(100);
      fireEvent.touchEnd(input, {
        touches: [],
        targetTouches: [],
        changedTouches: [
          { identifier: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0 },
        ],
      });
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(input.value.length);
      vi.useRealTimers();
    });

    it("selects all text on hold", () => {
      vi.useFakeTimers();
      render(SwipeInput, {
        props: { decimals: 2, value: 12.34 },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.touchStart(input, {
        touches: [
          { identifier: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0 },
        ],
        targetTouches: [],
        changedTouches: [],
      });
      vi.advanceTimersByTime(500);
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(input.value.length);
      fireEvent.touchEnd(input);
      vi.useRealTimers();
    });
  });

  describe("Numeric Input Mode (decimals=2)", () => {
    it("displays value with 2 decimal places", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { decimals: 2, value: 12.34, onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "12,34" } });
      expect(input.value).toContain("12,34");
    });
  });

  describe("Label prop", () => {
    it("shows label when provided", () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { decimals: 0, value: 369, label: "meses", onchange },
      });
      const label = screen.getByText("meses");
      expect(label).toBeTruthy();
    });
  });

  describe("onchange callback", () => {
    it("calls onchange with correct value on input", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { decimals: 0, value: 0, onchange },
      });
      const input = screen.getByRole("textbox");
      await fireEvent.input(input, { target: { value: "123" } });
      expect(onchange).toHaveBeenCalledWith(123);
    });
  });

  describe("Input constraints", () => {
    it("applies min value on blur", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { min: 10, value: 0, onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "5" } });
      await fireEvent.blur(input);
      expect(onchange).toHaveBeenCalledWith(10);
    });

    it("applies max value on blur", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { max: 100, value: 0, onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "50000" } });
      await fireEvent.blur(input);
      expect(onchange).toHaveBeenCalledWith(100);
    });

    it("does not apply max value when under limit", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { decimals: 2, max: 100, value: 0, onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "500" } });
      await fireEvent.blur(input);
      expect(onchange).toHaveBeenCalledWith(5);
    });
  });

  describe("Value formatting", () => {
    it("formats integer values with thousand separators", () => {
      let capturedValue: number | null = null;
      const onchange = (v: number) => {
        capturedValue = v;
      };
      render(SwipeInput, {
        props: { decimals: 2, value: 10, onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.input(input);
      expect(input.value).toBe("10,00");
      expect(capturedValue).toBe(10);
    });

    it("formats values with 2 decimal places", () => {
      let capturedValue: number | null = null;
      const onchange = (v: number) => {
        capturedValue = v;
      };
      render(SwipeInput, {
        props: { decimals: 5, value: 12.567, onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.input(input);
      expect(input.value).toBe("12,56700");
      expect(capturedValue).toBe(12.567);
    });
  });
});
