import { useState } from "react";
import { toast } from "react-toastify";
import type { MediaItem } from "@/types/media.types";
import { deleteMediaRequest } from "@/apiCalls/mediaApiCalls";
import {
  downloadUrl,
  formatBytes,
  formatDate,
  thumbUrl,
} from "@/utils/mediaUtils";
import RenameModal from "./RenameModal";
import "./MediaCard.scss";

interface Props {
  item: MediaItem;
  orgName?: string;
  showOrg: boolean;
  selected: boolean;
  canManage: boolean;
  onToggleSelect: (publicId: string) => void;
  onView: (item: MediaItem) => void;
  /** Sync callbacks — the card runs the request, the parent updates its list. */
  onRenamed: (updated: MediaItem, oldPublicId: string) => void;
  onDeleted: (publicId: string) => void;
}

export default function MediaCard({
  item,
  orgName,
  showOrg,
  selected,
  canManage,
  onToggleSelect,
  onView,
  onRenamed,
  onDeleted,
}: Props) {
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── Own actions ───────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      toast.success("ბმული დაკოპირდა");
    } catch {
      toast.error("ბმულის კოპირება ვერ მოხერხდა");
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = downloadUrl(item.url, item.name);
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm(`წავშალო „${item.name}"?`)) return;
    setDeleting(true);
    try {
      await deleteMediaRequest([item.publicId]);
      toast.success("ფაილი წაიშალა");
      onDeleted(item.publicId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "წაშლა ვერ მოხერხდა");
      setDeleting(false);
    }
  };

  return (
    <div
      className={`media-card ${selected ? "is-selected" : ""}`}
      style={deleting ? { opacity: 0.5, pointerEvents: "none" } : undefined}
    >
      <div className="media-card__thumb" onClick={() => onView(item)}>
        <img
          src={thumbUrl(item.url)}
          alt={item.name}
          loading="lazy"
          draggable={false}
        />
        <span className="media-card__format">{item.format || "img"}</span>

        {canManage && (
          <label
            className="media-card__check"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(item.publicId)}
            />
          </label>
        )}

        <div className="media-card__overlay">
          <button
            type="button"
            title="ნახვა"
            onClick={(e) => {
              e.stopPropagation();
              onView(item);
            }}
          >
            👁
          </button>
          <button
            type="button"
            title="ბმულის კოპირება"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            🔗
          </button>
          <button
            type="button"
            title="გადმოწერა"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            ⬇
          </button>
          {canManage && (
            <>
              <button
                type="button"
                title="სახელის შეცვლა"
                onClick={(e) => {
                  e.stopPropagation();
                  setRenaming(true);
                }}
              >
                ✏️
              </button>
              <button
                type="button"
                title="წაშლა"
                className="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                🗑
              </button>
            </>
          )}
        </div>
      </div>

      <div className="media-card__info">
        <p className="media-card__name" title={item.name}>
          {item.name}
        </p>
        <p className="media-card__meta">
          {item.width}×{item.height} · {formatBytes(item.bytes)} ·{" "}
          {formatDate(item.createdAt)}
        </p>
        {showOrg && (
          <span className="media-card__org" title={orgName || item.orgId || ""}>
            {orgName || (item.orgId ? "ორგანიზაცია" : "სხვა")}
          </span>
        )}
      </div>

      {renaming && (
        <RenameModal
          item={item}
          onClose={() => setRenaming(false)}
          onRenamed={onRenamed}
        />
      )}
    </div>
  );
}
