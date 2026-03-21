import { Link } from "react-router-dom";
import "./PartnerCard.scss";

export interface PartnerData {
  _id: string;
  companyNameGe: string;
  companyNameEn?: string;
  email: string;
  status: "pending" | "approved" | "rejected";
}

interface PartnerCardProps {
  partner: PartnerData;
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <div className="partner-card">
      <div className="partner-card__header">
        <h3 className="partner-card__name">{partner.companyNameGe}</h3>
        <span className={`status-badge ${partner.status}`}>
          {partner.status === "pending"
            ? "მოლოდინი"
            : partner.status === "approved"
              ? "დადასტურებული"
              : "უარყოფილი"}
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
      </div>
    </div>
  );
}
