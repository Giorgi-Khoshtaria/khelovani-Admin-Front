import "./CategoryTable.scss";
import CategoryTableRow from "./CategoryTableRow";
import type { Category, CategoryFormValues, CategoryFormErrors } from "@/types/category.types";

interface CategoryTableProps {
  categories: Category[];
  editingId: string | null;
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

export default function CategoryTable({
  categories,
  editingId,
  editDraft,
  editErrors,
  onEditDraftChange,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onDelete,
  onToggleActive,
  onPin,
}: CategoryTableProps) {
  return (
    <table className="category-table">
      <thead className="category-table__head">
        <tr>
          <th>სლაგი</th>
          <th>სახელი (ქართ.)</th>
          <th>Name (EN)</th>
          <th>სტატუსი</th>
          <th>მოქმედებები</th>
        </tr>
      </thead>
      <tbody>
        {categories.length === 0 ? (
          <tr>
            <td colSpan={5} className="category-table__empty">
              კატეგორიები არ მოიძებნა
            </td>
          </tr>
        ) : (
          categories.map((cat) => (
            <CategoryTableRow
              key={cat._id}
              category={cat}
              isEditing={editingId === cat._id}
              editDraft={editDraft}
              editErrors={editErrors}
              onEditDraftChange={onEditDraftChange}
              onStartEdit={onStartEdit}
              onCommitEdit={onCommitEdit}
              onCancelEdit={onCancelEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              onPin={onPin}
            />
          ))
        )}
      </tbody>
    </table>
  );
}
