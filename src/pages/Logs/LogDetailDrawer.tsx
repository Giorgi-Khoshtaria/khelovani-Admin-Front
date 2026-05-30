import { useEffect } from "react";
import type { RequestLog } from "@/types/logs.types";

interface Props {
  log: RequestLog;
  loading?: boolean;
  onClose: () => void;
}

const formatDate = (iso: string) => new Date(iso).toLocaleString();

export default function LogDetailDrawer({ log, loading, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isError = log.statusCode >= 400;

  return (
    <div className="log-drawer-overlay" onClick={onClose}>
      <div className="log-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>
            <span className={`method method-${log.method.toLowerCase()}`}>
              {log.method}
            </span>{" "}
            <span className="url">{log.url}</span>
          </h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {loading ? (
          <div className="drawer-loading">იტვირთება...</div>
        ) : (
          <div className="drawer-body">
            <section>
              <h3>Overview</h3>
              <dl>
                <dt>Time</dt>
                <dd>{formatDate(log.createdAt)}</dd>
                <dt>Status</dt>
                <dd>{log.statusCode}</dd>
                <dt>Duration</dt>
                <dd>{log.responseTimeMs} ms</dd>
                <dt>Source</dt>
                <dd>{log.source}</dd>
                <dt>IP</dt>
                <dd>{log.ip || "—"}</dd>
                <dt>User-Agent</dt>
                <dd>{log.userAgent || "—"}</dd>
                <dt>User ID</dt>
                <dd>{log.userId || "—"}</dd>
                <dt>User Role</dt>
                <dd>{log.userRole || "—"}</dd>
              </dl>
            </section>

            {isError && (
              <>
                {log.errorMessage && (
                  <section>
                    <h3>Error message</h3>
                    <pre className="error-message">{log.errorMessage}</pre>
                  </section>
                )}

                {log.errorStack && (
                  <section>
                    <h3>Stack trace</h3>
                    <pre className="error-stack">{log.errorStack}</pre>
                  </section>
                )}

                {log.requestBody !== undefined && log.requestBody !== null && (
                  <section>
                    <h3>Request body (sanitized)</h3>
                    <pre className="request-body">
                      {JSON.stringify(log.requestBody, null, 2)}
                    </pre>
                  </section>
                )}
              </>
            )}

            {!isError && (
              <p className="ok-note">
                წარმატებული მოთხოვნა — სხეული არ ინახება (მხოლოდ შეცდომის
                შემთხვევაში).
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
