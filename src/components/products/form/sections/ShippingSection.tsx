import React from "react";
import type { CreateProductInput } from "@/types/productTypes";
import { blockNonPositiveKeys } from "@/utils/numericInput";

interface ShippingSectionProps {
  formData: CreateProductInput;
  errors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

const ShippingSection: React.FC<ShippingSectionProps> = ({
  formData,
  errors,
  handleInputChange,
}) => (
  <div className="pf-card">
    <div className="pf-card__header">
      <div className="pf-card__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      </div>
      <div>
        <h3 className="pf-card__title">მიწოდება და ზომები</h3>
        <p className="pf-card__subtitle">ტრანსპორტირება და ფიზიკური მახასიათებლები</p>
      </div>
    </div>

    <label className="pf-toggle">
      <div className="pf-toggle__switch">
        <input
          type="checkbox"
          name="shippingAvailable"
          checked={formData.shippingAvailable}
          onChange={handleInputChange}
        />
        <span className="pf-toggle__track" />
      </div>
      <div className="pf-toggle__body">
        <strong>🚚 მიწოდება ხელმისაწვდომია</strong>
        <small>გამყიდველი გაგზავნის პროდუქტს</small>
      </div>
    </label>

    {formData.shippingAvailable && (
      <div className="pf-row" style={{ marginTop: "16px" }}>
        <div className="pf-field">
          <label className="pf-label">მიწოდების ფასი</label>
          <div className="pf-input-group">
            <input
              type="number"
              name="shippingPrice"
              value={formData.shippingPrice}
              onChange={handleInputChange}
              onKeyDown={blockNonPositiveKeys}
              min={0}
              placeholder="0"
            />
            <span className="pf-input-group__suffix">₾</span>
          </div>
          {errors.shippingPrice && <span className="pf-error">{errors.shippingPrice}</span>}
        </div>
      </div>
    )}

    <div className="pf-row" style={{ marginTop: "16px" }}>
      <div className="pf-field">
        <label className="pf-label">ზომები</label>
        <input
          type="text"
          name="dimensions"
          value={formData.dimensions}
          onChange={handleInputChange}
          className="pf-input"
          placeholder="მაგ: 20×30×10 სმ"
        />
      </div>
      <div className="pf-field">
        <label className="pf-label">წონა</label>
        <div className="pf-input-group">
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            onKeyDown={blockNonPositiveKeys}
            min={0}
            step="0.1"
            placeholder="0.0"
            className={errors.weight ? "pf-input--error" : ""}
          />
          <span className="pf-input-group__suffix">კგ</span>
        </div>
        {errors.weight && <span className="pf-error">{errors.weight}</span>}
      </div>
    </div>
  </div>
);

export default ShippingSection;
