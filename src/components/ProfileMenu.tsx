import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { scrollToTop } from "@/utils/scroll";
import { FaBook, FaChevronDown, FaUser, FaUserCircle } from "react-icons/fa";
import useUserStore from "@/store/userStore";
import { FaHouse } from "react-icons/fa6";
import { MdEmail, MdDashboard } from "react-icons/md";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { logout } = useUserStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg">
          <FaUserCircle className="text-2xl" /> Sample User{" "}
          <FaChevronDown className="text-xs text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
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
              navigate("/services");
              scrollToTop();
            }}
          >
            <MdDashboard /> Services
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigate("/profile");
              scrollToTop();
            }}
          >
            <FaUser /> My Profile
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            className="w-full "
            variant="default"
            onClick={() => {
              logout();
              navigate("/login");
              scrollToTop();
            }}
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
