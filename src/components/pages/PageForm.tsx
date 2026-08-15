import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadPageImageRequest } from "@/apiCalls/pageApiCalls/page.req";
import { getErrorMessage } from "@/utils/handleApiError";
import "./PageForm.scss";

export interface PageFormState {
  path: string;
  titleKa: string;
  titleEn: string;
  descriptionKa: string;
  descriptionEn: string;
  ogImage: string;
  noindex: boolean;
  showInNav: boolean;
  navLabelKa: string;
  navLabelEn: string;
  navOrder: number;
}

interface PageFormProps {
  form: PageFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  errors: Record<string, string>;
  isSaving: boolean;
}

export function PageForm({
  form,
  onChange,
  onImageChange,
  onSubmit,
  onCancel,
  errors,
  isSaving,
}: PageFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setIsUploading(true);
    try {
      const url = await uploadPageImageRequest(file);
      onImageChange(url);
    } catch (err) {
      toast.error(getErrorMessage(err, "სურათის ატვირთვა ვერ მოხერხდა"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="page-form" onSubmit={onSubmit} noValidate>
      <div className="pf-card">
        <div className="form-group">
          <label>მისამართი (path)</label>
          <input
            name="path"
            value={form.path}
            onChange={onChange}
            placeholder="/about"
            className={errors.path ? "input-error" : ""}
          />
          {errors.path && <span className="error-text" data-testid="error-path">{errors.path}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>სათაური (ქართული)</label>
            <input
              name="titleKa"
              value={form.titleKa}
              onChange={onChange}
              placeholder="ჩვენს შესახებ"
              className={errors.titleKa ? "input-error" : ""}
            />
            {errors.titleKa && <span className="error-text" data-testid="error-titleKa">{errors.titleKa}</span>}
          </div>

          <div className="form-group">
            <label>სათაური (ინგლისური)</label>
            <input
              name="titleEn"
              value={form.titleEn}
              onChange={onChange}
              placeholder="About Us"
              className={errors.titleEn ? "input-error" : ""}
            />
            {errors.titleEn && <span className="error-text" data-testid="error-titleEn">{errors.titleEn}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>აღწერა (ქართული)</label>
            <textarea
              name="descriptionKa"
              value={form.descriptionKa}
              onChange={onChange}
              rows={3}
              className={errors.descriptionKa ? "input-error" : ""}
            />
            {errors.descriptionKa && (
              <span className="error-text" data-testid="error-descriptionKa">{errors.descriptionKa}</span>
            )}
          </div>

          <div className="form-group">
            <label>აღწერა (ინგლისური)</label>
            <textarea
              name="descriptionEn"
              value={form.descriptionEn}
              onChange={onChange}
              rows={3}
              className={errors.descriptionEn ? "input-error" : ""}
            />
            {errors.descriptionEn && (
              <span className="error-text" data-testid="error-descriptionEn">{errors.descriptionEn}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>OG სურათი</label>
          {form.ogImage && (
            <div className="og-preview">
              <img src={form.ogImage} alt="OG preview" />
              <button
                type="button"
                className="og-preview__remove"
                onClick={() => onImageChange("")}
                aria-label="remove"
              >
                ×
              </button>
            </div>
          )}
          <label className="upload-zone" htmlFor="page-og-image">
            <span>{isUploading ? "იტვირთება..." : "სურათის ასატვირთად დააჭირეთ"}</span>
            <input
              id="page-og-image"
              type="file"
              accept="image/*"
              onChange={handleFilePicked}
              disabled={isUploading}
              className="upload-zone__input"
            />
          </label>
        </div>

        <div className="form-group form-group--checkbox">
          <label>
            <input
              name="noindex"
              type="checkbox"
              checked={form.noindex}
              onChange={onChange}
            />
            <span>დამალვა საძიებო სისტემებისგან (noindex)</span>
          </label>
        </div>

        <div className="form-group form-group--checkbox">
          <label>
            <input
              name="showInNav"
              type="checkbox"
              checked={form.showInNav}
              onChange={onChange}
            />
            <span>ნავიგაციაში ჩვენება</span>
          </label>
        </div>

        {form.showInNav && (
          <div className="nav-fields">
            <div className="form-row">
              <div className="form-group">
                <label>ბმულის ტექსტი (ქართული)</label>
                <input
                  name="navLabelKa"
                  value={form.navLabelKa}
                  onChange={onChange}
                  placeholder="ჩვენს შესახებ"
                  maxLength={20}
                  className={errors.navLabelKa ? "input-error" : ""}
                />
                {errors.navLabelKa && (
                  <span className="error-text" data-testid="error-navLabelKa">{errors.navLabelKa}</span>
                )}
              </div>

              <div className="form-group">
                <label>ბმულის ტექსტი (ინგლისური)</label>
                <input
                  name="navLabelEn"
                  value={form.navLabelEn}
                  onChange={onChange}
                  placeholder="About Us"
                  maxLength={20}
                  className={errors.navLabelEn ? "input-error" : ""}
                />
                {errors.navLabelEn && (
                  <span className="error-text" data-testid="error-navLabelEn">{errors.navLabelEn}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>რიგითობა ნავიგაციაში</label>
              <input
                name="navOrder"
                type="number"
                value={form.navOrder}
                onChange={onChange}
                min={0}
                className={errors.navOrder ? "input-error" : ""}
              />
              {errors.navOrder && (
                <span className="error-text" data-testid="error-navOrder">{errors.navOrder}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-outline" onClick={onCancel}>
          გაუქმება
        </button>
        <button type="submit" className="btn-primary" disabled={isSaving || isUploading}>
          {isSaving ? "ინახება..." : "შენახვა"}
        </button>
      </div>
    </form>
  );
}
