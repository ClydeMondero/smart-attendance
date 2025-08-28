import {
  FaHome,
  FaUser,
  FaWallet,
  FaBell,
  FaHeart,
  FaInbox,
  FaQuestionCircle,
  FaPhone,
} from "react-icons/fa";
import { Link, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { scrollToTop } from "@/utils/scroll";
import { FaHouse } from "react-icons/fa6";

import useUserStore from "@/store/userStore";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

// Menu items.
const publicItems = [
  {
    title: "Home",
    to: "/",
    icon: FaHouse,
  },
  {
    title: "About",
    to: "/about",
    icon: FaQuestionCircle,
  },
  {
    title: "Contact us",
    to: "/contact",
    icon: FaPhone,
  },
];

const managementItems = [
  {
    title: "Services",
    to: "/services",
    icon: FaUser,
  },
  {
    title: "Requests",
    to: "/requests",
    icon: FaUser,
  },
  {
    title: "My Profile",
    to: "/profile",
    icon: FaUser,
  },
  {
    title: "Wallets and Rewards",
    to: "/wallets",
    icon: FaWallet,
  },
  {
    title: "Messages",
    to: "/messages",
    icon: FaInbox,
  },
  {
    title: "Notifications",
    to: "/notifications",
    icon: FaBell,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: FaHeart,
  },
];

export function AppSidebar() {
  const location = useLocation();

  const { isLoggedIn } = useUserStore();
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (!isLoggedIn) {
      setOpen(false);
    }
  }, [isLoggedIn, setOpen]);

  return (
    <Sidebar>
      <SidebarHeader className="h-[60px] flex items-center justify-center bg-background border-b-2">
        <Link
          to="/"
          onClick={scrollToTop}
          className="flex items-center cursor-pointer"
        >
          <img src="./logo.png" alt="" className="w-10" />
          <span className="text-lg font-semibold text-primary">
            Smart Attendance
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pb-4">
        <SidebarGroup>
          <SidebarGroupLabel>PUBLIC</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <Link
                        to={item.to}
                        onClick={scrollToTop}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : ""
                        }`}
                      >
                        <item.icon className="text-md" />
                        <span className="text-md font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>MANAGEMENT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <Link
                        to={item.to}
                        onClick={scrollToTop}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : ""
                        }`}
                      >
                        <item.icon className="text-md" />
                        <span className="text-md font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
