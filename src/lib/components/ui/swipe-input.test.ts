import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import SwipeInput from "./swipe-input.svelte";

describe("SwipeInput Component", () => {
  describe("Basic Rendering", () => {
    it("renders with placeholder", () => {
      render(SwipeInput, { props: { placeholder: "Enter value" } });
      expect(screen.getByPlaceholderText("Enter value")).toBeTruthy();
    });

    it("renders with id", () => {
      render(SwipeInput, { props: { id: "test-input" } });
      expect(document.getElementById("test-input")).toBeTruthy();
    });
  });

  describe("Numeric Input Mode", () => {
    it("displays value with 2 decimal places", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { inputmode: "numeric", value: "1234", onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "1234" } });
      expect(input.value).toContain("12,34");
    });
  });

  describe("Month Input Mode", () => {
    it("shows month breakdown for 369 months", () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { inputmode: "month", value: "369", onchange },
      });
      const breakdown = screen.getByText(/30 anos/i);
      expect(breakdown).toBeTruthy();
      expect(screen.getByText(/9 meses/i)).toBeTruthy();
    });

    it("does not show breakdown when less than 12 months", () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { inputmode: "month", value: "6", onchange },
      });
      const breakdown = screen.queryByText(/meses/i);
      expect(breakdown).toBeNull();
    });

    it("shows only years when exact multiple of 12", () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { inputmode: "month", value: "24", onchange },
      });
      expect(screen.getByText(/2 anos/i)).toBeTruthy();
    });
  });

  describe("Tax Input Mode", () => {
    it("shows tax breakdown with monthly rate", () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { inputmode: "tax", value: "12", onchange },
      });
      const breakdown = screen.getByText(/% a.m./i);
      expect(breakdown).toBeTruthy();
    });
  });

  describe("onchange callback", () => {
    it("calls onchange with correct value on input", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { inputmode: "month", value: "", onchange },
      });
      const input = screen.getByRole("textbox");
      await fireEvent.input(input, { target: { value: "123" } });
      expect(onchange).toHaveBeenCalledWith(123);
    });
  });

  describe("Lock button", () => {
    it("shows lock button when showLock is true", () => {
      render(SwipeInput, { props: { showLock: true, locked: false } });
      expect(screen.getByLabelText(/Bloquear campo/i)).toBeTruthy();
    });

    it("shows unlock button when locked", () => {
      render(SwipeInput, { props: { showLock: true, locked: true } });
      expect(screen.getByLabelText(/Desbloquear campo/i)).toBeTruthy();
    });

    it("calls onlocktoggle when lock button clicked", async () => {
      const onlocktoggle = vi.fn();
      render(SwipeInput, {
        props: { showLock: true, locked: false, onlocktoggle },
      });
      const button = screen.getByLabelText(/Bloquear campo/i);
      await fireEvent.click(button);
      expect(onlocktoggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Revert button", () => {
    it("shows revert button when showRevert is true and not locked", () => {
      render(SwipeInput, {
        props: { showRevert: true, locked: false },
      });
      expect(screen.getByLabelText(/reverter/i)).toBeTruthy();
    });

    it("calls onrevert when revert button clicked", async () => {
      const onrevert = vi.fn();
      render(SwipeInput, {
        props: { showRevert: true, locked: false, onrevert },
      });
      const button = screen.getByLabelText(/reverter/i);
      await fireEvent.click(button);
      expect(onrevert).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input constraints", () => {
    it("applies min value on blur", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { min: "10", value: "", onchange },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "5" } });
      await fireEvent.blur(input);
      expect(onchange).toHaveBeenCalledWith(10);
    });
  });

  describe("Value formatting", () => {
    it("formats integer values with thousand separators", async () => {
      const onchange = vi.fn();
      render(SwipeInput, {
        props: { inputmode: "numeric", value: "" },
      });
      const input = screen.getByRole("textbox") as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "1000" } });
      expect(input.value).toBe("10,00");
    });
  });
});
