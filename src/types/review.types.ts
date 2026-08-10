import type { PartnerType } from "./partner.types";

export interface ReviewAuthor {
  _id: string;
  nameGe?: string;
  nameEn?: string;
  email?: string;
  profileImage?: string | null;
}

export interface ReviewPartner {
  _id: string;
  companyNameGe?: string;
  companyNameEn?: string;
  partnerType?: PartnerType;
  profilePhoto?: string;
}

export interface Review {
  _id: string;
  user: ReviewAuthor | null;
  partner: ReviewPartner | null;
  rating: number;
  comment: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReviewVisibilityFilter = "all" | "visible" | "hidden";

export interface ReviewListParams {
  search?: string;
  rating?: number | "";
  visibility?: ReviewVisibilityFilter;
  /** Admin-only — the partner view never sends these two. */
  partnerId?: string;
  partnerType?: PartnerType | "";
  page?: number;
  limit?: number;
}

export interface ReviewSummary {
  average: number;
  total: number;
  /** Visible review count per star value, keyed "1".."5". */
  breakdown: Record<string, number>;
}

export interface ReviewListResult {
  data: Review[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    /** Only returned by the partner endpoint. */
    summary?: ReviewSummary;
  };
}

export const EMPTY_REVIEW_SUMMARY: ReviewSummary = {
  average: 0,
  total: 0,
  breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
};
