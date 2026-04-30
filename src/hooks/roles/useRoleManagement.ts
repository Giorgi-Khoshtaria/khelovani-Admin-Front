import { useEffect, useState, useCallback } from "react";
import {
  getRolesRequest,
  createRoleRequest,
  deleteRoleRequest,
} from "@/apiCalls/roleApiCalls/role.req";
import {
  getPermissionsRequest,
  getPermissionCategoriesRequest,
  createPermissionRequest,
  updatePermissionRequest,
  deletePermissionRequest,
} from "@/apiCalls/roleApiCalls/permission.req";
import type { Role, Permission } from "@/types/role.types";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/utils/handleApiError";
import { toast } from "react-toastify";

export default function useRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [isPermEditModalOpen, setIsPermEditModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const [roleAllowedPanels, setRoleAllowedPanels] = useState<string[]>([]);

  const roleFormHandler = useFormHandler({ name: "", description: "" });
  const permFormHandler = useFormHandler({ name: "", description: "", category: "General" });
  const editPermFormHandler = useFormHandler({ name: "", description: "", category: "General" });

  const loadCategories = useCallback(async () => {
    try {
      const cats = await getPermissionCategoriesRequest();
      setCategories(cats);
    } catch {
      // non-critical
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "roles") {
        const { data } = await getRolesRequest();
        setRoles(data);
      } else {
        const { data } = await getPermissionsRequest(
          debouncedSearchQuery,
          selectedCategory === "all" ? undefined : selectedCategory,
        );
        setPermissions(data);
      }
    } catch {
      toast.error("მონაცემების ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearchQuery, selectedCategory]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleRoleAllowedPanelsChange = (panel: string) => {
    setRoleAllowedPanels((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel],
    );
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRoleRequest({ ...roleFormHandler.formData, allowedPanels: roleAllowedPanels });
      setIsRoleModalOpen(false);
      roleFormHandler.setFormData({ name: "", description: "" });
      setRoleAllowedPanels([]);
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
      permFormHandler.setFormData({ name: "", description: "", category: "General" });
      toast.success("უფლება წარმატებით შეიქმნა");
      await loadCategories();
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
      await updatePermissionRequest(editingPermission._id, editPermFormHandler.formData);
      setIsPermEditModalOpen(false);
      setEditingPermission(null);
      toast.success("უფლება წარმატებით განახლდა");
      await loadCategories();
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

  const handleDeletePermission = async (id: string) => {
    if (!window.confirm("წაშლა?")) return;
    try {
      await deletePermissionRequest(id);
      toast.success("უფლება წარმატებით წაიშალა");
      await loadCategories();
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    }
  };

  return {
    data: { roles, permissions, categories, loading },
    list: { activeTab, searchQuery, selectedCategory },
    modals: {
      isRoleModalOpen,
      isPermModalOpen,
      isPermEditModalOpen,
      setIsRoleModalOpen,
      setIsPermModalOpen,
      setIsPermEditModalOpen,
    },
    forms: { roleFormHandler, roleAllowedPanels, permFormHandler, editPermFormHandler },
    actions: {
      setActiveTab,
      setSearchQuery,
      setSelectedCategory,
      handleRoleAllowedPanelsChange,
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
