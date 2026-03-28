import TranslationForm from "@/components/translation/TranslationForm";
import NamespaceSidebar from "@/components/translation/NamespaceSidebar";
import TranslationList from "@/components/translation/TranslationList";
import useTranslation from "../../hooks/useTranslation";
import "./TranslationPage.scss";

export default function TranslationPage() {
  const { data, list, addForm, editForm, actions } = useTranslation();

  return (
    <div className="translation-page">
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
            className="add-btn"
            onClick={() => addForm.setIsAddMode(!addForm.isAddMode)}
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
              <button className="bulk-delete-btn" onClick={actions.handleBulkDelete}>
                წაშლა ({list.selectedIds.length})
              </button>
            )}
          </div>

          {data.loading ? (
            <div className="loading">იტვირთება...</div>
          ) : data.error ? (
            <div className="error">{data.error}</div>
          ) : list.filteredKeys.length === 0 ? (
            <div className="no-data">თარგმანები ვერ მოიძებნა</div>
          ) : (
            <>
              <TranslationList
                filteredKeys={list.filteredKeys}
                translations={list.currentNamespaceTranslations}
                rawTranslations={data.rawTranslations}
                activeNamespace={list.activeNamespace}
                editingId={editForm.editingId}
                editGe={editForm.editGe}
                setEditGe={editForm.setEditGe}
                editEn={editForm.editEn}
                setEditEn={editForm.setEditEn}
                onEdit={editForm.startEditing}
                onSave={editForm.onSubmit}
                onCancel={() => editForm.setEditingId(null)}
                onDelete={actions.handleDeleteTranslation}
                selectedIds={list.selectedIds}
                onSelectChange={actions.handleSelectChange}
                onSelectAll={actions.handleSelectAll}
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
