import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createInformationFieldRequest,
  deleteInformationFieldRequest,
  getInformationFieldsRequest,
  updateInformationFieldRequest,
} from "@/apiCalls/informationFieldApiCalls/informationField.req";
import {
  InformationFieldType,
  type InformationField,
  type InformationFieldMeta,
  type InformationFieldPayload,
} from "@/types/informationField.types";

const PAGE_SIZE = 20;

const getErrorMessage = (err: unknown, fallback: string): string =>
  (err as { response?: { data?: { message?: string } } })?.response?.data
    ?.message || fallback;

/**
 * Owns all data + CRUD logic for the information fields page:
 * fetching, filtering, pagination, and create/update/delete flows.
 */
export function useInformationFields() {
  const [fields, setFields] = useState<InformationField[]>([]);
  const [meta, setMeta] = useState<InformationFieldMeta>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);

  const [search, setSearchValue] = useState("");
  const [typeFilter, setTypeFilterValue] = useState<
    InformationFieldType | "all"
  >("all");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<InformationField | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<InformationField | null>(null);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const { data, meta: m } = await getInformationFieldsRequest({
        search: search.trim() || undefined,
        type: typeFilter,
        page,
        limit: PAGE_SIZE,
      });
      setFields(data);
      setMeta(m);
    } catch (err) {
      console.error("Failed to load information fields:", err);
      toast.error("ინფორმაციის ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, page]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  // Filters reset pagination back to the first page.
  const setSearch = (next: string) => {
    setSearchValue(next);
    setPage(1);
  };

  const setTypeFilter = (next: InformationFieldType | "all") => {
    setTypeFilterValue(next);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (field: InformationField) => {
    setEditing(field);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const submit = async (payload: InformationFieldPayload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateInformationFieldRequest(editing._id, payload);
        toast.success("ველი განახლდა");
      } else {
        await createInformationFieldRequest(payload);
        toast.success("ველი დაემატა");
      }
      closeModal();
      fetchFields();
    } catch (err) {
      toast.error(getErrorMessage(err, "ვერ მოხერხდა შენახვა"));
    } finally {
      setSubmitting(false);
    }
  };

  const requestDelete = (field: InformationField) => setDeleting(field);
  const cancelDelete = () => setDeleting(null);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteInformationFieldRequest(deleting._id);
      toast.success("ველი წაიშალა");
      setDeleting(null);
      // If we removed the last row on a page, step back a page.
      if (fields.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchFields();
      }
    } catch (err) {
      console.error("Failed to delete information field:", err);
      toast.error("წაშლა ვერ მოხერხდა");
    }
  };

  return {
    // data
    fields,
    meta,
    loading,
    // filters / pagination
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    page,
    setPage,
    // create / edit modal
    showModal,
    editing,
    submitting,
    openCreate,
    openEdit,
    closeModal,
    submit,
    // delete
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
