import React from "react";
import { ProductCategory, PRODUCT_CATEGORY_LABELS } from "@/types/productTypes";

interface CategorySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  includeAll?: boolean;
  className?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  name = "category",
  includeAll = false,
  className = "",
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    >
      {includeAll ? (
        <option value="all">ყველა კატეგორია / All</option>
      ) : (
        <option value="">აირჩიეთ კატეგორია / Select Category</option>
      )}
      
      {Object.values(ProductCategory).map((cat) => (
        <option key={cat} value={cat}>
          {PRODUCT_CATEGORY_LABELS[cat].ge} / {PRODUCT_CATEGORY_LABELS[cat].en}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
