import { useParams, useNavigate } from "react-router-dom";
import { getPartnerStatisticsRequest } from "@/apiCalls/statisticsApiCalls/statistics.req";
import { useStatistics } from "@/hooks/statistics/useStatistics";
import StatisticsToolbar from "@/components/statistics/StatisticsToolbar";
import StatisticsContent from "@/components/statistics/StatisticsContent";
import StatisticsState from "@/components/statistics/StatisticsState";
import "./StatisticsPage.scss";

/**
 * Statistics for the authenticated partner (own organisation).
 * Reachable at /profile/statistics.
 */
export default function PartnerStatisticsPage() {
  const navigate = useNavigate();
  // Present even though unused here — keeps the route shape consistent.
  useParams();

  const {
    data,
    loading,
    error,
    granularity,
    setGranularity,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    resetDates,
    refetch,
  } = useStatistics(getPartnerStatisticsRequest);

  return (
    <div className="statistics-page">
      <div className="statistics-page__header">
        <button
          className="statistics-page__back"
          onClick={() => navigate(-1)}
        >
          ← უკან
        </button>
        <h1>ჩემი სტატისტიკა</h1>
      </div>

      <StatisticsToolbar
        granularity={granularity}
        onGranularityChange={setGranularity}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReset={resetDates}
      />

      {loading ? (
        <StatisticsState variant="loading" />
      ) : error ? (
        <StatisticsState variant="error" onRetry={refetch} />
      ) : data ? (
        <StatisticsContent data={data} />
      ) : (
        <StatisticsState variant="empty" />
      )}
    </div>
  );
}
