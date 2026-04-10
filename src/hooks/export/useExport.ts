import { useState } from "react";
import { toast } from "react-toastify";
import { getTranslationsRequest } from "@/apiCalls/translationApiCalls/translation.req";
import { getRolesRequest } from "@/apiCalls/roleApiCalls/role.req";
import { getPermissionsRequest } from "@/apiCalls/roleApiCalls/permission.req";
import { getMenuItemsRequest } from "@/apiCalls/menuApiCalls/menu.req";
import { exportToExcel } from "@/utils/exportUtils";

export default function useExport() {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    translations: false,
    roles: false,
    permissions: false,
    menu: false,
  });

  const handleExportTranslations = async () => {
    setLoading((prev) => ({ ...prev, translations: true }));
    try {
      const response = await getTranslationsRequest({ limit: 10000 });
      if (response.success && response.data.raw) {
        const exportData = (
          response.data.raw as {
            namespace: string;
            key: string;
            translations: { ge: string; en: string };
          }[]
        ).map((item) => ({
          Namespace: item.namespace,
          Key: item.key,
          Georgian: item.translations.ge,
          English: item.translations.en,
        }));
        exportToExcel(exportData, "translations_export", "Translations");
        toast.success("Translations exported successfully");
      }
    } catch {
      toast.error("Failed to export translations");
    } finally {
      setLoading((prev) => ({ ...prev, translations: false }));
    }
  };

  const handleExportRoles = async () => {
    setLoading((prev) => ({ ...prev, roles: true }));
    try {
      const roles = await getRolesRequest();
      const exportData = roles.map((role) => ({
        Name: role.name,
        Description: role.description,
        Permissions: (role.permissions || [])
          .map((p: { name: string }) => p.name)
          .join(", "),
        "Allowed Panels": (role.allowedPanels || []).join(", "),
        Active: role.isActive ? "Yes" : "No",
      }));
      exportToExcel(exportData, "roles_export", "Roles");
      toast.success("Roles exported successfully");
    } catch {
      toast.error("Failed to export roles");
    } finally {
      setLoading((prev) => ({ ...prev, roles: false }));
    }
  };

  const handleExportPermissions = async () => {
    setLoading((prev) => ({ ...prev, permissions: true }));
    try {
      const permissions = await getPermissionsRequest();
      const exportData = permissions.map((perm) => ({
        Category: perm.category,
        Name: perm.name,
        Description: perm.description,
      }));
      exportToExcel(exportData, "permissions_export", "Permissions");
      toast.success("Permissions exported successfully");
    } catch {
      toast.error("Failed to export permissions");
    } finally {
      setLoading((prev) => ({ ...prev, permissions: false }));
    }
  };

  const handleExportMenu = async () => {
    setLoading((prev) => ({ ...prev, menu: true }));
    try {
      const menuItems = await getMenuItemsRequest();
      const exportData = menuItems.map((item) => ({
        Order: item.order,
        "Label (KA)": item.label.ka,
        "Label (EN)": item.label.en,
        Link: item.href,
        Status: item.isActive ? "Active" : "Inactive",
      }));
      exportToExcel(exportData, "menu_export", "Menu");
      toast.success("Menu items exported successfully");
    } catch {
      toast.error("Failed to export menu items");
    } finally {
      setLoading((prev) => ({ ...prev, menu: false }));
    }
  };

  return {
    loading,
    actions: {
      handleExportTranslations,
      handleExportRoles,
      handleExportPermissions,
      handleExportMenu,
    },
  };
}
