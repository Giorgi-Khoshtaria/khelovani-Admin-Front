import { useNavigate } from "react-router-dom";
import { usePartnerContext } from "@/context/PartnerContext";
import { useEffect } from "react";

export const useNavigateToLogin = () => {
  const navigate = useNavigate();
  const { token } = usePartnerContext();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
};

