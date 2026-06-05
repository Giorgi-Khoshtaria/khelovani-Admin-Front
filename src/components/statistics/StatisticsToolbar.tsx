import {
  STAT_GRANULARITIES,
  STAT_GRANULARITY_LABELS,
  type StatGranularity,
} from "@/types/statistics.types";
import "./StatisticsToolbar.scss";

interface Props {
  granularity: StatGranularity;
  onGranularityChange: (g: StatGranularity) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onReset: () => void;
}

/** Granularity toggle + date-range filters shared by both stat pages. */
export default function StatisticsToolbar({
  granularity,
  onGranularityChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onReset,
}: Props) {
  const hasDates = !!(dateFrom || dateTo);

  return (
    <div className="stats-toolbar">
      <div className="stats-toolbar__granularity">
        {STAT_GRANULARITIES.map((g) => (
          <button
            key={g}
            className={`stats-toolbar__tab ${
              granularity === g ? "stats-toolbar__tab--active" : ""
            }`}
            onClick={() => onGranularityChange(g)}
          >
            {STAT_GRANULARITY_LABELS[g]}
          </button>
        ))}
      </div>

      <div className="stats-toolbar__dates">
        <label>
          <span>დან</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
        </label>
        <label>
          <span>მდე</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </label>
        {hasDates && (
          <button className="stats-toolbar__reset" onClick={onReset}>
            გასუფთავება
          </button>
        )}
      </div>
    </div>
  );
}
