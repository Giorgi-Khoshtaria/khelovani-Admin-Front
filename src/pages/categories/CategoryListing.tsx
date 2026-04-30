import "./CategoryListing.scss";
import useCategoryManagement from "@/hooks/categories/useCategoryManagement";
import CategoryTable from "@/components/categories/CategoryTable";
import CategoryAddModal from "@/components/categories/CategoryAddModal";
import type { CategoryFormValues } from "@/types/category.types";

export default function CategoryListing() {
  const {
    categories,
    loading,
    isAddModalOpen,
    setIsAddModalOpen,
    addForm,
    editingId,
    editDraft,
    editErrors,
    setEditDraft,
    startEdit,
    cancelEdit,
    commitEdit,
    handleAddSubmit,
    handleDelete,
    handleToggleActive,
    handlePin,
  } = useCategoryManagement();

  const handleEditDraftChange = (field: keyof CategoryFormValues, value: string) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="category-listing">
      <div className="page-header">
        <h1>კატეგორიები</h1>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + კატეგორიის დამატება
        </button>
      </div>

      {loading ? (
        <div className="loading">იტვირთება...</div>
      ) : (
        <CategoryTable
          categories={categories}
          editingId={editingId}
          editDraft={editDraft}
          editErrors={editErrors}
          onEditDraftChange={handleEditDraftChange}
          onStartEdit={startEdit}
          onCommitEdit={commitEdit}
          onCancelEdit={cancelEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onPin={handlePin}
        />
      )}

      {isAddModalOpen && (
        <CategoryAddModal
          formData={addForm.formData}
          errors={addForm.errors}
          onChange={addForm.handleChange}
          onSubmit={handleAddSubmit}
          onClose={() => {
            setIsAddModalOpen(false);
            addForm.setFormData({ slug: "", nameGe: "", nameEn: "" });
            addForm.setErrors({});
          }}
        />
      )}
    </div>
  );
}
