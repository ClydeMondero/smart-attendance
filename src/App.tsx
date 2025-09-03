import { Route, Routes } from "react-router";
import "./App.css";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import SideBarLayout from "./layouts/SidebarLayou";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import useUserStore from "./store/userStore";

export default function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-1">
        <Routes>
          <Route element={<SideBarLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />

            {/* Teacher Routes */}
            {/* <Route element={<PrivateRoute allowedRoles={["teacher"]} />}>
              <Route path="/officer/pending" element={<Pending />} />
            </Route> */}

            <Route path="/unauthorized" element={<NotAuthorized />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
      <BackToTop />
      {!isLoggedIn && <Footer />}
    </div>
  );
}
