import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaApple, FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Checkbox } from "@/components/ui/checkbox";
import { scrollToTop } from "@/utils/scroll";

export default function SignUp() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="md:min-h-[calc(100vh-60px)] bg-secondary flex flex-col items-center justify-center md:py-12">
      <Card className="w-full h-[calc(100vh-60px)] flex flex-col justify-center md:block md:max-w-sm md:h-fit">
        <CardHeader>
          <CardTitle className="text-center text-2xl fond-bold">
            Create account
          </CardTitle>
          <CardDescription className="text-center">
            Fill you information below or register with your social account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exampl@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative h-10 w-full">
                  {isShowPassword ? (
                    <FaEyeSlash
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 cursor-pointer"
                      onClick={() => setIsShowPassword(false)}
                    />
                  ) : (
                    <FaEye
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 cursor-pointer"
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
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative h-10 w-full">
                  {isShowConfirmPassword ? (
                    <FaEyeSlash
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 cursor-pointer"
                      onClick={() => setIsShowConfirmPassword(false)}
                    />
                  ) : (
                    <FaEye
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 cursor-pointer"
                      onClick={() => setIsShowConfirmPassword(true)}
                    />
                  )}
                  <Input
                    id="confirm-password"
                    type={isShowConfirmPassword ? "text" : "password"}
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
              navigate("/login");
              scrollToTop();
            }}
          >
            Sign Up
          </Button>
          <div className="w-full relative">
            <Separator orientation="horizontal" className="w-full" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background text-muted-foreground text-sm px-4">
              or sign up with
            </span>
          </div>
          <div className="w-full flex items-center justify-center gap-4">
            <Button variant="outline">
              <FaApple className="text-black" />
              Apple
            </Button>
            <Button variant="outline">
              <FcGoogle />
              Google
            </Button>
            <Button variant="outline">
              <FaFacebook className="text-blue-600" />
              Facebook
            </Button>
          </div>
          <Button variant="ghost" asChild className="w-full">
            <Link to="/login" className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <span className="text-primary">Login</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
