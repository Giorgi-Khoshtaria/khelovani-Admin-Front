import type { Permission } from "@/types/role.types";
import "./RolePermissionsTable.scss";

interface RolePermissionsTableProps {
  permissions: Permission[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditPermission: (perm: Permission) => void;
  onDeletePermission: (id: string) => void;
}

export function RolePermissionsTable({
  permissions,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onEditPermission,
  onDeletePermission,
}: RolePermissionsTableProps) {
  return (
    <div className="permissions-tab">
      <div className="tab-controls">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="category-filter"
        >
          <option value="all">ყველა კატეგორია</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
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
              <th>სახელი (კოდი)</th>
              <th>აღწერა</th>
              <th>კატეგორია</th>
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
            {permissions.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-row">
                  უფლებები არ მოიძებნა
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
