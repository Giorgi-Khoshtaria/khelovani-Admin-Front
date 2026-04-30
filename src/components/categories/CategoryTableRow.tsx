import "./CategoryTableRow.scss";
import type { Category, CategoryFormValues, CategoryFormErrors } from "@/types/category.types";

interface CategoryTableRowProps {
  category: Category;
  isEditing: boolean;
  editDraft: CategoryFormValues;
  editErrors: CategoryFormErrors;
  onEditDraftChange: (field: keyof CategoryFormValues, value: string) => void;
  onStartEdit: (cat: Category) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (cat: Category) => void;
  onToggleActive: (cat: Category) => void;
  onPin: (cat: Category) => void;
}

function EyeOpen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function CategoryTableRow({
  category,
  isEditing,
  editDraft,
  editErrors,
  onEditDraftChange,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onDelete,
  onToggleActive,
  onPin,
}: CategoryTableRowProps) {
  if (isEditing) {
    return (
      <tr>
        <td className="category-row__cell">
          <input
            className={`category-row__input${editErrors.slug ? " category-row__input--error" : ""}`}
            value={editDraft.slug}
            onChange={(e) => onEditDraftChange("slug", e.target.value)}
          />
          {editErrors.slug && (
            <span className="category-row__field-error">{editErrors.slug}</span>
          )}
        </td>
        <td className="category-row__cell">
          <input
            className={`category-row__input${editErrors.nameGe ? " category-row__input--error" : ""}`}
            value={editDraft.nameGe}
            onChange={(e) => onEditDraftChange("nameGe", e.target.value)}
          />
          {editErrors.nameGe && (
            <span className="category-row__field-error">{editErrors.nameGe}</span>
          )}
        </td>
        <td className="category-row__cell">
          <input
            className={`category-row__input${editErrors.nameEn ? " category-row__input--error" : ""}`}
            value={editDraft.nameEn}
            onChange={(e) => onEditDraftChange("nameEn", e.target.value)}
          />
          {editErrors.nameEn && (
            <span className="category-row__field-error">{editErrors.nameEn}</span>
          )}
        </td>
        <td className="category-row__cell">
          <span className={`category-row__badge category-row__badge--${category.isActive ? "active" : "inactive"}`}>
            {category.isActive ? "აქტიური" : "გამორთული"}
          </span>
        </td>
        <td className="category-row__cell">
          <div className="category-row__actions">
            <button className="btn-primary" style={{ fontSize: 13 }} onClick={onCommitEdit}>
              შენახვა
            </button>
            <button className="btn-secondary" style={{ fontSize: 13 }} onClick={onCancelEdit}>
              გაუქმება
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={category.isPinned ? "pinned" : ""}>
      <td className="category-row__cell">{category.slug}</td>
      <td className="category-row__cell">{category.nameGe}</td>
      <td className="category-row__cell">{category.nameEn}</td>
      <td className="category-row__cell">
        <span className={`category-row__badge category-row__badge--${category.isActive ? "active" : "inactive"}`}>
          {category.isActive ? "აქტიური" : "გამორთული"}
        </span>
      </td>
      <td className="category-row__cell">
        <div className="category-row__actions">
          <button
            className={`category-row__action-btn category-row__pin-btn${category.isPinned ? " active" : ""}`}
            onClick={() => onPin(category)}
            title={category.isPinned ? "პინის მოხსნა" : "პინი"}
          >
            {category.isPinned ? "📌" : "📍"}
          </button>
          <button
            className="category-row__icon-btn"
            title="რედაქტირება"
            onClick={() => onStartEdit(category)}
          >
            ✏️
          </button>
          <button
            className={`category-row__action-btn category-row__toggle-btn ${category.isActive ? "is-visible" : "is-hidden-state"}`}
            onClick={() => onToggleActive(category)}
            title={category.isActive ? "დამალვა" : "გამოჩენა"}
          >
            {category.isActive ? <EyeOpen /> : <EyeOff />}
          </button>
          <button
            className="category-row__icon-btn category-row__icon-btn--danger"
            title="წაშლა"
            onClick={() => onDelete(category)}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}
