import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function dashboardPath(user) {
  if (user?.role === "employee") return "/admin-dashboard";
  return user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard";
}

function LoadingGate() {
  return <div className="route-loading" aria-label="Loading" />;
}

export function ProtectedRoute({ children, role, redirectTo = "/login" }) {
  const { authReady, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!authReady) return <LoadingGate />;

  if (!isAuthenticated) {
    const destination = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={redirectTo} replace state={{ from: destination }} />;
  }

  const allowedRoles = Array.isArray(role) ? role : role ? [role] : [];
  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={dashboardPath(user)} replace />;
  }

  return children;
}

export function GuestRoute({ children, allowAuthenticated = false }) {
  const { authReady, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!authReady) return <LoadingGate />;

  const params = new URLSearchParams(location.search);
  const hasResetCredential = Boolean(params.get("token") || params.get("otp"));

  if (isAuthenticated && !(allowAuthenticated && hasResetCredential)) {
    return <Navigate to={dashboardPath(user)} replace />;
  }

  return children;
}
