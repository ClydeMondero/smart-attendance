import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { SidebarProvider } from "@/components/ui/sidebar";
import useUserStore from "@/store/userStore";
import { Outlet } from "react-router";

export default function SideBarLayout() {
  const { isLoggedIn } = useUserStore();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />
        <Outlet />
        {isLoggedIn && <SimpleFooter />}
      </main>
    </SidebarProvider>
  );
}
