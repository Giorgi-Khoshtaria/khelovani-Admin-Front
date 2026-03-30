import useRoleManagement from "../../hooks/roles/useRoleManagement";
import "./RoleManagement.scss";
import { RoleRolesGrid } from "@/components/roles/RoleRolesGrid";
import { RolePermissionsTable } from "@/components/roles/RolePermissionsTable";
import { RoleModals } from "@/components/roles/RoleModals";

export default function RoleManagement() {
  const { data, list, modals, forms, actions } = useRoleManagement();

  const { roles, permissions, loading } = data;
  const { activeTab, searchQuery, selectedCategory, sortField, sortOrder } = list;
  const { 
    isRoleModalOpen, 
    isPermModalOpen, 
    isPermEditModalOpen, 
    setIsRoleModalOpen, 
    setIsPermModalOpen, 
    setIsPermEditModalOpen 
  } = modals;
  const { roleFormHandler, permFormHandler, editPermFormHandler } = forms;
  const {
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
  } = actions;

  if (loading) return <div className="loading">იტვირთება...</div>;

  return (
    <div className="role-management">
      <div className="page-header">
        <h1>როლები და უფლებები</h1>
        {activeTab === "roles" ? (
          <button
            className="btn-primary"
            onClick={() => setIsRoleModalOpen(true)}
          >
            + ახალი როლი
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => setIsPermModalOpen(true)}
          >
            + ახალი უფლება
          </button>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab-item ${activeTab === "roles" ? "active" : ""}`}
          onClick={() => setActiveTab("roles")}
        >
          როლები
        </button>
        <button
          className={`tab-item ${activeTab === "permissions" ? "active" : ""}`}
          onClick={() => setActiveTab("permissions")}
        >
          უფლებების სია
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "roles" ? (
          <RoleRolesGrid roles={roles} onDeleteRole={handleDeleteRole} />
        ) : (
          <RolePermissionsTable
            permissions={permissions}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEditPermission={handleOpenEditPermissionModal}
            onDeletePermission={handleDeletePermission}
          />
        )}
      </div>

      <RoleModals
        isRoleModalOpen={isRoleModalOpen}
        setIsRoleModalOpen={setIsRoleModalOpen}
        isPermModalOpen={isPermModalOpen}
        setIsPermModalOpen={setIsPermModalOpen}
        isPermEditModalOpen={isPermEditModalOpen}
        setIsPermEditModalOpen={setIsPermEditModalOpen}
        roleForm={roleFormHandler}
        permForm={permFormHandler}
        editPermForm={editPermFormHandler}
        onCreateRole={handleCreateRole}
        onCreatePermission={handleCreatePermission}
        onUpdatePermission={handleUpdatePermission}
      />
    </div>
  );
}
