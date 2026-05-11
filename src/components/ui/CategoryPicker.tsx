import React, { useState, useMemo } from "react";
import useCategoryOptions from "@/hooks/categories/useCategoryOptions";
import "./CategoryPicker.scss";

interface CategoryPickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  error?: string;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  value,
  onChange,
  name = "category",
  error,
}) => {
  const { options, loading } = useCategoryOptions();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (c) =>
        c.nameGe.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q),
    );
  }, [options, search]);

  const selected = options.find((c) => c.slug === value);

  const handleSelect = (slug: string) => {
    const syntheticEvent = {
      target: { name, value: slug, type: "select-one" },
      currentTarget: { name, value: slug },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  if (loading) {
    return <div className="cat-picker__loading">იტვირთება...</div>;
  }

  return (
    <div className={`cat-picker${error ? " cat-picker--error" : ""}`}>
      {selected && (
        <div className="cat-picker__selected">
          <span className="cat-picker__selected-label">
            {selected.nameGe}
            <small>{selected.nameEn}</small>
          </span>
          <button
            type="button"
            className="cat-picker__clear"
            onClick={() => handleSelect("")}
            aria-label="clear"
          >
            ✕
          </button>
        </div>
      )}

      <div className="cat-picker__search-wrapper">
        <svg className="cat-picker__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="cat-picker__search"
          placeholder="კატეგორიის ძიება..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button type="button" className="cat-picker__search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      <div className="cat-picker__grid">
        {filtered.length === 0 ? (
          <p className="cat-picker__empty">კატეგორია ვერ მოიძებნა</p>
        ) : (
          filtered.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className={`cat-picker__item${value === cat.slug ? " cat-picker__item--active" : ""}`}
              onClick={() => handleSelect(cat.slug)}
            >
              <span className="cat-picker__name-ge">{cat.nameGe}</span>
              <span className="cat-picker__name-en">{cat.nameEn}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPicker;
