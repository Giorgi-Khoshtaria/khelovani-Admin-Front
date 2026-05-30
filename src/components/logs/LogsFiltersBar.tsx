import type { LogSource } from "@/types/logs.types";
import { METHODS, SOURCE_OPTIONS } from "@/utils/logsUtils";
import "./LogsFiltersBar.scss";

interface Props {
  search: string;
  source: LogSource | "all";
  method: string;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  onSourceChange: (value: LogSource | "all") => void;
  onMethodChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClear: () => void;
}

export default function LogsFiltersBar({
  search,
  source,
  method,
  dateFrom,
  dateTo,
  onSearchChange,
  onSourceChange,
  onMethodChange,
  onDateFromChange,
  onDateToChange,
  onClear,
}: Props) {
  return (
    <div className="logs-filters card">
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search URL or IP..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value as LogSource | "all")}
        >
          {SOURCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={method}
          onChange={(e) => onMethodChange(e.target.value)}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m === "ALL" ? "All methods" : m}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
        />
        <button className="clear-btn" onClick={onClear}>
          გასუფთავება
        </button>
      </div>
    </div>
  );
}
