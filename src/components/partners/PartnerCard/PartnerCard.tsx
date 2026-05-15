import type { PartnerData } from "@/types/partner.types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PartnerStatus } from "@/types/partnerStatus";
import { toast } from "react-toastify";
import { updatePartnerPinRequest } from "@/apiCalls/partnerApiCalls/pinPartner.req";
import { updatePartnerVisibilityRequest } from "@/apiCalls/partnerApiCalls/setPartnerVisibility.req";
import { getErrorMessage } from "@/utils/handleApiError";
import "./PartnerCard.scss";

interface PartnerCardProps {
  partner: PartnerData;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onUpdate?: (updated: Partial<PartnerData>) => void;
  isAdmin?: boolean;
}

export default function PartnerCard({
  partner,
  onDelete,
  isSelected,
  onSelect,
  onUpdate,
  isAdmin,
}: PartnerCardProps) {
  const [pinning, setPinning] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isShown = partner.isShown ?? true;

  const handlePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinning) return;
    try {
      setPinning(true);
      const newVal = !partner.isPinned;
      const { data, meta } = await updatePartnerPinRequest(partner._id, newVal);
      onUpdate?.({ isPinned: data.isPinned, pinnedAt: data.pinnedAt });
      if (newVal && meta.evicted.length > 0) {
        toast.info("სხვა პარტნიორი ავტომატურად მოიხსნა პინიდან");
      } else {
        toast.success(newVal ? "პარტნიორი დაიპინა" : "პინი მოიხსნა");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    } finally {
      setPinning(false);
    }
  };

  const handleVisibility = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggling) return;
    try {
      setToggling(true);
      const newVal = !isShown;
      await updatePartnerVisibilityRequest(partner._id, newVal);
      onUpdate?.({ isShown: newVal });
      toast.success(newVal ? "პარტნიორი გამოჩნდა" : "პარტნიორი დაიმალა");
    } catch (err) {
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className={[
        "partner-card",
        isSelected ? "selected" : "",
        partner.isPinned ? "pinned" : "",
        !isShown ? "hidden-partner" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
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
        <div className="partner-card__badges">
          {partner.partnerType && (
            <span
              className={`partner-card__type-badge type--${partner.partnerType}`}
            >
              {partner.partnerType === "individual"
                ? "👤 ბრენდი"
                : "🏢 კომპანია"}
            </span>
          )}
          {partner.isPinned && (
            <span className="partner-card__pin-badge">📌 პინი</span>
          )}
          {!isShown && (
            <span className="partner-card__hidden-badge">🙈 დამალული</span>
          )}
        </div>
      </div>

      <div className="partner-card__body">
        <p className="partner-card__email">
          <strong>Ел-ფოსტა:</strong> {partner.email}
        </p>
        {partner.categories && partner.categories.length > 0 && (
          <div className="partner-card__categories">
            {partner.categories.map((slug) => (
              <span key={slug} className="partner-card__cat-chip">{slug}</span>
            ))}
          </div>
        )}
      </div>

      <div className="partner-card__footer">
        <span className={`status-badge ${partner.status}`}>
          {partner.status === PartnerStatus.PENDING
            ? "მოლოდინი"
            : partner.status === PartnerStatus.APPROVED
              ? "დადასტურებული"
              : "დაბლოკილი"}
        </span>
        <div className="partner-card__actions">
          {isAdmin && (
            <>
              <button
                className={`pin-btn ${partner.isPinned ? "active" : ""}`}
                onClick={handlePin}
                disabled={pinning}
                title={partner.isPinned ? "პინის მოხსნა" : "პინი"}
              >
                {pinning ? "..." : partner.isPinned ? "📌" : "📍"}
              </button>
              <button
                className={`visibility-btn ${isShown ? "visible" : "hidden"}`}
                onClick={handleVisibility}
                disabled={toggling}
                title={isShown ? "დამალვა" : "გამოჩენა"}
              >
                {toggling ? "..." : isShown ? "👁" : "🙈"}
              </button>
            </>
          )}
          <Link to={`/partners/${partner._id}`} className="view-details-btn">
            დეტალურად
          </Link>
          <button
            className="delete-btn"
            onClick={async () => {
              if (window.confirm("ნამდვილად გსურთ პარტნიორის წაშლა?")) {
                try {
                  const { deletePartnerRequest } =
                    await import("@/apiCalls/partnerApiCalls/getPartner.req");
                  await deletePartnerRequest(partner._id);
                  toast.success("პარტნიორი წარმატებით წაიშალა");
                  if (onDelete) onDelete();
                } catch (err) {
                  toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
                }
              }
            }}
          >
            წაშლა
          </button>
        </div>
      </div>
    </div>
  );
}
