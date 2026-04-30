import React from "react";
import "./UserFilters.scss";

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onClear: () => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  search,
  onSearchChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClear,
}) => {
  const hasFilters = search || dateFrom || dateTo;

  return (
    <div className="user-filters card">
      <div className="user-filters__group user-filters__group--wide">
        <div className="user-filters__search-wrapper">
          <svg
            className="user-filters__search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="ძიება (სახელი, ID)"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="user-filters__input"
            data-testid="user-search-input"
          />
        </div>
      </div>

      <div className="user-filters__group">
        <label className="user-filters__label">თარიღიდან</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="user-filters__date"
          data-testid="user-date-from"
        />
      </div>

      <div className="user-filters__group">
        <label className="user-filters__label">თარიღამდე</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="user-filters__date"
          data-testid="user-date-to"
        />
      </div>

      {hasFilters && (
        <div className="user-filters__group user-filters__group--action">
          <button
            className="user-filters__clear-btn"
            onClick={onClear}
            data-testid="user-clear-filters"
          >
            გასუფთავება
          </button>
        </div>
      )}
    </div>
  );
};
