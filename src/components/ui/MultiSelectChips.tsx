import "./MultiSelectChips.scss";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectChipsProps {
  options: Option[];
  value: string[];
  onChange: (newValue: string[]) => void;
  placeholder?: string;
  maxItems?: number;
}

export default function MultiSelectChips({
  options,
  value,
  onChange,
  placeholder = "კატეგორია",
  maxItems = 5,
}: MultiSelectChipsProps) {
  const toggle = (slug: string) => {
    if (value.includes(slug)) {
      onChange(value.filter((v) => v !== slug));
    } else if (value.length < maxItems) {
      onChange([...value, slug]);
    }
  };

  return (
    <div className="multi-chips">
      {value.length === 0 && (
        <span className="multi-chips__placeholder">{placeholder}</span>
      )}
      {value.map((slug) => {
        const label = options.find((o) => o.value === slug)?.label ?? slug;
        return (
          <span key={slug} className="multi-chips__chip multi-chips__chip--selected">
            {label}
            <button
              type="button"
              className="multi-chips__remove"
              onClick={() => toggle(slug)}
              aria-label={`${label}-ის მოხსნა`}
            >
              ×
            </button>
          </span>
        );
      })}
      <div className="multi-chips__dropdown">
        {options
          .filter((o) => !value.includes(o.value))
          .map((o) => (
            <button
              key={o.value}
              type="button"
              className="multi-chips__option"
              onClick={() => toggle(o.value)}
              disabled={value.length >= maxItems}
            >
              {o.label}
            </button>
          ))}
      </div>
    </div>
  );
}
