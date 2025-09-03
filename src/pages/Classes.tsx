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
type ClassItem = {
  id: string;
  gradeLevel: string;
  section: string;
  teacher: string;
  schoolYear: string;
  status: "Active" | "Inactive";
};

// --- Component ---
export default function Classes() {
  const [q, setQ] = useState("");

  // Mock data
  const data = useMemo<ClassItem[]>(
    () => [
      {
        id: "1",
        gradeLevel: "Grade 1",
        section: "Class A",
        teacher: "Mr. Smith",
        schoolYear: "2024-2025",
        status: "Active",
      },
      {
        id: "2",
        gradeLevel: "Grade 1",
        section: "Class B",
        teacher: "Ms. Johnson",
        schoolYear: "2024-2025",
        status: "Active",
      },
      {
        id: "3",
        gradeLevel: "Grade 2",
        section: "Class A",
        teacher: "Mrs. Lee",
        schoolYear: "2023-2024",
        status: "Inactive",
      },
    ],
    []
  );

  // Search filter
  const filtered = data.filter(
    (r) =>
      q === "" ||
      r.section.toLowerCase().includes(q.toLowerCase()) ||
      r.teacher.toLowerCase().includes(q.toLowerCase())
  );

  // Table columns
  const columns: ColumnDef<ClassItem>[] = [
    { accessorKey: "gradeLevel", header: "Grade Level" },
    { accessorKey: "section", header: "Section" },
    { accessorKey: "teacher", header: "Teacher" },
    { accessorKey: "schoolYear", header: "School Year" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as ClassItem["status"];
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
      <h2 className="text-xl font-semibold">Classes</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search by section or teacher..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Select Grade Level <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Grade 1</DropdownMenuItem>
              <DropdownMenuItem>Grade 2</DropdownMenuItem>
              <DropdownMenuItem>Grade 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
