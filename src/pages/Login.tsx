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
import { useSidebar } from "@/components/ui/sidebar";
import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { scrollToTop } from "@/utils/scroll";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const { setOpen } = useSidebar();

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const res = await api.post("/login", {
        email: values.email,
        password: values.password,
      });

      const { user, token } = res.data;

      login(user, token);

      toast.success("Login successful");

      // Opens Sidebar
      setOpen(true);

      // Redirect based on role
      if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/unauthorized");
      }

      scrollToTop();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:min-h-[calc(100vh-60px)] bg-secondary flex flex-col items-center justify-center">
      <Card className="w-full h-[calc(100vh-60px)] flex flex-col justify-center md:block md:max-w-sm md:h-fit">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center">
            Hi! Welcome back!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="flex flex-col gap-6 pt-6">
                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
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
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={isShowPassword ? "text" : "password"}
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Submit */}
                <CardFooter className="flex-col gap-4 pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <p className="text-muted-foreground text-xs text-center">
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="underline hover:text-primary">
                      Terms & Conditions
                    </Link>
                    .
                  </p>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
