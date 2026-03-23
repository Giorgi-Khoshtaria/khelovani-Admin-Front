import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoleByIdRequest, updateRoleRequest } from "../../apiCalls/roleApiCalls/role.req";
import { getPermissionsRequest } from "../../apiCalls/roleApiCalls/permission.req";
import type { Role, Permission } from "../../types/role.types";
import "./RoleDetailedPage.scss";

export default function RoleDetailedPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [roleData, permData] = await Promise.all([
        getRoleByIdRequest(id),
        getPermissionsRequest(),
      ]);
      setRole(roleData);
      setAllPermissions(permData);
      // Extra ids from populated permissions array
      setSelectedPermissionIds(roleData.permissions?.map((p) => p._id) || []);
    } catch {
      alert("მონაცემების ჩატვირთვა ვერ მოხერხდა");
      navigate("/roles");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateRoleRequest(id, { permissions: selectedPermissionIds as any }); // Cast if TS complains about populated types vs raw IDs save format
      alert("უფლებები წარმატებით განახლდა");
    } catch {
      alert("შენახვა ვერ მოხერხდა");
    }
  };

  if (loading) return <div className="loading">იტვირთება...</div>;
  if (!role) return <div>როლი ვერ მოიძებნა</div>;

  // Group permissions by category
  const groupedPermissions: Record<string, Permission[]> = {};
  allPermissions.forEach((perm) => {
    const cat = perm.category || "General";
    if (!groupedPermissions[cat]) groupedPermissions[cat] = [];
    groupedPermissions[cat].push(perm);
  });

  const handleToggleCategory = (category: string, checked: boolean) => {
    const permIdsInCategory = groupedPermissions[category].map((p) => p._id);
    setSelectedPermissionIds((prev) => {
      if (checked) {
        const toAdd = permIdsInCategory.filter((id) => !prev.includes(id));
        return [...prev, ...toAdd];
      } else {
        return prev.filter((id) => !permIdsInCategory.includes(id));
      }
    });
  };

  return (
    <div className="role-detailed-page">
      <div className="page-header">
        <div className="header-left">
          <Link to="/roles" className="back-link">← უკან დაბრუნება</Link>
          <h1>{role.name} - უფლებების მართვა</h1>
        </div>
        <button className="btn-success" onClick={handleSave}>
          შენახვა
        </button>
      </div>

      <p className="role-desc">{role.description}</p>

      <div className="permissions-grid">
        {Object.entries(groupedPermissions).map(([category, perms]) => (
          <div key={category} className="permission-category-card">
            <div className="category-header">
              <h3>{category}</h3>
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={perms.every((p) => selectedPermissionIds.includes(p._id))}
                  onChange={(e) => handleToggleCategory(category, e.target.checked)}
                />
                ყველას მონიშვნა
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
                    <span className="perm-desc">{perm.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
