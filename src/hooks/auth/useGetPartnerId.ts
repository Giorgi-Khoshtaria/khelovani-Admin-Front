import { usePartnerContext } from "@/context/PartnerContext";

export const useGetPartnerId = () => {
  const { partnerId } = usePartnerContext();
  return partnerId;
};
