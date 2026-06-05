import "./StatisticsState.scss";

interface Props {
  variant: "loading" | "error" | "empty";
  onRetry?: () => void;
}

const TEXT: Record<Props["variant"], string> = {
  loading: "იტვირთება...",
  error: "სტატისტიკის ჩატვირთვა ვერ მოხერხდა",
  empty: "მონაცემები ვერ მოიძებნა",
};

/** Shared loading / error / empty placeholder for the statistics pages. */
export default function StatisticsState({ variant, onRetry }: Props) {
  return (
    <div className={`stats-state stats-state--${variant}`}>
      <p>{TEXT[variant]}</p>
      {variant === "error" && onRetry && (
        <button onClick={onRetry}>თავიდან ცდა</button>
      )}
    </div>
  );
}
