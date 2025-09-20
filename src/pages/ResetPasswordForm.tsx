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
import { useConfirmResetPassword } from "@/hooks/useUsers";
import useUserStore from "@/store/userStore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import * as Yup from "yup";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { logout } = useUserStore();

  useEffect(() => {
    logout();
  }, []);

  // Extract token + email from URL
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const resetPassword = useConfirmResetPassword();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      resetPassword.mutate(
        { token, email, ...values },
        {
          onSuccess: () => {
            toast.success("Password reset successfully");
            navigate("/login");
          },
          onError: (err: any) => {
            toast.error(
              err.response?.data?.message || "Failed to reset password"
            );
          },
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:min-h-[calc(100vh-60px)] bg-secondary flex flex-col items-center justify-center">
      <Card className="w-full h-[calc(100vh-60px)] flex flex-col justify-center md:block md:max-w-sm md:h-fit">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ password: "", password_confirmation: "" }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="flex flex-col gap-6 pt-6">
                  {/* Email (readonly) */}
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} readOnly />
                  </div>

                  {/* New Password */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">New Password</Label>
                    </div>
                    <div className="relative h-10 w-full">
                      {showPassword ? (
                        <FaEyeSlash
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <FaEye
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password_confirmation">
                        Confirm Password
                      </Label>
                    </div>
                    <Field
                      as={Input}
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                    />
                    <ErrorMessage
                      name="password_confirmation"
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
                      "Reset Password"
                    )}
                  </Button>
                </CardFooter>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
