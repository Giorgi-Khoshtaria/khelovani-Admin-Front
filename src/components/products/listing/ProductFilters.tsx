import React from "react";
import "./ProductFilters.scss";
import CategorySelect from "../../ui/CategorySelect";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  isAdmin: boolean;
  id?: string; // id from params
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
      <input
        type="text"
        placeholder="ძიება (სათაური, აღწერა) / Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />

      {isAdmin && !id && (
        <select
          className="organization-select"
          value={selectedPartnerId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onPartnerChange(e.target.value)}
        >
          <option value="">ყველა ორგანიზაცია / All Organizations</option>
          {partners.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      <CategorySelect
        value={category}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
        includeAll={true}
        className="category-select"
      />
    </div>
  );
};
