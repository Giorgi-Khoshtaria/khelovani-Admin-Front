import type { Permission } from "@/types/role.types";
import "./RolePermissionsTable.scss";

interface RolePermissionsTableProps {
  permissions: Permission[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: "name" | "category";
  sortOrder: "asc" | "desc";
  onSort: (field: "name" | "category") => void;
  onEditPermission: (perm: Permission) => void;
  onDeletePermission: (id: string) => void;
}

export function RolePermissionsTable({
  permissions,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortField,
  sortOrder,
  onSort,
  onEditPermission,
  onDeletePermission,
}: RolePermissionsTableProps) {
  return (
    <div className="permissions-tab">
      <div className="tab-controls" style={{ gap: "0.75rem" }}>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="permissions-list">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => onSort("name")}>
                სახელი (კოდი) {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>აღწერა</th>
              <th className="sortable" onClick={() => onSort("category")}>
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
                    onClick={() => onEditPermission(perm)}
                  >
                    რედაქტირება
                  </button>
                  <button
                    className="btn-danger-sm"
                    onClick={() => onDeletePermission(perm._id)}
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
  );
}
