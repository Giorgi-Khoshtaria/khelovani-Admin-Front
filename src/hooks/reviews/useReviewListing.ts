import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllReviewsRequest,
  getPartnerReviewsRequest,
  setReviewVisibilityRequest,
  deleteReviewRequest,
} from "@/apiCalls/reviewApiCalls/reviews.req";
import { getAllPartnerRequest } from "@/apiCalls/partnerApiCalls/getPartner.req";
import { parseJwt } from "@/utils/parseJwt";
import { getErrorMessage } from "@/utils/handleApiError";
import { useDebounce } from "@/hooks/useDebounce";
import {
  EMPTY_REVIEW_SUMMARY,
  type Review,
  type ReviewSummary,
  type ReviewVisibilityFilter,
} from "@/types/review.types";
import type { Partner, PartnerType } from "@/types/partner.types";

interface TokenPayload {
  id: string;
  role: string | { name: string };
  permissions: string[];
}

/**
 * Drives the review listing for both admin (all reviews, with organisation
 * filters) and partner (own reviews only). `profileMode` = the partner
 * self-view at /profile/reviews.
 */
export const useReviewListing = (profileMode: boolean) => {
  // `/reviews?partnerId=<id>` — how the partner detail page deep-links here
  // with the organisation filter already applied.
  const [searchParams, setSearchParams] = useSearchParams();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_REVIEW_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [rating, setRating] = useState<number | "">("");
  const [visibility, setVisibility] = useState<ReviewVisibilityFilter>("all");
  const [partnerId, setPartnerIdState] = useState(
    () => searchParams.get("partnerId") || "",
  );
  const [partnerType, setPartnerType] = useState<PartnerType | "">("");
  const [partners, setPartners] = useState<{ _id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 15;

  const userData = useMemo(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return null;
    try {
      return parseJwt(token) as TokenPayload;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = useMemo(() => {
    if (!userData) return false;
    const role = (
      typeof userData.role === "string"
        ? userData.role
        : userData.role?.name || ""
    ).toLowerCase();
    return (
      role === "admin" || (userData.permissions || []).includes("reviews.viewAll")
    );
  }, [userData]);

  // Partner endpoint when in the profile view or when not an admin.
  const partnerView = profileMode || !isAdmin;

  /** Keeps the URL in step with the dropdown so the filter survives a reload. */
  const setPartnerId = useCallback(
    (value: string) => {
      setPartnerIdState(value);
      setSearchParams(
        (prev) => {
          if (value) prev.set("partnerId", value);
          else prev.delete("partnerId");
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Organisation dropdown — admin-only. An explicit large limit is required:
  // the default page size would silently return just the first 10 partners.
  useEffect(() => {
    if (partnerView) return;
    (async () => {
      try {
        const res = await getAllPartnerRequest(undefined, undefined, 1, 1000);
        setPartners(
          (res.data || []).map((p: Partner) => ({
            _id: p._id,
            name: p.companyNameGe || p.companyNameEn || "Unknown Organization",
          })),
        );
      } catch {
        /* non-fatal — the filter simply stays empty */
      }
    })();
  }, [partnerView]);

  const fetchReviews = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        // The organisation filters are admin-only — the partner endpoint's
        // strict schema rejects them outright.
        const params = {
          search: debouncedSearch,
          rating,
          visibility,
          page: currentPage,
          limit,
          ...(partnerView ? {} : { partnerId, partnerType }),
        };
        const res = partnerView
          ? await getPartnerReviewsRequest(params)
          : await getAllReviewsRequest(params);

        setReviews(res.data || []);
        setSummary(res.meta?.summary || EMPTY_REVIEW_SUMMARY);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.totalCount || 0);
      } catch (err) {
        toast.error(getErrorMessage(err, "შეცდომა შეფასებების ჩატვირთვისას"));
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [
      partnerView,
      debouncedSearch,
      rating,
      visibility,
      partnerId,
      partnerType,
      currentPage,
    ],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, rating, visibility, partnerId, partnerType]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleVisibility = async (review: Review) => {
    const next = !review.isVisible;
    if (
      !window.confirm(
        next
          ? "შეფასების დაბრუნება საჯარო სიაში? / Make this review public again?"
          : "შეფასების დამალვა საჯარო სიიდან? / Hide this review from the public list?",
      )
    )
      return;
    try {
      await setReviewVisibilityRequest(review._id, next);
      toast.success(next ? "შეფასება გამოჩნდა" : "შეფასება დაიმალა");
      fetchReviews(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    }
  };

  const removeReview = async (review: Review) => {
    if (
      !window.confirm(
        "ნამდვილად გსურთ შეფასების წაშლა? / Delete this review permanently?",
      )
    )
      return;
    try {
      await deleteReviewRequest(review._id);
      toast.success("შეფასება წაიშალა");
      fetchReviews(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ შესრულდა"));
    }
  };

  return {
    reviews,
    summary,
    loading,
    search,
    setSearch,
    rating,
    setRating,
    visibility,
    setVisibility,
    partnerId,
    setPartnerId,
    partnerType,
    setPartnerType,
    partners,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    isAdmin,
    partnerView,
    toggleVisibility,
    removeReview,
  };
};
