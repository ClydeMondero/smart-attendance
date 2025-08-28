import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { scrollToTop } from "@/utils/scroll";
import { FaBook } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router";

export default function Menu() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MenuIcon /> Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Links</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate("/");
            scrollToTop();
          }}
        >
          <FaHouse /> Home
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            navigate("/about");
            scrollToTop();
          }}
        >
          <FaBook /> About
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigate("/contact");
            scrollToTop();
          }}
        >
          <MdEmail /> Contact us
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* Call to action buttons */}
          <Button
            onClick={() => {
              navigate("/login");
              scrollToTop();
            }}
            className="w-full"
          >
            Login
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
