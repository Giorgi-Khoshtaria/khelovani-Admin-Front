import api from "../api";
import type {
  StatisticsParams,
  StatisticsResult,
} from "@/types/statistics.types";

const buildParams = (params: StatisticsParams): Record<string, string | number> => {
  const out: Record<string, string | number> = {};
  if (params.granularity) out.granularity = params.granularity;
  if (params.dateFrom) out.dateFrom = params.dateFrom;
  if (params.dateTo) out.dateTo = params.dateTo;
  if (params.topLimit) out.topLimit = params.topLimit;
  if (params.partner) out.partner = params.partner;
  return out;
};

/** Admin — platform-wide statistics, or scoped to one partner via `partner`. */
export const getAdminStatisticsRequest = async (
  params: StatisticsParams = {},
): Promise<StatisticsResult> => {
  const res = await api.get("/api/admin/statistics", {
    params: buildParams(params),
  });
  return res.data.data;
};

/** Partner — statistics for the authenticated partner only. */
export const getPartnerStatisticsRequest = async (
  params: StatisticsParams = {},
): Promise<StatisticsResult> => {
  const res = await api.get("/api/partner/statistics", {
    params: buildParams(params),
  });
  return res.data.data;
};
