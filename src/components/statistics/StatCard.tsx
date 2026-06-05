import type { ReactNode } from "react";
import "./StatCard.scss";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: "default" | "success" | "warning" | "danger";
}

/** A single KPI tile (revenue, orders, units, …). */
export default function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "default",
}: Props) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {hint && <span className="stat-card__hint">{hint}</span>}
      </div>
    </div>
  );
}
