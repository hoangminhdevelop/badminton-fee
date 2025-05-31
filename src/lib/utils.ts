import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number as VND currency with dots as thousand separators
export function formatCurrency(value: number | string): string {
  const numValue =
    typeof value === "string" ? parseFloat(value.replace(/\./g, "")) : value;
  if (isNaN(numValue)) return "";
  return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Parse formatted currency string to number
export function parseCurrency(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Format input value while typing (allows partial numbers)
export function formatCurrencyInput(value: string): string {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/[^\d]/g, "");

  // If empty, return empty string
  if (!digitsOnly) return "";

  // Format with dots
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
