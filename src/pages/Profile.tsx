import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserStore from "@/store/userStore";

export default function Profile() {
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 p-4">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      <h2 className="text-xl font-semibold">Profile</h2>

      {/* Form-like layout */}
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-neutral-900 p-6 rounded-md space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={user.name} readOnly />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user.email} readOnly />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={user.role} disabled>
            <SelectTrigger id="role">
              <SelectValue placeholder="Role" />
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
          <Select value={user.status} disabled>
            <SelectTrigger id="status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
