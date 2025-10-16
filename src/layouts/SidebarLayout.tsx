import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { SidebarProvider } from "@/components/ui/sidebar";
import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import { TourProvider } from "@reactour/tour";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";

const queryClient = new QueryClient();

export default function SideBarLayout() {
  const { isLoggedIn, role } = useUserStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Recompute navigation map whenever role changes
  const navigationMap = useMemo(() => {
    const baseMap: Array<string | null> = [null];

    if (role === "admin") {
      baseMap.push(`/${role}/dashboard`, `/${role}/entry`);
    }

    baseMap.push(
      `/${role}/classes`,
      `/${role}/subjects`,
      `/${role}/grades`,
      `/${role}/students`
    );

    if (role === "admin") {
      baseMap.push(`/${role}/settings`, null);
    }

    return baseMap;
  }, [role]);

  // Recompute tour steps whenever role changes
  const steps = useMemo(
    () => [
      {
        selector: ".sidebar",
        content:
          "Use the sidebar to quickly access all major parts of the system, including dashboard, classes, subjects, grades, students, and settings. This will save you time navigating between pages.",
      },
      ...(role === "admin"
        ? [
            {
              selector: "[data-tour='dashboard']",
              content:
                "The dashboard shows attendance trends and summaries. You can quickly identify classes with frequent absences or late entries and take appropriate action.",
            },
            {
              selector: "[data-tour='entryLogs']",
              content:
                "Here you can view all student entry and exit logs. It helps track punctuality, gate access, and overall attendance.",
            },
          ]
        : []),
      {
        selector: "[data-tour='classes']",
        content:
          "Manage all your classes from this page. You can view classes, assign teachers by creating new classes, and record attendance.",
      },
      {
        selector: "[data-tour='subjects']",
        content:
          "Subjects are organized here. You can assign subjects to classes, track subject-specific attendance, and manage teachers responsible for each subject.",
      },
      {
        selector: "[data-tour='grades']",
        content:
          "Track and update student grades for each subject. This allows you to monitor performance and generate grade report cards.",
      },
      {
        selector: "[data-tour='students']",
        content:
          "Access individual student records, including personal details, attendance history, and grades. This page also allows you to update records.",
      },
      ...(role === "admin"
        ? [
            {
              selector: "[data-tour='settings']",
              content:
                "Configure message templates for automatic notifications.",
            },
          ]
        : []),
      {
        selector: ".profile",
        content: "View and update your account profile information.",
      },
    ],
    [role]
  );

  // Navigate when step changes
  const handleStepChange = (value: React.SetStateAction<number>) => {
    const newStep = typeof value === "function" ? value(step) : value;

    if (navigationMap[newStep]) {
      navigate(navigationMap[newStep], { replace: true });
    }

    scrollToTop();
    setTimeout(() => setStep(newStep), 100);
  };

  return (
    <TourProvider
      key={role} // Force remount to prevent stale steps
      steps={steps}
      currentStep={step}
      setCurrentStep={handleStepChange}
      scrollSmooth
      showNavigation
      showBadge
      disableInteraction={false}
    >
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
    </TourProvider>
  );
}
