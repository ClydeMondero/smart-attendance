import { Navigate, Outlet } from "react-router";
import useUserStore from "../store/userStore";

interface PrivateRouteProps {
  allowedRoles?: ("teacher" | "admin")[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const role = useUserStore((state) => state.role);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
