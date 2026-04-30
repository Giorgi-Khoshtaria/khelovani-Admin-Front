import api from "../api";
import type { PartnerData } from "@/types/partner.types";

export const getPinnedPartnersRequest = async (): Promise<PartnerData[]> => {
  const response = await api.get(`/api/partner/pinned`);
  return response.data.data;
};
