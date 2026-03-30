import React from "react";
import "./ProductFilters.scss";

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
          className="category-select"
          value={selectedPartnerId}
          onChange={(e) => onPartnerChange(e.target.value)}
        >
          <option value="">ყველა ორგანიზაცია / All Organizations</option>
          {partners.map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      )}

      <select 
        value={category} 
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        <option value="all">ყველა კატეგორია / All</option>
        <option value="jewelry_accessories">Jewelry & Accessories</option>
        <option value="textiles_fabric">Textiles & Fabric</option>
        <option value="ceramics_pottery">Ceramics & Pottery</option>
        <option value="woodwork">Woodwork</option>
        <option value="metalwork">Metalwork</option>
        <option value="leather_goods">Leather Goods</option>
        <option value="home_decor">Home Decor</option>
        <option value="art_prints">Art Prints</option>
        <option value="natural_wellness">Natural Wellness</option>
        <option value="toys_gifts">Toys & Gifts</option>
        <option value="food_drink">Food & Drink</option>
      </select>
    </div>
  );
};
