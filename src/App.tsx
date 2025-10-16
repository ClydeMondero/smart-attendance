import { Route, Routes } from "react-router";
import "./App.css";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "./components/ui/sonner";
import SideBarLayout from "./layouts/SidebarLayout";
import Announcement from "./pages/Announcement";
import ClassAttendanceLog from "./pages/ClassAttendanceLog";
import Classes from "./pages/Classes";
import ClassesForm from "./pages/ClassForm";
import Dashboard from "./pages/Dashboard";
import EntryLogs from "./pages/EntryLogs";
import GradeForm from "./pages/GradeForm";
import Grades from "./pages/Grades";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import Setting from "./pages/Setting";
import SignUp from "./pages/SignUp";
import StudentDetails from "./pages/StudentDetails";
import StudentForm from "./pages/StudentForm";
import Students from "./pages/Students";
import SubjectAttendanceLog from "./pages/SubjectAttendanceLog";
import SubjectForm from "./pages/SubjectForm";
import Subjects from "./pages/Subjects";
import Terms from "./pages/Terms";
import UserForm from "./pages/UserForm";
import Users from "./pages/Users";
import UserView from "./pages/UserView";
import useUserStore from "./store/userStore";

export default function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-1">
        <Routes>
          <Route element={<SideBarLayout />}>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/" element={<Home />} />

            {/* Teacher Routes */}
            <Route element={<PrivateRoute allowedRoles={["teacher"]} />}>
              <Route path="/teacher/classes" element={<Classes />} />
              <Route
                path="/teacher/classes/:id"
                element={<ClassAttendanceLog />}
              />
              <Route path="/teacher/subjects" element={<Subjects />} />
              <Route
                path="/teacher/subjects/:id"
                element={<SubjectAttendanceLog />}
              />

              <Route path="/teacher/grades" element={<Grades />} />
              <Route path="/teacher/grades/new" element={<GradeForm />} />

              <Route path="/teacher/students" element={<Students />} />
              <Route
                path="/teacher/students/:id"
                element={<StudentDetails />}
              />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/entry" element={<EntryLogs />} />
              <Route path="/admin/classes" element={<Classes />} />
              <Route
                path="/admin/classes/:id"
                element={<ClassAttendanceLog />}
              />
              <Route path="/admin/classes/new" element={<ClassesForm />} />
              <Route path="/admin/classes/:id/edit" element={<ClassesForm />} />

              <Route path="/admin/subjects" element={<Subjects />} />
              <Route path="/admin/subjects/new" element={<SubjectForm />} />
              <Route
                path="/admin/subjects/:id/edit"
                element={<SubjectForm />}
              />
              <Route
                path="/admin/subjects/:id"
                element={<SubjectAttendanceLog />}
              />

              <Route path="/admin/grades" element={<Grades />} />
              <Route path="/admin/grades/new" element={<GradeForm />} />

              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/students/new" element={<StudentForm />} />
              <Route
                path="/admin/students/:id/edit"
                element={<StudentForm />}
              />
              <Route path="/admin/students/:id" element={<StudentDetails />} />

              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/new" element={<UserForm />} />
              <Route path="/admin/users/:id" element={<UserView />} />
              <Route path="/admin/users/:id/edit" element={<UserForm />} />
              <Route path="/admin/settings" element={<Setting />} />

              <Route path="/admin/announcement" element={<Announcement />} />
            </Route>

            <Route
              element={<PrivateRoute allowedRoles={["admin", "teacher"]} />}
            >
              <Route path="/profile" element={<Profile />} />
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
