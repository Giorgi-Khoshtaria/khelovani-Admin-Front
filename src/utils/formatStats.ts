/** Shared formatting helpers for the statistics UI. */

/** Format a number as GEL currency, e.g. 1234.5 → "₾1,234.5". */
export const formatCurrency = (value: number): string =>
  `₾${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

/** Thousands-separated integer, e.g. 1234 → "1,234". */
export const formatNumber = (value: number): string =>
  value.toLocaleString("en-US");

/**
 * Turn a backend period key into a short human label.
 *  - "2026-03"   → "Mar 2026"
 *  - "2026-W12"  → "W12 2026"
 *  - "2026"      → "2026"
 */
export const formatPeriod = (period: string): string => {
  const monthMatch = period.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const [, year, month] = monthMatch;
    const date = new Date(Number(year), Number(month) - 1, 1);
    return `${date.toLocaleString("en-US", { month: "short" })} ${year}`;
  }

  const weekMatch = period.match(/^(\d{4})-W(\d{2})$/);
  if (weekMatch) {
    const [, year, week] = weekMatch;
    return `W${week} ${year}`;
  }

  return period;
};
