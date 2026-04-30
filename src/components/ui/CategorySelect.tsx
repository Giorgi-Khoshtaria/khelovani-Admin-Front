import React from "react";
import useCategoryOptions from "@/hooks/categories/useCategoryOptions";

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
  const { options, loading } = useCategoryOptions();

  return (
    <select name={name} value={value} onChange={onChange} className={className} disabled={loading}>
      {includeAll ? (
        <option value="all">ყველა კატეგორია</option>
      ) : (
        <option value="">აირჩიეთ კატეგორია</option>
      )}
      {options.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.nameGe} / {cat.nameEn}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
