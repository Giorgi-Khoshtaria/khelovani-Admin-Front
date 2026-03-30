import { useNavigate } from "react-router-dom";
import { usePartnerContext } from "@/context/PartnerContext";

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = usePartnerContext();

  return () => {
    logout();
    navigate("/login");
  };
};

