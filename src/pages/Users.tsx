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
import {
  useDeleteUser,
  useResetPassword,
  type UserItem,
  useToggleStatus,
  useUsers,
} from "@/hooks/useUsers";
import { convertToCSV, downloadCSV } from "@/utils/csv";
import { exportToPDF } from "@/utils/pdf";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Download, FileText } from "lucide-react";
import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Users() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Queries
  const { data, isLoading } = useUsers();
  const users = data ?? [];

  // Mutations
  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleStatus();
  const resetPassword = useResetPassword();

  // Search filter
  const filtered = users.filter(
    (r) =>
      q === "" ||
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.email.toLowerCase().includes(q.toLowerCase()) ||
      r.role.toLowerCase().includes(q.toLowerCase()) ||
      r.status.toLowerCase().includes(q.toLowerCase())
  );

  // Table columns
  const columns: ColumnDef<UserItem>[] = [
    { accessorKey: "name", header: "Full Name" },
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
                onClick={() =>
                  toggleStatus.mutate({
                    id: user.id,
                    status: user.status === "active" ? "disabled" : "active",
                  })
                }
              >
                {user.status === "active" ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  resetPassword.mutate({ id: user.id, email: user.email })
                }
              >
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => deleteUser.mutate(user.id)}
              >
                Delete
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const csv = convertToCSV(data ?? [], columns);
              if (!csv) return toast.error("No data to export");
              downloadCSV(csv, "users.csv");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const exportColumns = columns.map((col: any) => ({
                header:
                  typeof col.header === "string"
                    ? col.header
                    : col.meta?.csvHeader || "",
                accessorKey: col.accessorKey,
                id: col.id,
              }));

              exportToPDF({
                rows: data ?? [],
                columns: exportColumns,
                filename: "users.pdf",
                title: "Users Report",
                websiteName: "Smart Attendance",
                logoUrl: "/logo.png",
              });
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>

          <Button onClick={() => navigate("/admin/users/new")}>
            <FaCirclePlus className="mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} isLoading={isLoading} />
    </div>
  );
}
