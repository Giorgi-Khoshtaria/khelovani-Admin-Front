import { useState } from "react";
import type { ReactNode } from "react";
import { PartnerContext } from "./PartnerContext";

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("adminToken"),
  );
  const [partnerId, setPartnerIdState] = useState<string | null>(
    localStorage.getItem("partnerId"),
  );

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("adminToken", newToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  };

  const setPartnerId = (id: string | null) => {
    setPartnerIdState(id);
    console.log(id, "setPartnerId");
    if (id) {
      localStorage.setItem("partnerId", id);
    } else {
      localStorage.removeItem("partnerId");
    }
  };

  const logout = () => {
    setToken(null);
    setPartnerId(null);
  };

  return (
    <PartnerContext.Provider
      value={{ token, partnerId, setToken, setPartnerId, logout }}
    >
      {children}
    </PartnerContext.Provider>
  );
};
