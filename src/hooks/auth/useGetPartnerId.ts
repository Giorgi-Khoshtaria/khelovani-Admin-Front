import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";

export const useGetPartnerId = () => {
  const { token } = usePartnerContext();
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.id || null;
};
