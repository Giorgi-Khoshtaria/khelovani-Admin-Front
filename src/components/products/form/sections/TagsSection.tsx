import React from "react";
import type { CreateProductInput } from "@/types/productTypes";
import ChipInput from "../../../ui/ChipInput";

type TagField = "tagsGe" | "tagsEn" | "materialsGe" | "materialsEn";

interface TagsSectionProps {
  formData: CreateProductInput;
  errors: Record<string, string>;
  setArrayField: (name: TagField, items: string[]) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  formData,
  errors,
  setArrayField,
}) => {
  const renderField = (
    name: TagField,
    label: string,
    placeholder: string,
  ) => (
    <div className="pf-field">
      <label className="pf-label">{label}</label>
      <ChipInput
        items={(formData[name] as string[]) || []}
        onItemsChange={(items) => setArrayField(name, items)}
        placeholder={placeholder}
        max={10}
        error={!!errors[name]}
      />
      {errors[name] && <span className="pf-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="pf-card">
      <div className="pf-card__header">
        <div className="pf-card__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        </div>
        <div>
          <h3 className="pf-card__title">ტეგები და მასალები</h3>
          <p className="pf-card__subtitle">თითოეული ჩაწერეთ ცალ-ცალკე და დააჭირეთ Enter ან + დამატება</p>
        </div>
      </div>

      <div className="pf-lang-grid">
        <div className="pf-lang-col">
          <div className="pf-lang-badge pf-lang-badge--ge">🇬🇪 ქართული</div>
          {renderField("materialsGe", "მასალები", "მაგ. ბამბა")}
          {renderField("tagsGe", "ტეგები", "მაგ. საჩუქარი")}
        </div>

        <div className="pf-lang-col">
          <div className="pf-lang-badge pf-lang-badge--en">🇬🇧 English</div>
          {renderField("materialsEn", "Materials", "e.g. cotton")}
          {renderField("tagsEn", "Tags", "e.g. gift")}
        </div>
      </div>
    </div>
  );
};

export default TagsSection;
