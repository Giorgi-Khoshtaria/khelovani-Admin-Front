/** Bucket size for the revenue time-series. */
export const StatGranularity = {
  Week: "week",
  Month: "month",
  Year: "year",
} as const;

export type StatGranularity =
  (typeof StatGranularity)[keyof typeof StatGranularity];

export const STAT_GRANULARITIES = Object.values(StatGranularity);

export const STAT_GRANULARITY_LABELS: Record<StatGranularity, string> = {
  [StatGranularity.Week]: "კვირა",
  [StatGranularity.Month]: "თვე",
  [StatGranularity.Year]: "წელი",
};

export type StatOrderStatus = "paid" | "delivered" | "cancelled";

export interface StatSummary {
  totalRevenue: number;
  totalOrders: number;
  unitsSold: number;
  avgOrderValue: number;
  paidOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  uniqueCustomers: number;
}

export interface StatTimeBucket {
  period: string;
  revenue: number;
  orders: number;
  units: number;
}

export interface StatTopProduct {
  productId: string;
  titleGe: string;
  titleEn?: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

export interface StatStatusBreakdownEntry {
  status: StatOrderStatus;
  count: number;
  revenue: number;
}

export interface StatisticsResult {
  summary: StatSummary;
  timeSeries: StatTimeBucket[];
  topProducts: StatTopProduct[];
  statusBreakdown: StatStatusBreakdownEntry[];
  granularity: StatGranularity;
}

export interface StatisticsParams {
  granularity?: StatGranularity;
  dateFrom?: string;
  dateTo?: string;
  topLimit?: number;
  /** Admin only — scope to a single partner. */
  partner?: string;
}
