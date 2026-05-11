import React from "react";
import "./PricingSection.scss";
import type { CreateProductInput } from "@/types/productTypes";

interface PricingSectionProps {
  formData: CreateProductInput;
  errors: Record<string, string>;
  isAdmin?: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  formData,
  errors,
  isAdmin,
  handleInputChange,
}) => {
  const setVisibility = (val: boolean) => {
    handleInputChange({
      target: { name: "isShown", value: val, type: "checkbox", checked: val },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="pf-card">
      <div className="pf-card__header">
        <div className="pf-card__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        </div>
        <div>
          <h3 className="pf-card__title">ფასი და მარაგი</h3>
          <p className="pf-card__subtitle">განსაზღვრეთ ფასი და ხელმისაწვდომი რაოდენობა</p>
        </div>
      </div>

      <div className="pf-row">
        <div className="pf-field">
          <label className="pf-label">ფასი <span className="pf-required">*</span></label>
          <div className="pf-input-group">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              placeholder="0"
              className={errors.price ? "pf-input--error" : ""}
            />
            <span className="pf-input-group__suffix">₾</span>
          </div>
          {errors.price && <span className="pf-error">{errors.price}</span>}
        </div>

        <div className="pf-field">
          <label className="pf-label">მარაგი <span className="pf-required">*</span></label>
          <div className="pf-input-group">
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              placeholder="0"
              className={errors.stockQuantity ? "pf-input--error" : ""}
            />
            <span className="pf-input-group__suffix">ც</span>
          </div>
          {errors.stockQuantity && <span className="pf-error">{errors.stockQuantity}</span>}
        </div>

        {isAdmin && (
          <div className="pf-field">
            <label className="pf-label">ხილვადობა</label>
            <select
              name="isShown"
              value={formData.isShown.toString()}
              className="pf-input"
              onChange={(e) => setVisibility(e.target.value === "true")}
            >
              <option value="true">👁️ საჯარო</option>
              <option value="false">🔒 დამალული</option>
            </select>
          </div>
        )}
      </div>

      <div className="pf-toggles">
        <label className="pf-toggle">
          <div className="pf-toggle__switch">
            <input
              type="checkbox"
              name="isOnSale"
              checked={!!formData.isOnSale}
              onChange={handleInputChange}
            />
            <span className="pf-toggle__track" />
          </div>
          <div className="pf-toggle__body">
            <strong>🏷️ ფასდაკლება</strong>
            <small>გამოიყენეთ პროცენტული ფასდაკლება</small>
          </div>
        </label>
      </div>

      {formData.isOnSale && (
        <div className="pf-discount-field">
          <label className="pf-label">ფასდაკლება <span className="pf-required">*</span></label>
          <div className="pf-input-group pf-input-group--compact">
            <input
              type="number"
              name="discountPercent"
              value={formData.discountPercent ?? ""}
              onChange={handleInputChange}
              min={1}
              max={99}
              placeholder="20"
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className={errors.discountPercent ? "pf-input--error" : ""}
            />
            <span className="pf-input-group__suffix">%</span>
          </div>
          {errors.discountPercent && <span className="pf-error">{errors.discountPercent}</span>}
        </div>
      )}
    </div>
  );
};

export default PricingSection;
