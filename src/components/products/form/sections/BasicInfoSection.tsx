import React from "react";
import "./BasicInfoSection.scss";
import type { CreateProductInput } from "@/types/productTypes";
import { PRODUCT_CONDITIONS, CONDITION_LABELS } from "@/types/productTypes";
import CategoryPicker from "../../../ui/CategoryPicker";

interface BasicInfoSectionProps {
  formData: CreateProductInput;
  errors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="pf-card">
    <div className="pf-card__header">
      <div className="pf-card__icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </div>
      <div>
        <h3 className="pf-card__title">ძირითადი ინფორმაცია</h3>
        <p className="pf-card__subtitle">სათაური, აღწერა და კატეგორია</p>
      </div>
    </div>

    <div className="pf-lang-grid">
      <div className="pf-lang-col">
        <div className="pf-lang-badge pf-lang-badge--ge">🇬🇪 ქართული</div>
        <div className="pf-field">
          <label className="pf-label">
            სათაური <span className="pf-required">*</span>
          </label>
          <input
            type="text"
            name="titleGe"
            value={formData.titleGe}
            onChange={handleInputChange}
            className={errors.titleGe ? "pf-input pf-input--error" : "pf-input"}
            placeholder="პროდუქტის სახელი..."
          />
          {errors.titleGe && <span className="pf-error">{errors.titleGe}</span>}
        </div>
        <div className="pf-field">
          <label className="pf-label">
            აღწერა <span className="pf-required">*</span>
          </label>
          <textarea
            name="descriptionGe"
            value={formData.descriptionGe}
            onChange={handleInputChange}
            rows={4}
            className={
              errors.descriptionGe ? "pf-input pf-input--error" : "pf-input"
            }
            placeholder="პროდუქტის დეტალური აღწერა..."
          />
          {errors.descriptionGe && (
            <span className="pf-error">{errors.descriptionGe}</span>
          )}
        </div>
      </div>

      <div className="pf-lang-col">
        <div className="pf-lang-badge pf-lang-badge--en">🇬🇧 English</div>
        <div className="pf-field">
          <label className="pf-label">
            Title <span className="pf-required">*</span>
          </label>
          <input
            type="text"
            name="titleEn"
            value={formData.titleEn}
            onChange={handleInputChange}
            className={errors.titleEn ? "pf-input pf-input--error" : "pf-input"}
            placeholder="Product name..."
          />
          {errors.titleEn && <span className="pf-error">{errors.titleEn}</span>}
        </div>
        <div className="pf-field">
          <label className="pf-label">
            Description <span className="pf-required">*</span>
          </label>
          <textarea
            name="descriptionEn"
            value={formData.descriptionEn}
            onChange={handleInputChange}
            rows={4}
            className={
              errors.descriptionEn ? "pf-input pf-input--error" : "pf-input"
            }
            placeholder="Detailed product description..."
          />
          {errors.descriptionEn && (
            <span className="pf-error">{errors.descriptionEn}</span>
          )}
        </div>
      </div>
    </div>

    <div className="pf-row">
      <div className="pf-field">
        <label className="pf-label">
          კატეგორია <span className="pf-required">*</span>
        </label>
        <CategoryPicker
          value={formData.category}
          onChange={handleInputChange}
          error={errors.category}
        />
        {errors.category && <span className="pf-error">{errors.category}</span>}
      </div>
      <div className="pf-field">
        <label className="pf-label">
          მდგომარეობა <span className="pf-required">*</span>
        </label>
        <div className="condition-pills">
          {PRODUCT_CONDITIONS.map((value) => (
            <label
              key={value}
              className={`condition-pill${formData.condition === value ? " condition-pill--active" : ""}`}
            >
              <input
                type="radio"
                name="condition"
                value={value}
                checked={formData.condition === value}
                onChange={handleInputChange}
              />
              <span>
                {CONDITION_LABELS[value].ge}
                <small>{CONDITION_LABELS[value].en}</small>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default BasicInfoSection;
