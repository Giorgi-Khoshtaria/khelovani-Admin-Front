import React from "react";
import "./ProductFilters.scss";
import CategorySelect from "../../ui/CategorySelect";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  isAdmin: boolean;
  id?: string;
  selectedPartnerId: string;
  onPartnerChange: (value: string) => void;
  partners: { _id: string; name: string }[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  isAdmin,
  id,
  selectedPartnerId,
  onPartnerChange,
  partners,
}) => {
  return (
    <div className="filters card">
      <div className="filters__group">
        <div className="filters__search-wrapper">
          <svg className="filters__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="ძიება (სათაური, აღწერა)"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filters__input"
          />
        </div>
      </div>

      {isAdmin && !id && (
        <div className="filters__group">
          <div className="filters__select-wrapper">
            <svg className="filters__select-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <select
              className="filters__select"
              value={selectedPartnerId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onPartnerChange(e.target.value)
              }
            >
              <option value="">ყველა ორგანიზაცია</option>
              {partners.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="filters__group">
        <CategorySelect
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onCategoryChange(e.target.value)
          }
          includeAll={true}
          className="filters__category"
        />
      </div>
    </div>
  );
};
