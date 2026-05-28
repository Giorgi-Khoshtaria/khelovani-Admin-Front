import { useEffect, useState } from "react";
import type { MediaOrganization } from "@/types/media.types";
import "./MediaFilters.scss";

/** Filter values consumed by the listing API. */
export interface MediaFilterValues {
  orgId: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  isAdmin: boolean;
  organizations: MediaOrganization[];
  totalCount: number;
  value: MediaFilterValues;
  onChange: (next: MediaFilterValues) => void;
}

/**
 * Filters panel for the Media Manager — owns the local debounced search
 * input and emits a normalised set of filter values to the parent.
 */
export default function MediaFilters({
  isAdmin,
  organizations,
  totalCount,
  value,
  onChange,
}: Props) {
  // Search has its own local state so typing isn't throttled by the parent.
  const [searchInput, setSearchInput] = useState(value.search);

  // If the parent resets the search (e.g. clear-all), keep local input in sync.
  useEffect(() => {
    setSearchInput(value.search);
  }, [value.search]);

  // Debounce search updates upstream by 400ms.
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === value.search) return;
    const t = setTimeout(() => onChange({ ...value, search: trimmed }), 400);
    return () => clearTimeout(t);
  }, [searchInput, value, onChange]);

  const setField = (patch: Partial<MediaFilterValues>) =>
    onChange({ ...value, ...patch });

  const clearAll = () => {
    setSearchInput("");
    onChange({ orgId: "", search: "", dateFrom: "", dateTo: "" });
  };

  const hasFilters =
    !!(value.orgId || value.search || value.dateFrom || value.dateTo);

  return (
    <div className="media-filters">
      {isAdmin && (
        <select
          className="media-filters__field"
          value={value.orgId}
          onChange={(e) => setField({ orgId: e.target.value })}
        >
          <option value="">ყველა ორგანიზაცია</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      )}

      <input
        className="media-filters__field media-filters__search"
        type="text"
        placeholder="ძებნა სახელით..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <label className="media-filters__date">
        <span>დან</span>
        <input
          type="date"
          value={value.dateFrom}
          onChange={(e) => setField({ dateFrom: e.target.value })}
        />
      </label>
      <label className="media-filters__date">
        <span>მდე</span>
        <input
          type="date"
          value={value.dateTo}
          onChange={(e) => setField({ dateTo: e.target.value })}
        />
      </label>

      {hasFilters && (
        <button className="btn-ghost" onClick={clearAll}>
          გასუფთავება
        </button>
      )}

      <span className="media-filters__count">{totalCount} ფაილი</span>
    </div>
  );
}
