import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getRolesRequest,
  createRoleRequest,
  deleteRoleRequest,
} from "../../apiCalls/roleApiCalls/role.req";
import {
  getPermissionsRequest,
  createPermissionRequest,
  deletePermissionRequest,
} from "../../apiCalls/roleApiCalls/permission.req";
import type { Role, Permission } from "../../types/role.types";
import "./RoleManagement.scss";

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [loading, setLoading] = useState(true);

  // Search, Filter & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "category">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);

  // Forms
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [permForm, setPermForm] = useState({
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
        // Pass search, category, and sort to backend
        const data = await getPermissionsRequest(debouncedSearchQuery, selectedCategory, sortField, sortOrder);
        setPermissions(data);
      }
    } catch {
      alert("მონაცემების ჩატვირთვა ვერ მოხერხდა");
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
      await createRoleRequest(roleForm);
      setIsRoleModalOpen(false);
      setRoleForm({ name: "", description: "" });
      loadData();
    } catch {
      alert("როლი ვერ შეიქმნა");
    }
  };

  const handleCreatePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPermissionRequest(permForm);
      setIsPermModalOpen(false);
      setPermForm({ name: "", description: "", category: "General" });
      loadData();
    } catch {
      alert("უფლება ვერ შეიქმნა");
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ როლის წაშლა?")) return;
    try {
      await deleteRoleRequest(id);
      loadData();
    } catch {
      alert("წაშლა ვერ მოხერხდა");
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

  // Frontend filter removed as it is handled on the backend now during loadData

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
                          className="btn-danger-sm"
                          onClick={async () => {
                            if (window.confirm("წაშლა?")) {
                              await deletePermissionRequest(perm._id);
                              loadData();
                            }
                          }}
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
                  type="text"
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>აღწერა *</label>
                <textarea
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, description: e.target.value })
                  }
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
                  type="text"
                  value={permForm.name}
                  onChange={(e) =>
                    setPermForm({ ...permForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>აღწერა *</label>
                <input
                  type="text"
                  value={permForm.description}
                  onChange={(e) =>
                    setPermForm({ ...permForm, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>კატეგორია *</label>
                <select
                  value={permForm.category}
                  onChange={(e) =>
                    setPermForm({ ...permForm, category: e.target.value })
                  }
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
    </div>
  );
}
