import { useState } from "react";
import { toast } from "react-toastify";
import { deleteMediaRequest } from "@/apiCalls/mediaApiCalls";
import "./MediaBulkBar.scss";

interface Props {
  /** Currently selected publicIds. */
  selectedIds: string[];
  /** Clear the parent's selection without deleting. */
  onClear: () => void;
  /**
   * Successful bulk delete — the parent uses this to prune its list,
   * decrement the count, etc.
   */
  onBulkDeleted: (ids: string[]) => void;
}

/**
 * Floating action bar for bulk operations. Owns the bulk delete request
 * end-to-end (confirmation, API call, error handling); the parent only
 * gets notified of the result.
 */
export default function MediaBulkBar({
  selectedIds,
  onClear,
  onBulkDeleted,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm(`წავშალო მონიშნული ${selectedIds.length} ფაილი?`))
      return;

    setDeleting(true);
    try {
      await deleteMediaRequest(selectedIds);
      toast.success(`წაიშალა ${selectedIds.length} ფაილი`);
      onBulkDeleted(selectedIds);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || "წაშლა ვერ მოხერხდა");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="media-bulkbar">
      <span>მონიშნულია {selectedIds.length}</span>
      <button className="btn-ghost" onClick={onClear} disabled={deleting}>
        მონიშვნის მოხსნა
      </button>
      <button
        className="btn-danger"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "იშლება..." : "მონიშნულის წაშლა"}
      </button>
    </div>
  );
}
