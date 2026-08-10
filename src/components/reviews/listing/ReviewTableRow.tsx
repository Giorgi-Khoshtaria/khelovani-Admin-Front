import React, { useState } from "react";
import "./ReviewTableRow.scss";
import { PartnerTypeEnum } from "@/types/partner.types";
import type { Review } from "@/types/review.types";

interface ReviewTableRowProps {
  review: Review;
  showPartner: boolean;
  /** Moderation buttons are admin-only — partners can read but not act. */
  showActions: boolean;
  onToggleVisibility: (review: Review) => void;
  onDelete: (review: Review) => void;
}

const COMMENT_PREVIEW = 120;

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="review-row__stars" title={`${rating}/5`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={`review-row__star${s <= rating ? " review-row__star--on" : ""}`}
      >
        ★
      </span>
    ))}
  </span>
);

export const ReviewTableRow: React.FC<ReviewTableRowProps> = ({
  review,
  showPartner,
  showActions,
  onToggleVisibility,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);

  const authorName =
    review.user?.nameGe || review.user?.nameEn || "წაშლილი მომხმარებელი";
  const partnerName =
    review.partner?.companyNameGe ||
    review.partner?.companyNameEn ||
    "უცნობი ორგანიზაცია";

  const isLong = review.comment.length > COMMENT_PREVIEW;
  const shown =
    isLong && !expanded
      ? `${review.comment.slice(0, COMMENT_PREVIEW).trim()}…`
      : review.comment;

  return (
    <div
      className={`review-row${review.isVisible ? "" : " is-hidden"}${
        showPartner ? "" : " review-row--no-partner"
      }${showActions ? "" : " review-row--no-actions"}`}
    >
      <div className="col-author">
        <span className="review-row__author">{authorName}</span>
        {review.user?.email && (
          <small className="review-row__email">{review.user.email}</small>
        )}
      </div>

      {showPartner && (
        <div className="col-partner">
          <span className="review-row__partner">{partnerName}</span>
          {review.partner?.partnerType && (
            <small className="review-row__type">
              {review.partner.partnerType === PartnerTypeEnum.ORGANIZATION
                ? "🏢 კომპანია"
                : "👤 ბრენდი"}
            </small>
          )}
        </div>
      )}

      <div className="col-rating">
        <Stars rating={review.rating} />
        {!review.isVisible && (
          <span className="review-visibility review-visibility--hidden">
            დამალული
          </span>
        )}
      </div>

      <div className="col-comment">
        <p className="review-row__comment">{shown}</p>
        {isLong && (
          <button
            type="button"
            className="review-row__expand"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "ნაკლები" : "სრულად"}
          </button>
        )}
      </div>

      <div className="col-date">
        {new Date(review.createdAt).toLocaleDateString("ka-GE")}
      </div>

      {showActions && (
        <div className="review-col-actions">
          <button
            type="button"
            className="review-row__btn"
            onClick={() => onToggleVisibility(review)}
          >
            {review.isVisible ? "დამალვა" : "გამოჩენა"}
          </button>
          <button
            type="button"
            className="review-row__btn review-row__btn--danger"
            onClick={() => onDelete(review)}
          >
            წაშლა
          </button>
        </div>
      )}
    </div>
  );
};
