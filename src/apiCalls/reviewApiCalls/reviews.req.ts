import api from "../api";
import type { ReviewListParams, ReviewListResult } from "@/types/review.types";

/**
 * Drops empty values and the "all" sentinel. Important: the backend query
 * schemas are strict, so sending `partnerId=""` would be a 422 rather than an
 * ignored filter.
 */
const clean = (params: ReviewListParams) => {
  const out: Record<string, string | number> = {};
  if (params.search) out.search = params.search;
  if (params.rating) out.rating = params.rating;
  if (params.visibility && params.visibility !== "all") {
    out.visibility = params.visibility;
  }
  if (params.partnerId) out.partnerId = params.partnerId;
  if (params.partnerType) out.partnerType = params.partnerType;
  if (params.page) out.page = params.page;
  if (params.limit) out.limit = params.limit;
  return out;
};

/** Admin — every review, filterable by organisation and organisation type. */
export const getAllReviewsRequest = async (
  params: ReviewListParams,
): Promise<ReviewListResult> => {
  const res = await api.get("/api/admin/reviews", { params: clean(params) });
  return { data: res.data.data, meta: res.data.meta };
};

/**
 * Partner — only the authenticated organisation's own reviews. The endpoint
 * takes no partner id at all; the server reads it from the token.
 */
export const getPartnerReviewsRequest = async (
  params: ReviewListParams,
): Promise<ReviewListResult> => {
  const res = await api.get("/api/partner/reviews", { params: clean(params) });
  return { data: res.data.data, meta: res.data.meta };
};

/** Admin — hide or unhide a review (hidden ones stop counting toward the average). */
export const setReviewVisibilityRequest = async (
  id: string,
  isVisible: boolean,
): Promise<void> => {
  await api.patch(`/api/admin/reviews/${id}/visibility`, { isVisible });
};

/** Admin — permanently delete a review. */
export const deleteReviewRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/reviews/${id}`);
};
