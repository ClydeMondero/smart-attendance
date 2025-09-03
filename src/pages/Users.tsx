import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";

// --- Types ---
type UserItem = {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "teacher" | "operator";
  status: "active" | "disabled";
};

// --- Component ---
export default function Users() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Mock data
  const data = useMemo<UserItem[]>(
    () => [
      {
        id: "1",
        fullName: "Admin User",
        email: "admin@school.com",
        role: "admin",
        status: "active",
      },
      {
        id: "2",
        fullName: "Jane Teacher",
        email: "jane.teacher@school.com",
        role: "teacher",
        status: "active",
      },
      {
        id: "3",
        fullName: "John Operator",
        email: "john.operator@school.com",
        role: "operator",
        status: "disabled",
      },
    ],
    []
  );

  // Search filter
  const filtered = data.filter(
    (r) =>
      q === "" ||
      r.fullName.toLowerCase().includes(q.toLowerCase()) ||
      r.email.toLowerCase().includes(q.toLowerCase()) ||
      r.role.toLowerCase().includes(q.toLowerCase()) ||
      r.status.toLowerCase().includes(q.toLowerCase())
  );

  // Table columns
  const columns: ColumnDef<UserItem>[] = [
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserItem["role"];
        let color = "bg-gray-200 text-gray-700";

        if (role === "admin") color = "bg-red-100 text-red-800";
        if (role === "teacher") color = "bg-blue-100 text-blue-800";
        if (role === "operator") color = "bg-green-100 text-green-800";

        return <Badge className={color}>{role}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as UserItem["status"];
        let color = "bg-gray-200 text-gray-700";

        if (status === "active") color = "bg-green-100 text-green-800";
        if (status === "disabled") color = "bg-red-100 text-red-800";

        return <Badge className={color}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="flex items-center">
                Actions <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => navigate(`/admin/users/${user.id}`)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/admin/users/${user.id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Disable user:", user, user.status)}
              >
                Disable
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => console.log("Reset password: ", user)}
              >
                Reset Password
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Users</h2>

      {/* Filters */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search by name, email, role, or status..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => navigate("/admin/users/new")}>
          <FaCirclePlus className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
