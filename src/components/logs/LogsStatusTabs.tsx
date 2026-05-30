import type { LogStatusFilter } from "@/types/logs.types";
import { STATUS_TABS } from "@/utils/logsUtils";
import "./LogsStatusTabs.scss";

interface Props {
  value: LogStatusFilter;
  onChange: (value: LogStatusFilter) => void;
}

export default function LogsStatusTabs({ value, onChange }: Props) {
  return (
    <div className="logs-status-tabs">
      {STATUS_TABS.map((t) => (
        <button
          key={t.value}
          className={`tab ${value === t.value ? "active" : ""}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
