import "./InformationFieldsPagination.scss";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Builds the list of page tokens to render, inserting "…" gaps for long ranges.
 * Always keeps the first page, last page, and a window around the current page.
 */
const buildPages = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("...");

  pages.push(total);
  return pages;
};

export default function InformationFieldsPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <div className="if-pagination">
      <button
        className="if-pagination__nav"
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        წინა
      </button>

      <div className="if-pagination__pages">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`gap-${i}`} className="if-pagination__gap">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`if-pagination__page ${
                p === page ? "if-pagination__page--active" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="if-pagination__nav"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        შემდეგი
      </button>
    </div>
  );
}
