import { useParams, useNavigate } from "react-router-dom";
import { useUserDetails } from "@/hooks/users/useUserDetails";
import { UserInfoForm } from "@/components/users/details/UserInfoForm";
import { UserAddressList } from "@/components/users/details/UserAddressList";
import "./UserDetailsPage.scss";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, handleDelete } = useUserDetails(id);

  if (loading) return <div className="loading-state">იტვირთება...</div>;
  if (!user)
    return <div className="error-state">მომხმარებელი ვერ მოიძებნა.</div>;

  const displayName = user.nameGe || user.nameEn || user.email;

  return (
    <div className="user-details-page">
      <div className="user-details-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/users")}>
            ← უკან მომხმარებლებზე
          </button>
          <h1 className="page-title">{displayName}</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn-danger"
            onClick={handleDelete}
            data-testid="user-details-delete-btn"
          >
            წაშლა
          </button>
        </div>
      </div>

      <div className="user-details-content card">
        <h2 className="section-title">მომხმარებლის ინფორმაცია</h2>
        <UserInfoForm user={user} />
      </div>

      <div className="user-details-content card">
        <h2 className="section-title">შენახული მისამართები</h2>
        <UserAddressList addresses={user.addresses} />
      </div>
    </div>
  );
}
