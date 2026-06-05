import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatStatusBreakdownEntry } from "@/types/statistics.types";
import { formatNumber } from "@/utils/formatStats";
import "./StatusBreakdown.scss";

interface Props {
  data: StatStatusBreakdownEntry[];
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  paid: { label: "გადახდილი", color: "#1a1a2e" },
  delivered: { label: "მიწოდებული", color: "#059669" },
  cancelled: { label: "გაუქმებული", color: "#dc2626" },
};

/** Order-status distribution donut + legend. */
export default function StatusBreakdown({ data }: Props) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_META[d.status]?.label ?? d.status,
      value: d.count,
      color: STATUS_META[d.status]?.color ?? "#9ca3af",
    }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="status-breakdown">
      <div className="status-breakdown__head">
        <h3>შეკვეთების სტატუსი</h3>
      </div>

      {total === 0 ? (
        <div className="status-breakdown__empty">მონაცემები არ არის</div>
      ) : (
        <div className="status-breakdown__body">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={((value: number) => formatNumber(Number(value))) as never}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <ul className="status-breakdown__legend">
            {data.map((d) => (
              <li key={d.status}>
                <span
                  className="status-breakdown__dot"
                  style={{ background: STATUS_META[d.status]?.color }}
                />
                <span className="status-breakdown__name">
                  {STATUS_META[d.status]?.label ?? d.status}
                </span>
                <span className="status-breakdown__count">
                  {formatNumber(d.count)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
