import { Link } from "react-router-dom";
import useRoleManagement from "../../hooks/useRoleManagement";
import "./RoleManagement.scss";

export default function RoleManagement() {
  const { data, list, modals, forms, actions } = useRoleManagement();

  const { roles, permissions, loading } = data;
  const { activeTab, searchQuery, selectedCategory, sortField, sortOrder } = list;
  const { isRoleModalOpen, isPermModalOpen, isPermEditModalOpen, setIsRoleModalOpen, setIsPermModalOpen, setIsPermEditModalOpen } = modals;
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
          <div className="roles-grid">
            {roles.map((role) => (
              <div key={role._id} className="role-card">
                <div className="role-card__header">
                  <h3>{role.name}</h3>
                  <span
                    className={`status-dot ${role.isActive ? "active" : "inactive"}`}
                  ></span>
                </div>
                <p className="role-card__desc">{role.description}</p>
                <div className="role-card__footer">
                  <span className="count">
                    {role.permissions?.length || 0} უფლება
                  </span>
                  <div className="actions">
                    <Link to={`/roles/${role._id}`} className="btn-outline">
                      უფლებების მართვა
                    </Link>
                    {role.name !== "super_admin" && (
                      <button
                        className="btn-danger-sm"
                        onClick={() => handleDeleteRole(role._id)}
                      >
                        წაშლა
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="permissions-tab">
            <div className="tab-controls" style={{ gap: "0.75rem" }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
                style={{
                  padding: "0.6rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                <option value="all">ყველა კატეგორია</option>
                <option value="USERS">Users</option>
                <option value="ORGS">Orgs</option>
                <option value="ROLES">Roles</option>
                <option value="SETTINGS">Settings</option>
                <option value="REPORTS">Reports</option>
              </select>
              <input
                type="text"
                placeholder="მოძებნე უფლება ან აღწერა..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="permissions-list">
              <table>
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort("name")}>
                      სახელი (კოდი) {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th>აღწერა</th>
                    <th className="sortable" onClick={() => handleSort("category")}>
                      კატეგორია {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th>მოქმედება</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm) => (
                    <tr key={perm._id}>
                      <td>
                        <code>{perm.name}</code>
                      </td>
                      <td>{perm.description}</td>
                      <td>
                        <span className="category-badge">{perm.category}</span>
                      </td>
                      <td>
                        <button
                          className="btn-primary-sm"
                          style={{ marginRight: "0.5rem" }}
                          onClick={() => handleOpenEditPermissionModal(perm)}
                        >
                          რედაქტირება
                        </button>
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleDeletePermission(perm._id)}
                        >
                          წაშლა
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Role Modal */}
      {isRoleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>ახალი როლი</h2>
            <form onSubmit={handleCreateRole}>
              <div className="form-group">
                <label>სახელი *</label>
                <input
                  id="name"
                  type="text"
                  value={roleFormHandler.formData.name}
                  onChange={roleFormHandler.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>აღწერა *</label>
                <textarea
                  id="description"
                  value={roleFormHandler.formData.description}
                  onChange={roleFormHandler.handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  გაუქმება
                </button>
                <button type="submit" className="btn-primary">
                  დამატება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {isPermModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>ახალი უფლება</h2>
            <form onSubmit={handleCreatePermission}>
              <div className="form-group">
                <label>სახელი (მაგ. users:read) *</label>
                <input
                  id="name"
                  type="text"
                  value={permFormHandler.formData.name}
                  onChange={permFormHandler.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>აღწერა *</label>
                <input
                  id="description"
                  type="text"
                  value={permFormHandler.formData.description}
                  onChange={permFormHandler.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>კატეგორია *</label>
                <select
                  id="category"
                  value={permFormHandler.formData.category}
                  onChange={permFormHandler.handleChange}
                  required
                >
                  <option value="General">General</option>
                  <option value="Users">Users</option>
                  <option value="Orgs">Orgs</option>
                  <option value="Roles">Roles</option>
                  <option value="Settings">Settings</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPermModalOpen(false)}
                >
                  გაუქმება
                </button>
                <button type="submit" className="btn-primary">
                  დამატება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permission Modal */}
      {isPermEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>უფლების რედაქტირება</h2>
            <form onSubmit={handleUpdatePermission}>
              <div className="form-group">
                <label>სახელი *</label>
                <input
                  id="name"
                  type="text"
                  value={editPermFormHandler.formData.name}
                  onChange={editPermFormHandler.handleChange}
                  required
                  disabled
                />
              </div>
              <div className="form-group">
                <label>აღწერა *</label>
                <input
                  id="description"
                  type="text"
                  value={editPermFormHandler.formData.description}
                  onChange={editPermFormHandler.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>კატეგორია *</label>
                <select
                  id="category"
                  value={editPermFormHandler.formData.category}
                  onChange={editPermFormHandler.handleChange}
                  required
                >
                  <option value="General">General</option>
                  <option value="USERS">Users</option>
                  <option value="ORGS">Orgs</option>
                  <option value="ROLES">Roles</option>
                  <option value="SETTINGS">Settings</option>
                  <option value="REPORTS">Reports</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPermEditModalOpen(false)}
                >
                  გაუქმება
                </button>
                <button type="submit" className="btn-primary">
                  შენახვა
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
