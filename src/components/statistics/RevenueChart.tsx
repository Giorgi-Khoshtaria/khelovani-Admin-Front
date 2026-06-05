import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StatTimeBucket } from "@/types/statistics.types";
import { formatCurrency, formatPeriod } from "@/utils/formatStats";
import "./RevenueChart.scss";

interface Props {
  data: StatTimeBucket[];
}

/** Revenue-over-time area chart for the selected granularity. */
export default function RevenueChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatPeriod(d.period),
  }));

  return (
    <div className="revenue-chart">
      <div className="revenue-chart__head">
        <h3>შემოსავალი დროში</h3>
      </div>

      {chartData.length === 0 ? (
        <div className="revenue-chart__empty">მონაცემები არ არის</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a1a2e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1a1a2e" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              width={70}
              tickFormatter={(v) => formatCurrency(Number(v))}
            />
            <Tooltip
              formatter={((value: number) => [
                formatCurrency(Number(value)),
                "შემოსავალი",
              ]) as never}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1a1a2e"
              strokeWidth={2}
              fill="url(#revFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
