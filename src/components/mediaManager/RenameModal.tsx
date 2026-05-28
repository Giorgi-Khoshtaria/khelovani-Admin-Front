import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { MediaItem } from "@/types/media.types";
import { renameMediaRequest } from "@/apiCalls/mediaApiCalls";
import { thumbUrl } from "@/utils/mediaUtils";
import "./RenameModal.scss";

interface Props {
  item: MediaItem;
  onClose: () => void;
  /**
   * Notifies the parent so it can sync the renamed item into its list.
   * Passes the original publicId too so the parent can remap stale fetches.
   */
  onRenamed: (updated: MediaItem, oldPublicId: string) => void;
}

export default function RenameModal({ item, onClose, onRenamed }: Props) {
  const [name, setName] = useState(item.name);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // This component owns the rename request end-to-end.
  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === item.name || saving) return;
    setSaving(true);
    try {
      const oldPublicId = item.publicId;
      const updated = await renameMediaRequest(oldPublicId, trimmed);
      toast.success("სახელი შეიცვალა");
      onRenamed(updated, oldPublicId);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "სახელის შეცვლა ვერ მოხერხდა",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <div
        className="media-modal media-modal--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="media-modal__header">
          <h3>სახელის შეცვლა</h3>
          <button className="media-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="media-modal__body">
          <img
            className="rename-modal__thumb"
            src={thumbUrl(item.url, 160)}
            alt={item.name}
          />
          <label className="media-field">
            <span>ფაილის ახალი სახელი</span>
            <input
              type="text"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </label>
          <p className="media-hint">
            ნებადართულია ასოები, ციფრები, „-" და „_". გამოტოვებები ჩაიანაცვლება „_"-ით.
          </p>
        </div>

        <div className="media-modal__footer">
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            გაუქმება
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving || !name.trim() || name.trim() === item.name}
          >
            {saving ? "ინახება..." : "შენახვა"}
          </button>
        </div>
      </div>
    </div>
  );
}
