import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateUser, useUpdateUser, useUser } from "@/hooks/useUsers";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";

type UserFormData = {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "teacher" | "operator";
  status: "active" | "disabled";
};

// Create schema
const CreateUserSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["admin", "teacher", "operator"], "Invalid role")
    .required("Role is required"),
  status: Yup.string()
    .oneOf(["active", "disabled"], "Invalid status")
    .required("Status is required"),
});

// Edit schema
const EditUserSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
  role: Yup.string()
    .oneOf(["admin", "teacher", "operator"], "Invalid role")
    .required("Role is required"),
  status: Yup.string()
    .oneOf(["active", "disabled"], "Invalid status")
    .required("Status is required"),
});

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [showPassword, setShowPassword] = useState(false);

  const { data, isLoading } = useUser(id);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/admin/users")}>
                Users
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEdit ? "Edit User" : "Create User"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 space-y-5 p-6 rounded-md">
            {Array.from({ length: isEdit ? 4 : 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const initialValues: UserFormData = {
    name: data?.name || "",
    email: data?.email || "",
    password: "",
    role: data?.role || "teacher",
    status: data?.status || "active",
  };

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/admin/users")}>
              Users
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit ? "Edit User" : "Create User"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 p-6 rounded-md">
          <Formik
            initialValues={initialValues}
            validationSchema={isEdit ? EditUserSchema : CreateUserSchema}
            onSubmit={(values, { setSubmitting }) => {
              if (isEdit && id) {
                updateUser.mutate(
                  { id, ...values },
                  { onSuccess: () => navigate("/admin/users") }
                );
              } else {
                createUser.mutate(values as Required<UserFormData>, {
                  onSuccess: () => navigate("/admin/users"),
                });
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Password */}
                {!isEdit && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Set a password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={values.role}
                    onValueChange={(val) => setFieldValue("role", val)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="role"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={values.status}
                    onValueChange={(val) => setFieldValue("status", val)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="status"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting || createUser.isPending || updateUser.isPending
                  }
                >
                  {isSubmitting ||
                  createUser.isPending ||
                  updateUser.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : isEdit ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
