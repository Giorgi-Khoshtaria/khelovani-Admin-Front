import type { LogsMeta, RequestLog } from "@/types/logs.types";
import { formatLogDate, statusClass } from "@/utils/logsUtils";
import "./LogsTable.scss";

interface Props {
  logs: RequestLog[];
  meta: LogsMeta;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onRowClick: (log: RequestLog) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export default function LogsTable({
  logs,
  meta,
  loading,
  page,
  onPageChange,
  onRowClick,
  onDelete,
}: Props) {
  if (loading) {
    return <div className="logs-loading">იტვირთება...</div>;
  }

  if (logs.length === 0) {
    return (
      <div className="logs-empty card">
        <p>ჩანაწერები ვერ მოიძებნა</p>
      </div>
    );
  }

  return (
    <div className="logs-list card">
      <div className="logs-list-header">
        <div className="col-time">Time</div>
        <div className="col-method">Method</div>
        <div className="col-url">URL</div>
        <div className="col-status">Status</div>
        <div className="col-duration">Duration</div>
        <div className="col-source">Source</div>
        <div className="col-ip">IP</div>
        <div className="col-actions"></div>
      </div>

      {logs.map((log) => (
        <div
          key={log._id}
          className="logs-row"
          onClick={() => onRowClick(log)}
        >
          <div className="col-time">{formatLogDate(log.createdAt)}</div>
          <div className={`col-method method-${log.method.toLowerCase()}`}>
            {log.method}
          </div>
          <div className="col-url" title={log.url}>
            {log.url}
          </div>
          <div className="col-status">
            <span className={statusClass(log.statusCode)}>
              {log.statusCode}
            </span>
          </div>
          <div className="col-duration">{log.responseTimeMs} ms</div>
          <div className="col-source">
            <span className={`source-badge source-${log.source}`}>
              {log.source}
            </span>
          </div>
          <div className="col-ip">{log.ip || "—"}</div>
          <div className="col-actions">
            <button
              className="delete-btn"
              onClick={(e) => onDelete(e, log._id)}
              title="წაშლა"
            >
              ×
            </button>
          </div>
        </div>
      ))}

      {meta.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            წინა
          </button>
          <span className="page-info">
            გვერდი {meta.currentPage} / {meta.totalPages}
          </span>
          <button
            disabled={page === meta.totalPages}
            onClick={() => onPageChange(Math.min(meta.totalPages, page + 1))}
          >
            შემდეგი
          </button>
        </div>
      )}
    </div>
  );
}
