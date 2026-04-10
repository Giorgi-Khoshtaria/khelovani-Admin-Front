import { useState } from "react";
import type { ReactNode } from "react";
import { PartnerContext } from "./PartnerContext";

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("adminToken"),
  );

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("adminToken", newToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <PartnerContext.Provider value={{ token, setToken, logout }}>
      {children}
    </PartnerContext.Provider>
  );
};
