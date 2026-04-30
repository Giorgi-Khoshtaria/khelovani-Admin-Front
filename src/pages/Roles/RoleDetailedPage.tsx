import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoleByIdRequest, updateRoleRequest } from "../../apiCalls/roleApiCalls/role.req";
import { getPermissionsRequest } from "../../apiCalls/roleApiCalls/permission.req";
import type { Role, Permission } from "../../types/role.types";
import { toast } from "react-toastify";
import "./RoleDetailedPage.scss";

export default function RoleDetailedPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [roleData, { data: permData }] = await Promise.all([
        getRoleByIdRequest(id),
        getPermissionsRequest(),
      ]);
      setRole(roleData);
      setAllPermissions(permData);
      setSelectedPermissionIds(roleData.permissions?.map((p) => p._id) || []);
    } catch {
      toast.error("მონაცემების ჩატვირთვა ვერ მოხერხდა");
      navigate("/roles");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredPermissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allPermissions;
    return allPermissions.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q),
    );
  }, [allPermissions, search]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    filteredPermissions.forEach((perm) => {
      const cat = perm.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(perm);
    });
    return groups;
  }, [filteredPermissions]);

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId],
    );
  };

  const handleToggleCategory = (category: string, checked: boolean) => {
    const ids = groupedPermissions[category].map((p) => p._id);
    setSelectedPermissionIds((prev) => {
      if (checked) {
        const toAdd = ids.filter((pid) => !prev.includes(pid));
        return [...prev, ...toAdd];
      }
      return prev.filter((pid) => !ids.includes(pid));
    });
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateRoleRequest(id, { permissions: selectedPermissionIds });
      toast.success("უფლებები წარმატებით განახლდა");
    } catch {
      toast.error("შენახვა ვერ მოხერხდა");
    }
  };

  if (loading) return <div className="loading">იტვირთება...</div>;
  if (!role) return <div>როლი ვერ მოიძებნა</div>;

  const totalSelected = selectedPermissionIds.length;
  const categories = Object.entries(groupedPermissions);

  return (
    <div className="role-detailed-page">
      <div className="page-header">
        <div className="header-left">
          <Link to="/roles" className="back-link">← უკან დაბრუნება</Link>
          <h1>{role.name}</h1>
          {role.description && <p className="role-desc">{role.description}</p>}
        </div>
        <div className="header-right">
          <span className="selected-count">{totalSelected} უფლება მონიშნული</span>
          <button className="btn-success" onClick={handleSave}>
            შენახვა
          </button>
        </div>
      </div>

      <div className="permissions-toolbar">
        <input
          type="text"
          className="perm-search"
          placeholder="მოძებნე უფლება..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <span className="search-hint">
            {filteredPermissions.length} / {allPermissions.length} შედეგი
          </span>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="empty-search">ძიებით ვერაფერი მოიძებნა</div>
      ) : (
        <div className="permissions-grid">
          {categories.map(([category, perms]) => {
            const allChecked = perms.every((p) => selectedPermissionIds.includes(p._id));
            const someChecked = perms.some((p) => selectedPermissionIds.includes(p._id));
            return (
              <div key={category} className="permission-category-card">
                <div className="category-header">
                  <div className="category-title">
                    <h3>{category}</h3>
                    <span className="count-badge">{perms.length}</span>
                  </div>
                  <label className="select-all-label">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = !allChecked && someChecked;
                      }}
                      onChange={(e) => handleToggleCategory(category, e.target.checked)}
                    />
                    ყველა
                  </label>
                </div>
                <div className="permission-items">
                  {perms.map((perm) => (
                    <label key={perm._id} className="permission-item">
                      <input
                        type="checkbox"
                        checked={selectedPermissionIds.includes(perm._id)}
                        onChange={() => handleTogglePermission(perm._id)}
                      />
                      <div className="permission-info">
                        <span className="perm-name"><code>{perm.name}</code></span>
                        {perm.description && (
                          <span className="perm-desc">{perm.description}</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
