import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function SideBarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />
        <Outlet />
        <SimpleFooter />
      </main>
    </SidebarProvider>
  );
}
