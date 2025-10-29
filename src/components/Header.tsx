import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import { useTour } from "@reactour/tour";
import { motion } from "framer-motion";
import { Download, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ProfileMenu from "./ProfileMenu";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { isLoggedIn } = useUserStore();
  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    if (isLoggedIn) {
      const hasSeenTour = localStorage.getItem("hasSeenTour");

      if (!hasSeenTour) {
        setTimeout(() => {
          setCurrentStep(0);
          setIsOpen(true);
          localStorage.setItem("hasSeenTour", "true");
        }, 1000);
      }
    }
  }, [isLoggedIn, setIsOpen, setCurrentStep]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ PWA installation accepted");
    }
    setDeferredPrompt(null);
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full h-15 sticky top-0 z-[40] px-4 flex items-center justify-between border-b-2 bg-background md:px-12"
    >
      <div className="flex items-center gap-8">
        {isLoggedIn ? (
          <SidebarTrigger />
        ) : (
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
        )}
      </div>

      {!isLoggedIn && (
        <div className="items-center gap-4 flex">
          <Button asChild onClick={scrollToTop} className="hidden md:block">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      )}

      {isLoggedIn && (
        <div className="flex items-center gap-2">
          {/* 📱 Operator Mobile App Download */}
          <Button
            variant="ghost"
            aria-label="Download Operator Mobile App"
            asChild
          >
            <Link
              to="https://drive.google.com/file/d/1XNX1iIvyZgHLgO4lg_BJVxMf9CQtVYR6/view"
              target="_blank"
            >
              <Download className="h-5 w-5 mr-1" />
              Operator Mobile App
            </Link>
          </Button>

          {deferredPrompt && (
            <Button
              variant="ghost"
              aria-label="Install Web App"
              onClick={handleInstallPWA}
            >
              <Download className="h-5 w-5 mr-1" />
              Install Web App
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsOpen(true);
              setCurrentStep(0);
            }}
            aria-label="Start tutorial"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <div className="profile">
            <ProfileMenu />
          </div>
        </div>
      )}
    </motion.div>
  );
}
