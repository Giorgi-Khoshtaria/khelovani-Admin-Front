import { useInformationFields } from "@/hooks/informationFields/useInformationFields";
import InformationFieldsHeader from "@/components/informationFields/InformationFieldsHeader";
import InformationFieldsFilters from "@/components/informationFields/InformationFieldsFilters";
import InformationFieldsTable from "@/components/informationFields/InformationFieldsTable";
import InformationFieldsPagination from "@/components/informationFields/InformationFieldsPagination";
import InformationFieldFormModal from "@/components/informationFields/InformationFieldFormModal";
import ConfirmDeleteModal from "@/components/informationFields/ConfirmDeleteModal";
import "./InformationFieldsPage.scss";

export default function InformationFieldsPage() {
  const {
    fields,
    meta,
    loading,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    page,
    setPage,
    showModal,
    editing,
    submitting,
    openCreate,
    openEdit,
    closeModal,
    submit,
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useInformationFields();

  return (
    <div className="info-fields-page">
      <InformationFieldsHeader count={meta.totalCount} onAdd={openCreate} />

      <InformationFieldsFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      {loading ? (
        <div className="info-fields-page__loading">იტვირთება...</div>
      ) : fields.length === 0 ? (
        <div className="info-fields-page__empty">
          <p>ჩანაწერები ვერ მოიძებნა</p>
          <button onClick={openCreate}>+ დაამატე პირველი ველი</button>
        </div>
      ) : (
        <>
          <InformationFieldsTable
            fields={fields}
            onEdit={openEdit}
            onDelete={requestDelete}
          />
          <InformationFieldsPagination
            page={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {showModal && (
        <InformationFieldFormModal
          field={editing}
          submitting={submitting}
          onClose={closeModal}
          onSubmit={submit}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          field={deleting}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
