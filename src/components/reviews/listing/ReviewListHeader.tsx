import React from "react";
import "./ReviewListHeader.scss";

interface ReviewListHeaderProps {
  /** The organisation column is dropped in the partner self-view. */
  showPartner: boolean;
  showActions: boolean;
}

export const ReviewListHeader: React.FC<ReviewListHeaderProps> = ({
  showPartner,
  showActions,
}) => {
  return (
    <div
      className={`review-list-header${showPartner ? "" : " review-list-header--no-partner"}${
        showActions ? "" : " review-list-header--no-actions"
      }`}
    >
      <div className="col-author"><span>მომხმარებელი</span><small>Customer</small></div>
      {showPartner && (
        <div className="col-partner"><span>ორგანიზაცია</span><small>Organization</small></div>
      )}
      <div className="col-rating"><span>შეფასება</span><small>Rating</small></div>
      <div className="col-comment"><span>კომენტარი</span><small>Comment</small></div>
      <div className="col-date"><span>თარიღი</span><small>Date</small></div>
      {showActions && (
        <div className="review-col-actions"><span>მოქმედება</span><small>Actions</small></div>
      )}
    </div>
  );
};
