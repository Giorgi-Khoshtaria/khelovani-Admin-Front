import type { PartnerData } from "@/types/partner.types";
import { Link } from "react-router-dom";
import { updatePartnerStatus } from "@/apiCalls/partnerApiCalls/getPartner.req";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import "./PartnerCard.scss";

interface PartnerCardProps {
  partner: PartnerData;
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  const handleStatusUpdate = async (
    newStatus: typeof PartnerStatus.APPROVED | typeof PartnerStatus.REJECTED,
  ) => {
    try {
      await updatePartnerStatus(partner._id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  return (
    <div className="partner-card">
      <div className="partner-card__header">
        <h3 className="partner-card__name">{partner.companyNameGe}</h3>
        <span className={`status-badge ${partner.status}`}>
          {partner.status === PartnerStatus.PENDING
            ? "მოლოდინი"
            : partner.status === PartnerStatus.APPROVED
              ? "დადასტურებული"
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
            className="reject-btn"
            onClick={() => handleStatusUpdate(PartnerStatus.REJECTED)}
          >
            უარყოფა
          </button>
        </div>
      )}
    </div>
  );
}
