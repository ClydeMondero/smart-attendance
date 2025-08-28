// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router";
import useUserStore from "../store/userStore";

export default function PrivateRoute() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
