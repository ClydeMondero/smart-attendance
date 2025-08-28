import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { scrollToTop, scrollToElement } from "@/utils/scroll";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string; id?: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Links",
    links: [
      { name: "How it Works", href: "/", id: "how-it-works" },
      { name: "FAQS", href: "/", id: "faqs" },
    ],
  },
  {
    title: "Pages",
    links: [
      { name: "Home", href: "/" },
      { name: "Login", href: "/login" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaXTwitter className="size-5" />, href: "#", label: "X" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
  { icon: <FaYoutube className="size-5" />, href: "#", label: "YouTube" },
  { icon: <FaPinterest className="size-5" />, href: "#", label: "Pinterest" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const Footer = ({
  logo = {
    url: "/",
    src: "./logo-white.png",
    alt: "logo",
    title: "Smart Attendance",
  },
  sections = defaultSections,
  description = "Transform the way attendance is managed — quick scans, instant records, and automatic updates, all working in the background.",
  socialLinks = defaultSocialLinks,
  copyright = "2025 Smart Attendance All rights reserved.",
  legalLinks = defaultLegalLinks,
}: FooterProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (id: string) => {
    if (location.pathname !== "/") {
      // Navigate home with hash
      navigate(`/#${id}`);
    } else {
      // Already home, just scroll
      scrollToElement(id);
    }
  };

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => scrollToElement(id), 100);
    }
  }, [location]);

  return (
    <section className="bg-primary px-12 pt-12">
      <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
        <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
          {/* Logo */}
          <div className="flex items-center gap-2 lg:justify-start">
            <Link to={logo.url} className="flex items-center cursor-pointer">
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.title}
                className="w-10"
              />
              <span className="text-lg font-semibold text-primary-foreground">
                Smart Attendance
              </span>
            </Link>
          </div>
          <p className="text-muted max-w-[70%] text-sm">{description}</p>
        </div>
        <div className="grid w-full gap-6 grid-cols-2 lg:gap-20">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 text-primary-foreground font-bold">
                {section.title}
              </h3>
              <ul className="text-muted space-y-3 text-sm ">
                {section.links.map((link, linkIdx) => (
                  <li
                    key={linkIdx}
                    className="hover:text-primary-foreground font-medium"
                  >
                    {link.id ? (
                      <span
                        className="cursor-pointer"
                        onClick={() => handleLinkClick(link.id!)}
                      >
                        {link.name}
                      </span>
                    ) : (
                      <Link
                        to={link.href}
                        onClick={() => {
                          scrollToTop();
                        }}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="text-muted mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
        <p className="order-2 lg:order-1">{copyright}</p>
        <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
          {legalLinks.map((link, idx) => (
            <li key={idx} className="hover:text-primary-foreground">
              <Link to={link.href}> {link.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Footer;
