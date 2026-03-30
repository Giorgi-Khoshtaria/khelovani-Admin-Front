import { useEffect, useState, useCallback } from "react";
import {
  getRolesRequest,
  createRoleRequest,
  deleteRoleRequest,
} from "@/apiCalls/roleApiCalls/role.req";
import {
  getPermissionsRequest,
  createPermissionRequest,
  updatePermissionRequest,
  deletePermissionRequest,
} from "@/apiCalls/roleApiCalls/permission.req";
import type { Role, Permission } from "@/types/role.types";
import { useFormHandler } from "@/hooks/utils/useFormHandler";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { getErrorMessage } from "@/utils/handleApiError";
import { toast } from "react-toastify";

export default function useRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [loading, setLoading] = useState(true);

  // Search, Filter & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "category">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [isPermEditModalOpen, setIsPermEditModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );

  // Forms
  const roleFormHandler = useFormHandler({ name: "", description: "" });
  const permFormHandler = useFormHandler({
    name: "",
    description: "",
    category: "General",
  });
  const editPermFormHandler = useFormHandler({
    name: "",
    description: "",
    category: "General",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "roles") {
        const data = await getRolesRequest();
        setRoles(data);
      } else {
        const data = await getPermissionsRequest(
          debouncedSearchQuery,
          selectedCategory,
          sortField,
          sortOrder,
        );
        setPermissions(data);
      }
    } catch {
      toast.error("მონაცემების ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearchQuery, selectedCategory, sortField, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoleRequest(roleFormHandler.formData);
      setIsRoleModalOpen(false);
      roleFormHandler.setFormData({ name: "", description: "" });
      toast.success("როლი წარმატებით შეიქმნა");
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "როლი ვერ შეიქმნა"));
    }
  };

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPermissionRequest(permFormHandler.formData);
      setIsPermModalOpen(false);
      permFormHandler.setFormData({
        name: "",
        description: "",
        category: "General",
      });
      toast.success("უფლება წარმატებით შეიქმნა");
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "უფლება ვერ შეიქმნა"));
    }
  };

  const handleOpenEditPermissionModal = (perm: Permission) => {
    setEditingPermission(perm);
    editPermFormHandler.setFormData({
      name: perm.name,
      description: perm.description,
      category: perm.category || "General",
    });
    setIsPermEditModalOpen(true);
  };

  const handleUpdatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPermission) return;
    try {
      await updatePermissionRequest(
        editingPermission._id,
        editPermFormHandler.formData,
      );
      setIsPermEditModalOpen(false);
      setEditingPermission(null);
      toast.success("უფლება წარმატებით განახლდა");
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "უფლება ვერ განახლდა"));
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ როლის წაშლა?")) return;
    try {
      await deleteRoleRequest(id);
      toast.success("როლი წარმატებით წაიშალა");
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    }
  };

  const handleSort = (field: "name" | "category") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDeletePermission = async (id: string) => {
    if (!window.confirm("წაშლა?")) return;
    try {
      await deletePermissionRequest(id);
      toast.success("უფლება წარმატებით წაიშალა");
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    }
  };

  return {
    data: { roles, permissions, loading },
    list: {
      activeTab,
      searchQuery,
      selectedCategory,
      sortField,
      sortOrder,
    },
    modals: {
      isRoleModalOpen,
      isPermModalOpen,
      isPermEditModalOpen,
      setIsRoleModalOpen,
      setIsPermModalOpen,
      setIsPermEditModalOpen,
    },
    forms: {
      roleFormHandler,
      permFormHandler,
      editPermFormHandler,
    },
    actions: {
      setActiveTab,
      setSearchQuery,
      setSelectedCategory,
      handleSort,
      handleCreateRole,
      handleCreatePermission,
      handleOpenEditPermissionModal,
      handleUpdatePermission,
      handleDeleteRole,
      handleDeletePermission,
      loadData,
    },
  };
}
