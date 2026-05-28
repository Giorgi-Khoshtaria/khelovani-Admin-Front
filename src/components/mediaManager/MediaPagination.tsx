import "./MediaPagination.scss";

interface Props {
  pageIndex: number;
  totalPages: number;
  canNext: boolean;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Cursor-style Prev / Next pagination — Cloudinary has no offset jumps,
 * so the parent owns the cursor stack and we just expose the buttons.
 */
export default function MediaPagination({
  pageIndex,
  totalPages,
  canNext,
  loading,
  onPrev,
  onNext,
}: Props) {
  // Nothing to paginate.
  if (pageIndex === 0 && !canNext) return null;

  return (
    <div className="media-pagination">
      <button
        className="btn-ghost"
        disabled={pageIndex === 0 || loading}
        onClick={onPrev}
      >
        ‹ წინა
      </button>
      <span className="media-pagination__info">
        გვერდი {pageIndex + 1} / {totalPages}
      </span>
      <button
        className="btn-ghost"
        disabled={!canNext || loading}
        onClick={onNext}
      >
        შემდეგი ›
      </button>
    </div>
  );
}
