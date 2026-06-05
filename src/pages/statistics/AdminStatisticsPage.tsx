import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminStatisticsRequest } from "@/apiCalls/statisticsApiCalls/statistics.req";
import { getAllPartnerRequest } from "@/apiCalls/partnerApiCalls/getPartner.req";
import { useStatistics } from "@/hooks/statistics/useStatistics";
import StatisticsToolbar from "@/components/statistics/StatisticsToolbar";
import StatisticsContent from "@/components/statistics/StatisticsContent";
import StatisticsState from "@/components/statistics/StatisticsState";
import "./StatisticsPage.scss";

interface PartnerOption {
  _id: string;
  companyNameGe?: string;
  companyNameEn?: string;
}

/**
 * Admin statistics. Two entry points:
 *  - /partners/:id/statistics → scoped to that one partner (id from route)
 *  - /statistics              → platform-wide, with an optional partner picker
 */
export default function AdminStatisticsPage() {
  const { id: routePartnerId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // When scoped via the route the picker is hidden and locked to that id.
  const isScopedRoute = Boolean(routePartnerId);
  const [selectedPartner, setSelectedPartner] = useState<string>(
    routePartnerId ?? "",
  );

  const [partners, setPartners] = useState<PartnerOption[]>([]);

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
  } = useStatistics(getAdminStatisticsRequest, selectedPartner || undefined);

  // Load partner list for the picker (platform-wide view only).
  useEffect(() => {
    if (isScopedRoute) return;
    getAllPartnerRequest("", "all", 1, 200)
      .then((res) => setPartners(res.data ?? []))
      .catch((err) => console.error("Failed to load partners:", err));
  }, [isScopedRoute]);

  const scopedName = (() => {
    if (!routePartnerId) return null;
    const p = partners.find((x) => x._id === routePartnerId);
    return p?.companyNameGe || p?.companyNameEn || null;
  })();

  return (
    <div className="statistics-page">
      <div className="statistics-page__header">
        {isScopedRoute && (
          <button
            className="statistics-page__back"
            onClick={() => navigate(-1)}
          >
            ← უკან
          </button>
        )}
        <h1>{isScopedRoute ? "პარტნიორის სტატისტიკა" : "სტატისტიკა"}</h1>
        {scopedName && (
          <span className="statistics-page__partner-name">{scopedName}</span>
        )}

        {!isScopedRoute && (
          <div className="statistics-page__selector">
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
            >
              <option value="">ყველა პარტნიორი</option>
              {partners.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.companyNameGe || p.companyNameEn || p._id}
                </option>
              ))}
            </select>
          </div>
        )}
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
