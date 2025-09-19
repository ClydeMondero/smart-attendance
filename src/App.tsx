import { Route, Routes } from "react-router";
import "./App.css";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "./components/ui/sonner";
import SideBarLayout from "./layouts/SidebarLayou";
import ClassAttendanceLog from "./pages/ClassAttendanceLog";
import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";
import EntryLogs from "./pages/EntryLogs";
import Grades from "./pages/Grades";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/Setting";
import SignUp from "./pages/SignUp";
import StudentDetails from "./pages/StudentDetails";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import UserForm from "./pages/UserForm";
import Users from "./pages/Users";
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

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/entry" element={<EntryLogs />} />
              <Route path="/admin/classes" element={<Classes />} />
              <Route
                path="/admin/classes/:id"
                element={<ClassAttendanceLog />}
              />
              <Route path="/admin/subjects" element={<Subjects />} />
              <Route path="/admin/grades" element={<Grades />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/students/:id" element={<StudentDetails />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/new" element={<UserForm />} />
              <Route path="/admin/users/:id/edit" element={<UserForm />} />
            </Route>

            <Route
              element={<PrivateRoute allowedRoles={["admin", "teacher"]} />}
            >
              <Route path="/profile" element={<SettingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="/unauthorized" element={<NotAuthorized />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
      <BackToTop />
      {!isLoggedIn && <Footer />}
      <Toaster richColors position="top-right" />
    </div>
  );
}
