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
import api from "@/lib/api"; // axios wrapper
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

type UserFormData = {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "teacher" | "operator";
  status: "active" | "disabled";
};

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    status: "active",
  });

  // Load user when editing
  useEffect(() => {
    if (isEdit) {
      api.get(`/users/${id}`).then((res) => {
        setForm({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          status: res.data.status,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await api.put(`/users/${id}`, form);
    } else {
      await api.post("/users", form);
    }
    navigate("/admin/users");
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

      {/* Form container */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 ">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
              />
            </div>

            {/* Password (only when creating) */}
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Set a password"
                />
              </div>
            )}

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  handleChange("role", value as UserFormData["role"])
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  handleChange("status", value as UserFormData["status"])
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
