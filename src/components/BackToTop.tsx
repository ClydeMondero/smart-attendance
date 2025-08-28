import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { scrollToTop } from "../utils/scroll";
import { motion } from "framer-motion";

const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;

      if (window.scrollY > 80 && !isAtBottom) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    show && (
      <motion.button
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          transition: { duration: 0.5, ease: "easeOut" },
        }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 rounded-full  bg-white p-3 shadow-lg hover:bg-primary hover:text-white transition cursor-pointer"
        aria-label="Back to top"
      >
        <IoIosArrowUp className="h-5 w-5 font-bold" />
      </motion.button>
    )
  );
};

export default BackToTop;
