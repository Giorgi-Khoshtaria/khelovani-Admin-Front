import type { StatisticsResult } from "@/types/statistics.types";
import StatCardsGrid from "./StatCardsGrid";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";
import StatusBreakdown from "./StatusBreakdown";
import TopProducts from "./TopProducts";
import "./StatisticsContent.scss";

interface Props {
  data: StatisticsResult;
}

/**
 * The full statistics dashboard body (cards + charts + lists), shared by the
 * admin and partner pages. Filter controls live in the page above this.
 */
export default function StatisticsContent({ data }: Props) {
  return (
    <div className="stats-content">
      <StatCardsGrid summary={data.summary} />

      <RevenueChart data={data.timeSeries} />

      <div className="stats-content__row">
        <OrdersChart data={data.timeSeries} />
        <StatusBreakdown data={data.statusBreakdown} />
      </div>

      <TopProducts products={data.topProducts} />
    </div>
  );
}
