import React from "react";
import type { MenuItem } from "@/apiCalls/menuApiCalls/menu.req";
import "./MenuModal.scss";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingItem: MenuItem | null;
  form: {
    labelKa: string;
    labelEn: string;
    href: string;
    order: number;
    isActive: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  isSaving: boolean;
}

export function MenuModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  form,
  onChange,
  errors,
  isSaving,
}: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{editingItem ? "ელემენტის რედაქტირება" : "ელემენტის დამატება"}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>სახელი (ქართული)</label>
            <input
              name="labelKa"
              value={form.labelKa}
              onChange={onChange}
              placeholder="მთავარი"
              className={errors.labelKa ? "input-error" : ""}
            />
            {errors.labelKa && <span className="error-text">{errors.labelKa}</span>}
          </div>
          <div className="form-group">
            <label>სახელი (ინგლისური)</label>
            <input
              name="labelEn"
              value={form.labelEn}
              onChange={onChange}
              placeholder="Home"
              className={errors.labelEn ? "input-error" : ""}
            />
            {errors.labelEn && <span className="error-text">{errors.labelEn}</span>}
          </div>
          <div className="form-group">
            <label>ლინკი (href)</label>
            <input
              name="href"
              value={form.href}
              onChange={onChange}
              placeholder="/about"
              className={errors.href ? "input-error" : ""}
            />
            {errors.href && <span className="error-text">{errors.href}</span>}
          </div>
          <div className="form-group">
            <label>რიგითობა (order)</label>
            <input
              name="order"
              type="number"
              value={form.order}
              onChange={onChange}
              min={0}
              className={errors.order ? "input-error" : ""}
            />
            {errors.order && <span className="error-text">{errors.order}</span>}
          </div>
          <div className="form-group form-group--checkbox">
            <label>
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={onChange}
              />
              <span>აქტიური</span>
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
            >
              გაუქმება
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? "ინახება..." : "შენახვა"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
