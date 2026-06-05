import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  StatGranularity,
  type StatisticsParams,
  type StatisticsResult,
} from "@/types/statistics.types";

type Fetcher = (params: StatisticsParams) => Promise<StatisticsResult>;

/**
 * Owns the data + filter state for a statistics page. The caller injects the
 * fetcher (admin or partner), and optionally a fixed `partner` scope so the
 * admin page can show one organisation.
 */
export function useStatistics(fetcher: Fetcher, partner?: string) {
  const [data, setData] = useState<StatisticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [granularity, setGranularity] = useState<StatGranularity>(
    StatGranularity.Month,
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetcher({
        granularity,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        partner,
      });
      setData(result);
    } catch (err) {
      console.error("Failed to load statistics:", err);
      setError(true);
      toast.error("სტატისტიკის ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  }, [fetcher, granularity, dateFrom, dateTo, partner]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const resetDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  return {
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
    refetch: fetchStats,
  };
}
