import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { SidebarProvider } from "@/components/ui/sidebar";
import useUserStore from "@/store/userStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";

const queryClient = new QueryClient();

export default function SideBarLayout() {
  const { isLoggedIn } = useUserStore();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        {isLoggedIn && <AppSidebar />}
        <main className="w-full">
          <Header />
          <Outlet />
          {isLoggedIn && <SimpleFooter />}
        </main>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
