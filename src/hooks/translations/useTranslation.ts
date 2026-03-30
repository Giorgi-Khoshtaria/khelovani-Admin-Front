import { useEffect, useState } from "react";
import useTranslationData from "./useTranslationData";
import useAddTranslationForm from "./useAddTranslationForm";
import useEditTranslationForm from "./useEditTranslationForm";
import { getErrorMessage } from "@/utils/handleApiError";
import { parseExcelTranslations } from "@/utils/translationUtils";
import {
  bulkTranslationRequest,
  deleteTranslationRequest,
  bulkDeleteTranslationRequest,
} from "@/apiCalls/translationApiCalls/translation.req";

export default function useTranslation() {
  const {
    translations,
    rawTranslations,
    namespaces,
    totalCount,
    totalPages,
    loading,
    error,
    fetchData,
  } = useTranslationData();

  const [activeNamespace, setActiveNamespace] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastError, setToastError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const clearToastError = () => setToastError(null);


  const handleSuccess = () => {
    fetchData({ 
      search: searchQuery || undefined, 
      namespace: currentNamespace !== "all" ? currentNamespace : undefined,
      page: currentPage,
      limit: 15
    });
  };

  const handleError = (msg: string) => {
    setToastError(msg);
  };

  const currentNamespace =
    activeNamespace === "all" && namespaces.length > 0
      ? namespaces[0]._id
      : activeNamespace;

  const addFormHook = useAddTranslationForm(
    currentNamespace,
    handleSuccess,
    handleError,
  );
  const editFormHook = useEditTranslationForm(handleSuccess, handleError);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseExcelTranslations(file);
      const items = data
        .map((row) => ({
          namespace: row.Namespace || row.namespace || "",
          key: row.Key || row.key || "",
          ge: row.Georgian || row.ge || "",
          en: row.English || row.en || "",
        }))
        .filter((item) => item.namespace && item.key);

      if (items.length === 0) {
        setToastError("Excel ფაილი ცარიელია ან არასწორი ფორმატია");
        return;
      }

      await bulkTranslationRequest({ items });
      fetchData({ 
        search: searchQuery || undefined, 
        namespace: currentNamespace !== "all" ? currentNamespace : undefined,
        page: currentPage,
        limit: 15
      });
    } catch (err) {
      setToastError(getErrorMessage(err, "იმპორტის დროს დაფიქსირდა შეცდომა"));
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ ამ თარგმანის წაშლა?")) return;
    try {
      await deleteTranslationRequest(id);
      fetchData({ 
        search: searchQuery || undefined, 
        namespace: currentNamespace !== "all" ? currentNamespace : undefined,
        page: currentPage,
        limit: 15
      });
    } catch (err) {
      setToastError(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    }
  };

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleSelectAll = (ids: string[], checked: boolean) => {
    setSelectedIds((prev) =>
      checked
        ? Array.from(new Set([...prev, ...ids]))
        : prev.filter((id) => !ids.includes(id))
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`ნამდვილად გსურთ ${selectedIds.length} თარგმანის წაშლა?`)) return;

    try {
      await bulkDeleteTranslationRequest(selectedIds);
      setSelectedIds([]);
      fetchData({ 
        search: searchQuery || undefined, 
        namespace: currentNamespace !== "all" ? currentNamespace : undefined,
        page: currentPage,
        limit: 15
      });
    } catch (err) {
      setToastError(getErrorMessage(err, "ჯგუფური წაშლის დროს დაფიქსირდა შეცდომა"));
    }
  };

  // API fetch for search and namespace to handle filtration on backend
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData({ 
        search: searchQuery || undefined, 
        namespace: activeNamespace !== "all" ? activeNamespace : undefined,
        page: currentPage,
        limit: 15
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeNamespace, currentPage, fetchData]);

  const currentNamespaceTranslations = translations[currentNamespace] || {};
  // Backend filters already, so just extract keys directly
  const filteredKeys = Object.keys(currentNamespaceTranslations);

  return {
    data: {
      translations,
      rawTranslations,
      namespaces,
      loading,
      error,
    },
    list: {
      activeNamespace: currentNamespace,
      searchQuery,
      currentPage,
      setCurrentPage,
      totalCount,
      totalPages,
      filteredKeys,
      currentNamespaceTranslations,
      selectedIds,
    },
    addForm: {
      isAddMode: addFormHook.isAddMode,
      newKey: addFormHook.newKey,
      newGe: addFormHook.newGe,
      newEn: addFormHook.newEn,
      selectedNamespaceForAdd: addFormHook.selectedNamespaceForAdd,
      formErrors: addFormHook.formErrors,
      setNewKey: addFormHook.setNewKey,
      setNewGe: addFormHook.setNewGe,
      setNewEn: addFormHook.setNewEn,
      setSelectedNamespaceForAdd: addFormHook.setSelectedNamespaceForAdd,
      setIsAddMode: addFormHook.setIsAddMode,
      onSubmit: addFormHook.onSubmit,
    },
    editForm: {
      editingId: editFormHook.editingId,
      editGe: editFormHook.editGe,
      editEn: editFormHook.editEn,
      setEditGe: editFormHook.setEditGe,
      setEditEn: editFormHook.setEditEn,
      setEditingId: editFormHook.setEditingId,
      startEditing: editFormHook.start,
      onSubmit: editFormHook.submit,
    },
    actions: {
      setActiveNamespace: (val: string) => {
        setActiveNamespace(val);
        setCurrentPage(1);
      },
      setSearchQuery: (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
      },
      handleFileUpload,
      handleDeleteTranslation,
      handleSelectChange,
      handleSelectAll,
      handleBulkDelete,
      fetchData,
    },
    toastError,
    clearToastError,
  };
}
