import { useEffect, useState } from "react";
import useTranslationData from "./useTranslationData";
import useAddTranslationForm from "./useAddTranslationForm";
import useEditTranslationForm from "./useEditTranslationForm";
import { toast } from "react-toastify";
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSuccess = (message: string = "წარმატებით შესრულდა") => {
    toast.success(message);
    fetchData({
      search: searchQuery || undefined,
      namespace: activeNamespace !== "all" ? activeNamespace : undefined,
      page: currentPage,
      limit: 15,
    });
  };

  const handleError = (msg: string) => {
    toast.error(msg);
  };

  const defaultNamespace = namespaces.length > 0 ? namespaces[0]._id : "all";
  const currentNamespace =
    activeNamespace === "all" ? defaultNamespace : activeNamespace;

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
        toast.error("Excel ფაილი ცარიელია ან არასწორი ფორმატია");
        return;
      }

      await bulkTranslationRequest({ items });
      toast.success("იმპორტი წარმატებით დასრულდა");
      fetchData({
        search: searchQuery || undefined,
        namespace: activeNamespace !== "all" ? activeNamespace : undefined,
        page: currentPage,
        limit: 15,
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "იმპორტის დროს დაფიქსირდა შეცდომა"));
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ ამ თარგმანის წაშლა?")) return;
    try {
      await deleteTranslationRequest(id);
      toast.success("თარგმანი წარმატებით წაიშალა");
      fetchData({
        search: searchQuery || undefined,
        namespace: activeNamespace !== "all" ? activeNamespace : undefined,
        page: currentPage,
        limit: 15,
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    }
  };

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  };

  const handleSelectAll = (ids: string[], checked: boolean) => {
    setSelectedIds((prev) =>
      checked
        ? Array.from(new Set([...prev, ...ids]))
        : prev.filter((id) => !ids.includes(id)),
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(`ნამდვილად გსურთ ${selectedIds.length} თარგმანის წაშლა?`)
    )
      return;

    try {
      await bulkDeleteTranslationRequest(selectedIds);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} თარგმანი წარმატებით წაიშალა`);
      fetchData({
        search: searchQuery || undefined,
        namespace: activeNamespace !== "all" ? activeNamespace : undefined,
        page: currentPage,
        limit: 15,
      });
    } catch (err) {
      toast.error(
        getErrorMessage(err, "ჯგუფური წაშლის დროს დაფიქსირდა შეცდომა"),
      );
    }
  };

  // API fetch for search and namespace to handle filtration on backend
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData({
        search: searchQuery || undefined,
        namespace: activeNamespace !== "all" ? activeNamespace : undefined,
        page: currentPage,
        limit: 15,
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeNamespace, currentPage, fetchData]);

  // Backend filters already, so just use rawTranslations directly
  const items = rawTranslations;

  return {
    data: {
      translations,
      rawTranslations,
      namespaces,
      loading,
      error,
    },
    list: {
      activeNamespace: activeNamespace,
      searchQuery,
      currentPage,
      setCurrentPage,
      totalCount,
      totalPages,
      items,
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
      toggleAddMode: addFormHook.toggleAddMode,
      onSubmit: addFormHook.onSubmit,
    },
    editForm: {
      editingId: editFormHook.editingId,
      editGe: editFormHook.editGe,
      editEn: editFormHook.editEn,
      editKey: editFormHook.editKey,
      editNamespace: editFormHook.editNamespace,
      editErrors: editFormHook.editErrors,
      setEditGe: editFormHook.setEditGe,
      setEditEn: editFormHook.setEditEn,
      setEditKey: editFormHook.setEditKey,
      setEditNamespace: editFormHook.setEditNamespace,
      setEditingId: editFormHook.setEditingId,
      startEditing: editFormHook.start,
      onCancel: editFormHook.cancel,
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
  };
}
