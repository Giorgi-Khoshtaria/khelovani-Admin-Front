import React from "react";
import "./ReviewFilters.scss";
import { PartnerTypeEnum, type PartnerType } from "@/types/partner.types";
import type { ReviewVisibilityFilter } from "@/types/review.types";

interface ReviewFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  rating: number | "";
  onRatingChange: (value: number | "") => void;
  visibility: ReviewVisibilityFilter;
  onVisibilityChange: (value: ReviewVisibilityFilter) => void;
  /** Organisation filters render only for an admin outside the profile view. */
  showOrgFilters: boolean;
  partnerId: string;
  onPartnerChange: (value: string) => void;
  partners: { _id: string; name: string }[];
  partnerType: PartnerType | "";
  onPartnerTypeChange: (value: PartnerType | "") => void;
}

const STARS = [5, 4, 3, 2, 1];

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  search,
  onSearchChange,
  rating,
  onRatingChange,
  visibility,
  onVisibilityChange,
  showOrgFilters,
  partnerId,
  onPartnerChange,
  partners,
  partnerType,
  onPartnerTypeChange,
}) => {
  return (
    <div className="filters card">
      <div className="filters__row filters__row--search">
        <div className="filters__group filters__group--search">
          <div className="filters__search-wrapper">
            <svg
              className="filters__search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="ძიება (კომენტარი ან მომხმარებელი)"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="filters__input"
            />
          </div>
        </div>
      </div>

      <div className="filters__row filters__row--selects">
        {showOrgFilters && (
          <div className="filters__group">
            <label className="filters__label">ორგანიზაცია</label>
            <div className="filters__select-wrapper">
              <svg
                className="filters__select-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <select
                className="filters__select"
                value={partnerId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onPartnerChange(e.target.value)
                }
              >
                <option value="">ყველა ორგანიზაცია</option>
                {partners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {showOrgFilters && (
          <div className="filters__group">
            <label className="filters__label">ორგანიზაციის ტიპი</label>
            <div className="filters__select-wrapper">
              <select
                className="filters__select filters__select--plain"
                value={partnerType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onPartnerTypeChange(e.target.value as PartnerType | "")
                }
              >
                <option value="">ყველა ტიპი</option>
                <option value={PartnerTypeEnum.ORGANIZATION}>🏢 კომპანია</option>
                <option value={PartnerTypeEnum.INDIVIDUAL}>👤 ბრენდი</option>
              </select>
            </div>
          </div>
        )}

        <div className="filters__group">
          <label className="filters__label">შეფასება</label>
          <div className="filters__select-wrapper">
            <select
              className="filters__select filters__select--plain"
              value={rating}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onRatingChange(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">ყველა შეფასება</option>
              {STARS.map((s) => (
                <option key={s} value={s}>
                  {"★".repeat(s)} ({s})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filters__group">
          <label className="filters__label">ხილვადობა</label>
          <div className="filters__select-wrapper">
            <select
              className="filters__select filters__select--plain"
              value={visibility}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onVisibilityChange(e.target.value as ReviewVisibilityFilter)
              }
            >
              <option value="all">ყველა</option>
              <option value="visible">გამოჩენილი</option>
              <option value="hidden">დამალული</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
