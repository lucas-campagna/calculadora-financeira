import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitMonths(totalMonths: number): {
  years: number;
  months: number;
} {
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  };
}
