import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const { setOpen } = useSidebar();

  return (
    <div className="md:min-h-[calc(100vh-60px)] bg-secondary flex flex-col items-center justify-center">
      <Card className="w-full h-[calc(100vh-60px)] flex flex-col justify-center md:block md:max-w-sm md:h-fit">
        <CardHeader>
          <CardTitle className="text-center text-2xl fond-bold">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center">
            Hi! Welcome back!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center">
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm  hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div className="relative h-10 w-full">
                  {isShowPassword ? (
                    <FaEyeSlash
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10"
                      onClick={() => setIsShowPassword(false)}
                    />
                  ) : (
                    <FaEye
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10"
                      onClick={() => setIsShowPassword(true)}
                    />
                  )}
                  <Input
                    id="password"
                    type={isShowPassword ? "text" : "password"}
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-6 pt-6">
          <div className="flex items-start gap-3">
            <Checkbox id="terms-1" />
            <div className="grid gap-2">
              <Label htmlFor="terms-1">
                <Link
                  to="/terms"
                  className="cursor-pointer"
                  onClick={() => scrollToTop()}
                >
                  Accept terms and conditions
                </Link>
              </Label>
              <p className="text-muted-foreground text-sm">
                By clicking this checkbox, you agree to the terms and
                conditions.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            onClick={() => {
              login("teacher");
              navigate("/teacher/dashboard");
              setOpen(true);
              scrollToTop();
            }}
          >
            Login as Teacher
          </Button>

          <Button
            type="submit"
            className="w-full"
            onClick={() => {
              login("admin");
              navigate("/admin/dashboard");
              setOpen(true);
              scrollToTop();
            }}
          >
            Login as Admin
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
