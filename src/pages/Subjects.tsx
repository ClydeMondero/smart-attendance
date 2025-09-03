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
import { ChevronDown, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";

// --- Types ---
type SubjectItem = {
  id: string;
  subjectName: string;
  className: string;
  status: "Active" | "Inactive";
};

// --- Component ---
export default function Subjects() {
  const [q, setQ] = useState("");

  // Mock data (replace with API later)
  const data = useMemo<SubjectItem[]>(
    () => [
      {
        id: "1",
        subjectName: "Mathematics",
        className: "Grade 1 - Class A",
        status: "Active",
      },
      {
        id: "2",
        subjectName: "Science",
        className: "Grade 1 - Class B",
        status: "Active",
      },
      {
        id: "3",
        subjectName: "English",
        className: "Grade 2 - Class A",
        status: "Inactive",
      },
    ],
    []
  );

  // Search filter
  const filtered = data.filter(
    (r) =>
      q === "" ||
      r.subjectName.toLowerCase().includes(q.toLowerCase()) ||
      r.className.toLowerCase().includes(q.toLowerCase())
  );

  // Table columns
  const columns: ColumnDef<SubjectItem>[] = [
    { accessorKey: "subjectName", header: "Subject Name" },
    { accessorKey: "className", header: "Class" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as SubjectItem["status"];
        const color =
          status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-200 text-gray-700";
        return <Badge className={color}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button size="icon" variant="outline">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Subjects</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search by subject or class..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Select Status <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline">Export to CSV</Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
