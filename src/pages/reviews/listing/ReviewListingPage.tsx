import { useReviewListing } from "@/hooks/reviews/useReviewListing";
import { ReviewFilters } from "@/components/reviews/listing/ReviewFilters";
import { ReviewListHeader } from "@/components/reviews/listing/ReviewListHeader";
import { ReviewTableRow } from "@/components/reviews/listing/ReviewTableRow";
import "./ReviewListingPage.scss";

interface Props {
  /** True on /profile/reviews — the organisation's own review inbox. */
  profileMode?: boolean;
}

/**
 * One page serves both surfaces: the admin's cross-organisation list at
 * /reviews and the partner's own list at /profile/reviews. The hook picks the
 * endpoint, so a partner can never fetch anyone else's reviews from here.
 */
export default function ReviewListingPage({ profileMode = false }: Props) {
  const {
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
  } = useReviewListing(profileMode);

  const showOrgFilters = !partnerView;

  return (
    <div className="review-listing-page">
      <div className="page-header">
        <div className="header-title">
          <h1>{partnerView ? "ჩემი შეფასებები" : "შეფასებები"}</h1>
          {totalCount > 0 && <span className="count-badge">{totalCount}</span>}
        </div>
        {partnerView && summary.total > 0 && (
          <div className="rating-summary">
            <span className="rating-summary__value">
              {Math.round(summary.average)}/5
            </span>
            <span className="rating-summary__stars">
              {"★".repeat(Math.round(summary.average))}
              {"☆".repeat(5 - Math.round(summary.average))}
            </span>
            <span className="rating-summary__count">
              {summary.total} შეფასება
            </span>
          </div>
        )}
      </div>

      <ReviewFilters
        search={search}
        onSearchChange={setSearch}
        rating={rating}
        onRatingChange={setRating}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        showOrgFilters={showOrgFilters}
        partnerId={partnerId}
        onPartnerChange={setPartnerId}
        partners={partners}
        partnerType={partnerType}
        onPartnerTypeChange={setPartnerType}
      />

      {loading ? (
        <div className="loading">იტვირთება...</div>
      ) : reviews.length === 0 ? (
        <div className="empty-state card">
          <p>შეფასებები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="reviews-list card">
          <ReviewListHeader showPartner={showOrgFilters} showActions={isAdmin} />

          {reviews.map((review) => (
            <ReviewTableRow
              key={review._id}
              review={review}
              showPartner={showOrgFilters}
              showActions={isAdmin}
              onToggleVisibility={toggleVisibility}
              onDelete={removeReview}
            />
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p: number) => Math.max(1, p - 1))
                }
              >
                წინა
              </button>
              <span className="page-info">
                გვერდი {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p: number) => Math.min(totalPages, p + 1))
                }
              >
                შემდეგი
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
