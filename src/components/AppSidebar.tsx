import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

// ====================
// Types
// ====================
type Role = "teacher" | "admin";

interface MenuItem {
  title: string;
  to: string;
  icon: React.ElementType;
  tooltip: string;
}

interface RoleMenus {
  navigation?: MenuItem[];
  attendance?: MenuItem[];
  academics?: MenuItem[];
  people?: MenuItem[];
  controls?: MenuItem[];
}

// ====================
// Role-based menu config
// ====================
const menus: Record<Role, RoleMenus> = {
  teacher: {
    attendance: [
      {
        title: "Entry Logs",
        to: "/teacher/entry",
        icon: ClipboardList,
        tooltip: "Check your attendance logs",
      },
      {
        title: "My Classes",
        to: "/teacher/classes",
        icon: BookOpen,
        tooltip: "Manage your classes",
      },
    ],
    academics: [
      {
        title: "My Subjects",
        to: "/teacher/subjects",
        icon: GraduationCap,
        tooltip: "View your subjects",
      },
      {
        title: "Grades",
        to: "/teacher/grades",
        icon: FileText,
        tooltip: "Input or view student grades",
      },
    ],
    people: [
      {
        title: "My Students",
        to: "/teacher/students",
        icon: Users,
        tooltip: "See your enrolled students",
      },
    ],
    controls: [
      {
        title: "Settings",
        to: "/teacher/settings",
        icon: Settings,
        tooltip: "Adjust your preferences",
      },
    ],
  },

  admin: {
    navigation: [
      {
        title: "Dashboard",
        to: "/admin/dashboard",
        icon: LayoutDashboard,
        tooltip: "Overview of system status",
      },
    ],
    attendance: [
      {
        title: "Entry Logs",
        to: "/admin/entry",
        icon: ClipboardList,
        tooltip: "Monitor all attendance logs",
      },
      {
        title: "Classes",
        to: "/admin/classes",
        icon: BookOpen,
        tooltip: "Manage classes",
      },
    ],
    academics: [
      {
        title: "Subjects",
        to: "/admin/subjects",
        icon: GraduationCap,
        tooltip: "Manage subjects",
      },
      {
        title: "Grades",
        to: "/admin/grades",
        icon: FileText,
        tooltip: "Review student grades",
      },
    ],
    people: [
      {
        title: "Students",
        to: "/admin/students",
        icon: Users,
        tooltip: "View and manage students",
      },
      {
        title: "Users",
        to: "/admin/users",
        icon: UserCog,
        tooltip: "Manage all user accounts",
      },
    ],
    controls: [
      {
        title: "Settings",
        to: "/admin/settings",
        icon: Settings,
        tooltip: "System configuration",
      },
    ],
  },
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useUserStore();
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (!isLoggedIn) {
      setOpen(false);
    }
  }, [isLoggedIn, setOpen]);

  // reusable render fn
  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => {
      const isActive = location.pathname === item.to;
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild size="lg">
            <Link
              to={item.to}
              onClick={scrollToTop}
              title={item.tooltip}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-md font-medium">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar>
      {/* Logo/Header */}
      <SidebarHeader className="h-[60px] flex items-center justify-center bg-background border-b-2">
        <Link
          to="/officer/pending"
          onClick={scrollToTop}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="./logo.png" alt="" className="w-10" />
          <span className="text-lg font-semibold text-primary">
            Smart Attendance
          </span>
        </Link>
      </SidebarHeader>

      {/* Dynamic menu content */}
      <SidebarContent className="pb-4">
        {role && (
          <>
            {/* Admin groups */}
            {role === "admin" && (
              <>
                {menus.admin.navigation && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.admin.navigation)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.admin.attendance && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Attendance</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.admin.attendance)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.admin.academics && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Academics</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.admin.academics)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.admin.people && (
                  <SidebarGroup>
                    <SidebarGroupLabel>People</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.admin.people)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.admin.controls && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Controls</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.admin.controls)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}
              </>
            )}
            {/* Teacher groups */}
            {role === "teacher" && (
              <>
                {menus.teacher.navigation && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.teacher.navigation)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.teacher.attendance && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Attendance</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.teacher.attendance)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.teacher.academics && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Academics</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.teacher.academics)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.teacher.people && (
                  <SidebarGroup>
                    <SidebarGroupLabel>People</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.teacher.people)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}

                {menus.teacher.controls && (
                  <SidebarGroup>
                    <SidebarGroupLabel>Controls</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {renderMenu(menus.teacher.controls)}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                )}
              </>
            )}
          </>
        )}
      </SidebarContent>

      {/* Footer: Profile & Logout */}
      <SidebarFooter className="p-3">
        {/* Profile card */}
        <div
          onClick={() => {
            navigate("/profile");
            scrollToTop();
          }}
          className="flex items-center gap-3 p-2 rounded-lg bg-muted cursor-pointer hover:bg-muted/80 transition"
        >
          <UserCircle className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="font-medium">Sample User</span>
            <span className="text-xs text-muted-foreground">
              {role === "teacher" ? "Teacher" : "Admin"}
            </span>
          </div>
        </div>

        <Separator />

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full mt-2 flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={() => {
            logout();
            navigate("/login");
            document.title = "Askadoer";
            scrollToTop();
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
