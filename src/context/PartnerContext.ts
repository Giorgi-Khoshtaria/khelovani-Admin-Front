import { createContext, useContext } from "react";

export interface PartnerContextType {
  token: string | null;
  partnerId: string | null;
  setToken: (token: string | null) => void;
  setPartnerId: (id: string | null) => void;
  logout: () => void;
}

export const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const usePartnerContext = () => {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error("usePartnerContext must be used within a PartnerProvider");
  }
  return context;
};
