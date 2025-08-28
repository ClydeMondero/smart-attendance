import { animate } from "motion/react";

export const scrollToTop = () => {
  const currentY = window.scrollY;

  animate(currentY, 0, {
    delay: 0.25,
    duration: 0.6,
    ease: "easeOut",
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
  });
};

export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset - 60;
    animate(window.scrollY, y, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate: (latest: number) => window.scrollTo(0, latest),
    });
  }
};
