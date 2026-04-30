import "./CategoryAddModal.scss";
import type { CategoryFormValues, CategoryFormErrors } from "@/types/category.types";

interface CategoryAddModalProps {
  formData: CategoryFormValues;
  errors: CategoryFormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function CategoryAddModal({
  formData,
  errors,
  onChange,
  onSubmit,
  onClose,
}: CategoryAddModalProps) {
  return (
    <div className="category-modal-overlay" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="category-modal__title">კატეგორიის დამატება</h2>
        <form className="category-modal__form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="slug">სლაგი *</label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={onChange}
              placeholder="mag. woodwork"
            />
            {errors.slug && <span className="field-error">{errors.slug}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nameGe">სახელი (ქართ.) *</label>
            <input
              id="nameGe"
              type="text"
              value={formData.nameGe}
              onChange={onChange}
              placeholder="ხის ნაკეთობები"
            />
            {errors.nameGe && <span className="field-error">{errors.nameGe}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nameEn">Name (EN) *</label>
            <input
              id="nameEn"
              type="text"
              value={formData.nameEn}
              onChange={onChange}
              placeholder="Woodwork"
            />
            {errors.nameEn && <span className="field-error">{errors.nameEn}</span>}
          </div>

          <div className="category-modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              გაუქმება
            </button>
            <button type="submit" className="btn-primary">
              შენახვა
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
