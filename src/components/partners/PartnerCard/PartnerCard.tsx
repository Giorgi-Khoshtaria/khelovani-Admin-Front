import type { PartnerData } from "@/types/partner.types";
import { Link } from "react-router-dom";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import "./PartnerCard.scss";

interface PartnerCardProps {
  partner: PartnerData;
  onDelete?: () => void;
}

export default function PartnerCard({ partner, onDelete }: PartnerCardProps) {
  return (
    <div className="partner-card">
      <div className="partner-card__header">
        <h3 className="partner-card__name">{partner.companyNameGe}</h3>
        <span className={`status-badge ${partner.status}`}>
          {partner.status === PartnerStatus.PENDING
            ? "მოლოდინი"
            : partner.status === PartnerStatus.APPROVED
              ? "დადასტურებული"
              : partner.status === PartnerStatus.BANNED
                ? "დაბლოკილი"
                : "უარყოფილი"}
        </span>
      </div>
      <div className="partner-card__body">
        {partner.status === PartnerStatus.REJECTED ? (
          <p className="partner-card__id">
            <strong>საიდენტიფიკაციო კოდი:</strong>{" "}
            {partner.identificationCode || "N/A"}
          </p>
        ) : (
          <p className="partner-card__email">
            <strong>Ელ-ფოსტა:</strong> {partner.email}
          </p>
        )}
      </div>
      {partner.status !== PartnerStatus.REJECTED && (
        <div className="partner-card__footer">
          <Link to={`/partners/${partner._id}`} className="view-details-btn">
            დეტალურად
          </Link>

          <button
            className="delete-btn reject-btn"
            onClick={async () => {
              if (window.confirm("ნამდვილად გსურთ პარტნიორის წაშლა?")) {
                try {
                  const { deletePartnerRequest } = await import("@/apiCalls/partnerApiCalls/getPartner.req");
                  await deletePartnerRequest(partner._id);
                  if (onDelete) onDelete();
                } catch (error) {
                  console.error("Failed to delete partner:", error);
                  alert("წაშლა ვერ მოხერხდა");
                }
              }
            }}
          >
            წაშლა
          </button>
        </div>
      )}
    </div>
  );
}
