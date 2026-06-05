import { useEffect, type ReactNode } from "react";
import "./ModalShell.scss";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Extra class on the modal card, e.g. for narrower confirm dialogs. */
  variant?: "form" | "confirm";
}

/**
 * Shared modal chrome: dark overlay, centered card, header with close button,
 * Escape-to-close and click-outside-to-close.
 */
export default function ModalShell({
  title,
  onClose,
  children,
  variant = "form",
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-shell-overlay" onClick={onClose}>
      <div
        className={`modal-shell modal-shell--${variant}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-shell__header">
          <h2>{title}</h2>
          <button
            type="button"
            className="modal-shell__close"
            onClick={onClose}
            aria-label="დახურვა"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
