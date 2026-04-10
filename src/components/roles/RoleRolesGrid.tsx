import { Link, useNavigate } from "react-router-dom";
import type { Role } from "@/types/role.types";
import "./RoleRolesGrid.scss";

interface RoleRolesGridProps {
  roles: Role[];
  onDeleteRole: (id: string) => void;
}

export function RoleRolesGrid({ roles, onDeleteRole }: RoleRolesGridProps) {
  const navigate = useNavigate();

  return (
    <div className="roles-grid">
      {roles.map((role) => (
        <div 
          key={role._id} 
          className="role-card"
          onClick={() => navigate(`/roles/${role._id}`)}
        >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRole(role._id);
                  }}
                >
                  წაშლა
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

