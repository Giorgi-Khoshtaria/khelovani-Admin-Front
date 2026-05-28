import type { KeyboardEvent } from "react";

/**
 * Block characters in a numeric `<input type="number">` that would produce
 * a negative or scientific-notation value: `-`, `+`, `e`, `E`.
 *
 * Drop this into any number input alongside `min={0}` (or `min={1}`):
 *   <input type="number" min={0} onKeyDown={blockNonPositiveKeys} ... />
 */
export const blockNonPositiveKeys = (
  e: KeyboardEvent<HTMLInputElement>,
): void => {
  if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
    e.preventDefault();
  }
};

/**
 * Sanitise a value coming from a numeric input — strips negatives that
 * sneak in via paste, autofill, or programmatic events. Returns the
 * sanitised value (empty string for invalid / negative).
 */
export const sanitizeNumericValue = (raw: string): string => {
  if (raw === "" || raw === "-") return "";
  const num = Number(raw);
  if (Number.isNaN(num) || num < 0) return "";
  return raw;
};
