import type { StatSummary } from "@/types/statistics.types";
import { formatCurrency, formatNumber } from "../../utils/formatStats";
import StatCard from "./StatCard";
import "./StatCardsGrid.scss";

interface Props {
  summary: StatSummary;
}

/** The row of KPI tiles summarising the current scope. */
export default function StatCardsGrid({ summary }: Props) {
  return (
    <div className="stat-cards-grid">
      <StatCard
        label="შემოსავალი"
        value={formatCurrency(summary.totalRevenue)}
        hint={`${formatNumber(summary.totalOrders)} შეკვეთა`}
        icon="₾"
        accent="success"
      />
      <StatCard
        label="შეკვეთები"
        value={formatNumber(summary.totalOrders)}
        hint={`${formatNumber(summary.paidOrders)} გადახდილი · ${formatNumber(
          summary.deliveredOrders,
        )} მიწოდებული`}
        icon="📦"
      />
      <StatCard
        label="გაყიდული ერთეული"
        value={formatNumber(summary.unitsSold)}
        icon="🧾"
      />
      <StatCard
        label="საშ. შეკვეთა"
        value={formatCurrency(summary.avgOrderValue)}
        icon="📈"
      />
      <StatCard
        label="უნიკალური მომხმარებელი"
        value={formatNumber(summary.uniqueCustomers)}
        icon="👤"
      />
      <StatCard
        label="გაუქმებული"
        value={formatNumber(summary.cancelledOrders)}
        icon="✕"
        accent="danger"
      />
    </div>
  );
}
