import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ user, redirectTo = "/" }) {
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
