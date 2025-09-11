import useUserStore from "@/store/userStore";
import { Navigate, Outlet } from "react-router";

interface PrivateRouteProps {
  allowedRoles?: ("teacher" | "admin")[]; // adjust roles
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { role, isLoggedIn } = useUserStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
