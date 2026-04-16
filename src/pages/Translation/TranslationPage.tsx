import TranslationForm from "@/components/translation/TranslationForm";
import NamespaceSidebar from "@/components/translation/NamespaceSidebar";
import TranslationList from "@/components/translation/TranslationList";
import TranslationEditModal from "@/components/translation/TranslationEditModal";
import useTranslation from "../../hooks/translations/useTranslation";
import "./TranslationPage.scss";

export default function TranslationPage() {
  const { data, list, addForm, editForm, actions } = useTranslation();

  return (
    <div className="translation-page">
      {/* ... prev header code ... */}
      <TranslationEditModal
        isOpen={!!editForm.editingId}
        onClose={editForm.onCancel}
        onSave={editForm.onSubmit}
        data={{
          id: editForm.editingId,
          ge: editForm.editGe,
          en: editForm.editEn,
          key: editForm.editKey,
          namespace: editForm.editNamespace,
          errors: editForm.editErrors,
        }}
        setGe={editForm.setEditGe}
        setEn={editForm.setEditEn}
        setKey={editForm.setEditKey}
        setNamespace={editForm.setEditNamespace}
        namespaces={data.namespaces}
      />

      <div className="page-header">
        <h1>თარგმანების მართვა</h1>
        <div className="header-actions">
          <label className="import-btn">
            Excel იმპორტი
            <input
              type="file"
              accept=".xlsx"
              onChange={actions.handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
          <button
            className="add-btn add-toggle-btn"
            onClick={addForm.toggleAddMode}
          >
            {addForm.isAddMode ? "გაუქმება" : "ახალი გასაღები"}
          </button>
        </div>
      </div>

      {addForm.isAddMode && (
        <TranslationForm form={addForm} namespaces={data.namespaces} />
      )}

      <div className="content-container">
        <NamespaceSidebar
          namespaces={data.namespaces}
          activeNamespace={list.activeNamespace}
          setActiveNamespace={actions.setActiveNamespace}
        />

        <div className="main-content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="ძებნა გასაღებით..."
              value={list.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
            />
            {list.selectedIds.length > 0 && (
              <button
                className="bulk-delete-btn"
                onClick={actions.handleBulkDelete}
              >
                წაშლა ({list.selectedIds.length})
              </button>
            )}
          </div>

          {data.loading ? (
            <div className="loading">იტვირთება...</div>
          ) : data.error ? (
            <div className="error">{data.error}</div>
          ) : list.items.length === 0 ? (
            <div className="no-data">თარგმანები ვერ მოიძებნა</div>
          ) : (
            <>
              <TranslationList
                items={list.items}
                onEdit={editForm.startEditing}
                onDelete={actions.handleDeleteTranslation}
                selectedIds={list.selectedIds}
                onSelectChange={actions.handleSelectChange}
                onSelectAll={actions.handleSelectAll}
                namespaces={data.namespaces}
              />

              {list.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={list.currentPage === 1}
                    onClick={() => list.setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    წინა
                  </button>
                  <span className="page-info">
                    გვერდი {list.currentPage} / {list.totalPages}
                  </span>
                  <button
                    disabled={list.currentPage === list.totalPages}
                    onClick={() => list.setCurrentPage((p) => Math.min(list.totalPages, p + 1))}
                  >
                    შემდეგი
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
