import { useCallback, useEffect, useState } from "react";
import {
  clearAllLogsRequest,
  deleteLogRequest,
  getLogByIdRequest,
  getLogsRequest,
} from "@/apiCalls/logsApiCalls/logs.req";
import type {
  LogSource,
  LogStatusFilter,
  LogsMeta,
  RequestLog,
} from "@/types/logs.types";
import LogDetailDrawer from "./LogDetailDrawer";
import "./LogsPage.scss";

const STATUS_TABS: { value: LogStatusFilter; label: string }[] = [
  { value: "all", label: "ყველა" },
  { value: "error", label: "Errors" },
  { value: "ok", label: "OK" },
];

const SOURCE_OPTIONS: { value: LogSource | "all"; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "user", label: "User" },
  { value: "partner", label: "Partner" },
  { value: "admin", label: "Admin" },
  { value: "public", label: "Public" },
];

const METHODS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

const statusClass = (code: number) => {
  if (code >= 500) return "status-badge status-500";
  if (code >= 400) return "status-badge status-400";
  if (code >= 300) return "status-badge status-300";
  return "status-badge status-200";
};

export default function LogsPage() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [meta, setMeta] = useState<LogsMeta>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<LogStatusFilter>("all");
  const [source, setSource] = useState<LogSource | "all">("all");
  const [method, setMethod] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [autoRefresh, setAutoRefresh] = useState(false);

  const [selected, setSelected] = useState<RequestLog | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, meta: m } = await getLogsRequest({
        status,
        source,
        method,
        search: search.trim() || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit,
      });
      setLogs(data);
      setMeta(m);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  }, [status, source, method, search, dateFrom, dateTo, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = window.setInterval(fetchLogs, 15000);
    return () => window.clearInterval(id);
  }, [autoRefresh, fetchLogs]);

  const onRowClick = async (log: RequestLog) => {
    setSelected(log);
    if (log.statusCode >= 400) {
      setDrawerLoading(true);
      try {
        const full = await getLogByIdRequest(log._id);
        setSelected(full);
      } catch (err) {
        console.error("Failed to load log detail:", err);
      } finally {
        setDrawerLoading(false);
      }
    }
  };

  const onDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("წაშალო ეს ჩანაწერი?")) return;
    try {
      await deleteLogRequest(id);
      await fetchLogs();
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  const onClearAll = async () => {
    if (!window.confirm("ყველა ჩანაწერი წაიშლება. დარწმუნებული ხარ?")) return;
    try {
      await clearAllLogsRequest();
      await fetchLogs();
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  };

  const clearFilters = () => {
    setStatus("all");
    setSource("all");
    setMethod("ALL");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div className="logs-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Request Logs</h1>
          {meta.totalCount > 0 && (
            <span className="count-badge">{meta.totalCount}</span>
          )}
        </div>
        <div className="header-actions">
          <button className="clear-all-btn" onClick={onClearAll}>
            ლოგების გასუფთავება
          </button>
          <label className="auto-refresh">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh (15s)</span>
          </label>
        </div>
      </div>

      <div className="retention-banner">
        ჩანაწერები 3 დღეზე ძველი ავტომატურად იშლება.
      </div>

      <div className="filter-tabs">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            className={`tab ${status === t.value ? "active" : ""}`}
            onClick={() => {
              setStatus(t.value);
              setPage(1);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="filters card">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Search URL or IP..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value as LogSource | "all");
              setPage(1);
            }}
          >
            {SOURCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setPage(1);
            }}
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
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
          />
          <button className="clear-btn" onClick={clearFilters}>
            გასუფთავება
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">იტვირთება...</div>
      ) : logs.length === 0 ? (
        <div className="empty-state card">
          <p>ჩანაწერები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="logs-list card">
          <div className="logs-header">
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
              <div className="col-time">{formatDate(log.createdAt)}</div>
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                წინა
              </button>
              <span className="page-info">
                გვერდი {meta.currentPage} / {meta.totalPages}
              </span>
              <button
                disabled={page === meta.totalPages}
                onClick={() =>
                  setPage((p) => Math.min(meta.totalPages, p + 1))
                }
              >
                შემდეგი
              </button>
            </div>
          )}
        </div>
      )}

      {selected && (
        <LogDetailDrawer
          log={selected}
          loading={drawerLoading}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
