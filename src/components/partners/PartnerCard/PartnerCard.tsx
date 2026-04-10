import type { PartnerData } from "@/types/partner.types";
import { Link } from "react-router-dom";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import { toast } from "react-toastify";
import "./PartnerCard.scss";

interface PartnerCardProps {
  partner: PartnerData;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export default function PartnerCard({
  partner,
  onDelete,
  isSelected,
  onSelect,
}: PartnerCardProps) {
  return (
    <div className={`partner-card ${isSelected ? "selected" : ""}`}>
      <div className="partner-card__header">
        <div className="partner-card__header-left">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(partner._id, e.target.checked)}
              className="partner-card__checkbox"
            />
          )}
          <h3 className="partner-card__name">{partner.companyNameGe}</h3>
        </div>
        <span className={`status-badge ${partner.status}`}>
          {partner.status === PartnerStatus.PENDING
            ? "მოლოდინი"
            : partner.status === PartnerStatus.APPROVED
              ? "დადასტურებული"
              : "დაბლოკილი"}
        </span>
      </div>
      <div className="partner-card__body">
          <p className="partner-card__email">
            <strong>Ელ-ფოსტა:</strong> {partner.email}
          </p>
      </div>
      <div className="partner-card__footer">
          <Link to={`/partners/${partner._id}`} className="view-details-btn">
            დეტალურად
          </Link>

          <button
            className="delete-btn reject-btn"
            onClick={async () => {
              if (window.confirm("ნამდვილად გსურთ პარტნიორის წაშლა?")) {
                try {
                  const { deletePartnerRequest } =
                    await import("@/apiCalls/partnerApiCalls/getPartner.req");
                  await deletePartnerRequest(partner._id);
                  toast.success("პარტნიორი წარმატებით წაიშალა");
                  if (onDelete) onDelete();
                } catch (error) {
                  console.error("Failed to delete partner:", error);
                  toast.error("წაშლა ვერ მოხერხდა");
                }
              }
            }}
          >
            წაშლა
          </button>
      </div>
    </div>
  );
}
