import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import { FaBook, FaChevronDown, FaUser, FaUserCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { logout, role } = useUserStore();
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
              navigate("/admin/dashboard");
              scrollToTop();
            }}
          >
            <MdDashboard /> Dashboard
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
              navigate("/settings");
              scrollToTop();
            }}
          >
            <FaBook /> Settings
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
