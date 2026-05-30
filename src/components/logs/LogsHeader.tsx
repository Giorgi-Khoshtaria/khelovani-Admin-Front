import "./LogsHeader.scss";

interface Props {
  totalCount: number;
  autoRefresh: boolean;
  onAutoRefreshChange: (value: boolean) => void;
  onClearAll: () => void;
}

export default function LogsHeader({
  totalCount,
  autoRefresh,
  onAutoRefreshChange,
  onClearAll,
}: Props) {
  return (
    <div className="logs-header-bar">
      <div className="header-title">
        <h1>Request Logs</h1>
        {totalCount > 0 && <span className="count-badge">{totalCount}</span>}
      </div>
      <div className="header-actions">
        <button className="clear-all-btn" onClick={onClearAll}>
          ლოგების გასუფთავება
        </button>
        <label className="auto-refresh">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => onAutoRefreshChange(e.target.checked)}
          />
          <span>Auto-refresh (15s)</span>
        </label>
      </div>
    </div>
  );
}
