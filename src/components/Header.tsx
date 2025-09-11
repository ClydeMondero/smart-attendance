import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router";
import ProfileMenu from "./ProfileMenu";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

/**
 * Header component
 * @returns {JSX.Element}
 * @constructor
 */
export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      // check if the user is scrolling down
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        // hide the header when scrolling down
        setHidden(true);
      } else {
        // show the header when scrolling up
        setHidden(false);
      }
      // update the last scroll position
      setLastScrollY(window.scrollY);
    };

    // add the event listener for scrolling
    window.addEventListener("scroll", handleScroll);
    // remove the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      // initial position of the header
      initial={{ y: 0 }}
      // animate the header's position based on the hidden state
      animate={{ y: hidden ? -80 : 0 }}
      // animation configuration
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      // CSS classes for the header
      className="w-full h-15 sticky top-0 z-[40] px-4 flex items-center justify-between border-b-2 bg-background md:px-12 "
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
        {/* Logo and link to the home page */}
      </div>

      {!isLoggedIn && (
        <>
          <div className="items-center gap-4 flex">
            {/* Call to action buttons */}
            <Button asChild onClick={scrollToTop} className="hidden md:block">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </>
      )}

      {isLoggedIn && (
        <div className="flex items-center">
          <Button variant="ghost" size={"icon"}>
            <FaBell className="text-muted-foreground" />
          </Button>
          <ProfileMenu />
        </div>
      )}
    </motion.div>
  );
}
