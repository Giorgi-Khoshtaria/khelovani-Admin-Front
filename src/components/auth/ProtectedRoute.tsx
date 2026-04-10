import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  requiredPermission?: string;
  allowedRoles?: string[];
  requireOwnership?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredPermission, 
  allowedRoles,
  requireOwnership = false
}) => {
  const { token, partnerId: userPartnerId } = usePartnerContext();
  const location = useLocation();
  const { id: urlId } = useParams<{ id: string }>();

  const decoded = parseJwt(token || "");
  const role = (decoded?.role || "").toLowerCase();
  const permissions: string[] = decoded?.permissions || [];

  const normalizedAllowedRoles = allowedRoles?.map(r => r.toLowerCase());

  const hasRole = normalizedAllowedRoles ? normalizedAllowedRoles.includes(role) : true;
  const hasPerm = requiredPermission ? (permissions.includes(requiredPermission) || role === "admin") : true;
  
  // Ownership check: Non-admins must match the ID in the URL if requireOwnership is set
  const isOwner = (requireOwnership && role !== "admin" && urlId) 
    ? (urlId === userPartnerId) 
    : true;

  const isAuthorized = hasRole && hasPerm && isOwner;

  useEffect(() => {
    if (token && !isAuthorized) {
      toast.error("თქვენ არ გაქვთ ამ გვერდზე წვდომის უფლება / Access Denied");
    }
  }, [token, isAuthorized]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    // Redirect Organizers to their own profile if they hit a forbidden page
    if (role === "organisation" && userPartnerId) {
       // Avoid redirecting to the same page if we are already there (prevents loops)
       if (location.pathname === "/profile" || location.pathname === `/partners/${userPartnerId}`) {
         return <Navigate to="/login" replace />; 
       }
       return <Navigate to="/profile" replace />;
    }
    return <Navigate to="/menu" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

