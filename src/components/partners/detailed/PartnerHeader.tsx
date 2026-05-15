import { PartnerStatus } from "@/types/partnerStatus";
import type { Partner } from "@/types/partner.types";
import "./PartnerHeader.scss";

interface PartnerHeaderProps {
  partner: Partner;
  isAdmin: boolean;
  isOwnProfile: boolean;
  isEditing: boolean;
  updating: boolean;
  onBack: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusUpdate: (
    newStatus: typeof PartnerStatus.APPROVED | typeof PartnerStatus.BANNED,
  ) => void;
  onPin?: () => void;
  onToggleVisibility?: () => void;
  pinning?: boolean;
  toggling?: boolean;
}

export function PartnerHeader({
  partner,
  isAdmin,
  isOwnProfile,
  isEditing,
  updating,
  onBack,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onStatusUpdate,
  onPin,
  onToggleVisibility,
  pinning,
  toggling,
}: PartnerHeaderProps) {
  const isShown = partner.isShown ?? true;
  return (
    <div className="profile-header">
      <div className="header-title">
        {isAdmin && (
          <button className="back-btn" onClick={onBack}>
            ← უკან
          </button>
        )}
      </div>

      <div className="header-actions">
        {isOwnProfile && (
          <>
            {isEditing ? (
              <div className="edit-actions">
                <button
                  className="save-btn"
                  onClick={onSave}
                  disabled={updating}
                >
                  {updating ? "ინახება..." : "შენახვა"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={onCancel}
                  disabled={updating}
                >
                  გაუქმება
                </button>
              </div>
            ) : (
              <div className="profile-owner-actions">
                <button className="edit-btn" onClick={onEdit}>
                  რედაქტირება
                </button>
                <button
                  className="delete-btn"
                  onClick={onDelete}
                  disabled={updating}
                >
                  წაშლა
                </button>
              </div>
            )}
          </>
        )}

        {!isEditing && isAdmin && (
          <div className="admin-pin-actions">
            <button
              className={`pin-btn ${partner.isPinned ? "active" : ""}`}
              onClick={onPin}
              disabled={pinning || updating}
              title={partner.isPinned ? "პინის მოხსნა" : "პინი"}
            >
              {pinning ? "..." : partner.isPinned ? "📌 პინის მოხსნა" : "📍 პინი"}
            </button>
            <button
              className={`visibility-btn ${isShown ? "visible" : "hidden"}`}
              onClick={onToggleVisibility}
              disabled={toggling || updating}
              title={isShown ? "დამალვა" : "გამოჩენა"}
            >
              {toggling ? "..." : isShown ? "👁 დამალვა" : "🙈 გამოჩენა"}
            </button>
          </div>
        )}

        {!isEditing && isAdmin && (
          <div className="admin-status-actions">
            {partner.status === PartnerStatus.PENDING && (
              <button
                className="approve-btn"
                onClick={() => onStatusUpdate(PartnerStatus.APPROVED)}
                disabled={updating}
              >
                {updating ? "..." : "დადასტურება"}
              </button>
            )}
            {(partner.status === PartnerStatus.PENDING ||
              partner.status === PartnerStatus.APPROVED) && (
              <button
                className="reject-btn"
                onClick={onDelete}
                disabled={updating}
              >
                {updating ? "..." : "უარყოფა"}
              </button>
            )}
            {partner.status !== PartnerStatus.BANNED && (
              <button
                className="ban-btn"
                style={{ marginLeft: "8px" }}
                onClick={() => onStatusUpdate(PartnerStatus.BANNED)}
                disabled={updating}
              >
                {updating ? "..." : "დაბლოკვა"}
              </button>
            )}
          </div>
        )}

        {!isEditing && partner.partnerType && (
          <div className={`type-badge type--${partner.partnerType}`}>
            {partner.partnerType === "individual" ? "👤 ბრენდი" : "🏢 კომპანია"}
          </div>
        )}

        {!isEditing && (
          <div className={`status-badge ${partner.status}`}>
            {partner.status === PartnerStatus.PENDING
              ? "მოლოდინი"
              : partner.status === PartnerStatus.APPROVED
                ? "დადასტურებული"
                : partner.status === PartnerStatus.BANNED
                  ? "დაბლოკილი"
                  : ""}
          </div>
        )}
      </div>
    </div>
  );
}
