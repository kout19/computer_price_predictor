/**
 * Shared, pure utility functions used across the UI layer.
 *
 * `cn()` is required by shadcn/ui components for safe Tailwind class
 * merging. Formatting helpers below centralize currency/date display
 * logic so it isn't re-implemented in every component that shows a
 * prediction result.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 *
 * @param inputs - Any number of class values (strings, conditionals, arrays).
 * @returns A single, de-duplicated class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric price using the given ISO currency code.
 *
 * @param value - The numeric price value.
 * @param currency - ISO 4217 currency code (e.g. "INR", "USD").
 * @returns A locale-formatted currency string.
 */
export function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Fallback if `currency` is not a recognized ISO code.
    return `${currency} ${value.toFixed(2)}`;
  }
}

/**
 * Format an ISO 8601 timestamp into a readable local date/time string.
 *
 * @param isoTimestamp - ISO 8601 timestamp string (e.g. from the API).
 * @returns A human-readable, locale-formatted date/time.
 */
export function formatTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}
