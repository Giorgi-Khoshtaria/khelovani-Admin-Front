import { useState, useEffect, useCallback } from "react";
import {
  getUsersRequest,
  deleteUserRequest,
  bulkDeleteUsersRequest,
} from "@/apiCalls/userApiCalls/user.req";
import { toast } from "react-toastify";
import type { User } from "@/types/user.types";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/utils/handleApiError";

export const useUserListing = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isVerified, setIsVerified] = useState<"true" | "false" | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const limit = 10;

  const fetchUsers = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const result = await getUsersRequest({
          search: debouncedSearch || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          isVerified: (isVerified as "true" | "false") || undefined,
          page: currentPage,
          limit,
        });
        setUsers(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
        setTotalCount(result.meta?.totalCount || 0);
        setSelectedIds(new Set());
      } catch (err) {
        toast.error(getErrorMessage(err, "შეცდომა მომხმარებლების ჩატვირთვისას"));
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [debouncedSearch, dateFrom, dateTo, isVerified, currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, dateFrom, dateTo, isVerified]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId: string) => {
    if (
      !window.confirm(
        "ნამდვილად გსურთ მომხმარებლის წაშლა? / Are you sure you want to delete this user?",
      )
    )
      return;
    try {
      await deleteUserRequest(userId);
      toast.success("მომხმარებელი წარმატებით წაიშალა");
      fetchUsers(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "შეცდომა მომხმარებლის წაშლისას"));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (
      !window.confirm(
        `ნამდვილად გსურთ ${selectedIds.size} მომხმარებლის წაშლა? / Delete ${selectedIds.size} users?`,
      )
    )
      return;
    try {
      await bulkDeleteUsersRequest(Array.from(selectedIds));
      toast.success(`${selectedIds.size} მომხმარებელი წარმატებით წაიშალა`);
      fetchUsers(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "შეცდომა მომხმარებლების წაშლისას"));
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setIsVerified("");
    setCurrentPage(1);
  };

  const allSelected = users.length > 0 && selectedIds.size === users.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < users.length;

  return {
    users,
    loading,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isVerified,
    setIsVerified,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    selectedIds,
    allSelected,
    someSelected,
    toggleSelect,
    toggleSelectAll,
    handleDelete,
    handleBulkDelete,
    clearFilters,
  };
};
