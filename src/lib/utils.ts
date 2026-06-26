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
    months: Math.ceil(totalMonths % 12),
  };
}

export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  throttleMs: number = 500,
): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      callback(...args);
    }, throttleMs);
  }) as T;
}
