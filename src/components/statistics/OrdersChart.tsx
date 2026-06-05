import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StatTimeBucket } from "@/types/statistics.types";
import { formatNumber, formatPeriod } from "@/utils/formatStats";
import "./OrdersChart.scss";

interface Props {
  data: StatTimeBucket[];
}

/** Orders + units per period as grouped bars. */
export default function OrdersChart({ data }: Props) {
  const chartData = data.map((d) => ({ ...d, label: formatPeriod(d.period) }));

  return (
    <div className="orders-chart">
      <div className="orders-chart__head">
        <h3>შეკვეთები და ერთეულები</h3>
        <div className="orders-chart__legend">
          <span className="orders-chart__key orders-chart__key--orders">
            შეკვეთები
          </span>
          <span className="orders-chart__key orders-chart__key--units">
            ერთეულები
          </span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="orders-chart__empty">მონაცემები არ არის</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              width={40}
              allowDecimals={false}
            />
            <Tooltip
              formatter={((value: number, name: string) => [
                formatNumber(Number(value)),
                name === "orders" ? "შეკვეთები" : "ერთეულები",
              ]) as never}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            />
            <Bar dataKey="orders" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="units" fill="#9ca3c4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
