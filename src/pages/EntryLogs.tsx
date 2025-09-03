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
import { useNavigate } from "react-router";

// --- Types ---
type EntryLog = {
  id: string;
  date: string;
  name: string;
  studentId: string;
  gradeLevel: string;
  section: string;
  timeIn: string;
  timeOut: string;
  status: "Active" | "Inactive";
};

// --- Component ---
export default function EntryLogs() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Mock data (based on screenshot)
  const data = useMemo<EntryLog[]>(
    () => [
      {
        id: "1",
        date: "04/04/25",
        name: "Angelo",
        studentId: "202020202",
        gradeLevel: "Grade 1",
        section: "Class A",
        timeIn: "8:30 am",
        timeOut: "1:00 pm",
        status: "Active",
      },
      {
        id: "2",
        date: "04/04/25",
        name: "Maria",
        studentId: "202020203",
        gradeLevel: "Grade 1",
        section: "Class B",
        timeIn: "8:35 am",
        timeOut: "1:10 pm",
        status: "Active",
      },
    ],
    []
  );

  // Search filter
  const filtered = data.filter(
    (r) =>
      q === "" ||
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.studentId.includes(q)
  );

  // Table columns
  const columns: ColumnDef<EntryLog>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "studentId", header: "Student ID" },
    { accessorKey: "gradeLevel", header: "Grade Level" },
    { accessorKey: "section", header: "Section" },
    { accessorKey: "timeIn", header: "Time In" },
    { accessorKey: "timeOut", header: "Time Out" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as EntryLog["status"];
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
      <h2 className="text-xl font-semibold">Entry Logs</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <Input type="date" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Select Class <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Class A</DropdownMenuItem>
              <DropdownMenuItem>Class B</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Select Section <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Section 1</DropdownMenuItem>
              <DropdownMenuItem>Section 2</DropdownMenuItem>
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
