import { Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Services from "./pages/Services";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import useUserStore from "./store/userStore";
import Requests from "./pages/Requests";
import SideBarLayout from "./layouts/SidebarLayou";

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
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route element={<PrivateRoute />}>
              <Route path="/services" element={<Services />} />
              <Route path="/requests" element={<Requests />} />
            </Route>

            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
      <BackToTop />
      {!isLoggedIn && <Footer />}
    </div>
  );
}
