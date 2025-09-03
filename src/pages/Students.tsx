import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scrollToTop } from "@/utils/scroll";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";

// --- Types ---
type StudentItem = {
  id: string;
  fullName: string;
  barcode: string;
  className: string;
  parentContact: string;
};

// --- Component ---
export default function Students() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Mock data
  const data = useMemo<StudentItem[]>(
    () => [
      {
        id: "1",
        fullName: "Juan Dela Cruz",
        barcode: "STU-001",
        className: "Grade 10 - Section A",
        parentContact: "09171234567",
      },
      {
        id: "2",
        fullName: "Maria Santos",
        barcode: "STU-002",
        className: "Grade 9 - Section B",
        parentContact: "09187654321",
      },
      {
        id: "3",
        fullName: "Pedro Reyes",
        barcode: "STU-003",
        className: "Grade 11 - STEM",
        parentContact: "09221234567",
      },
    ],
    []
  );

  // Search filter
  const filtered = data.filter(
    (r) =>
      q === "" ||
      r.fullName.toLowerCase().includes(q.toLowerCase()) ||
      r.barcode.toLowerCase().includes(q.toLowerCase()) ||
      r.className.toLowerCase().includes(q.toLowerCase())
  );

  // Table columns
  // Table columns
  const columns: ColumnDef<StudentItem>[] = [
    {
      id: "barcodePlaceholder",
      header: "Barcode",
      cell: ({ row }) => (
        <div className="w-24 h-8 bg-muted flex items-center justify-center text-xs text-muted-foreground rounded">
          {row.original.barcode || "N/A"}
        </div>
      ),
    },
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "parentContact", header: "Parent Contact" },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="default"
            onClick={() => {
              navigate("/admin/classes/1");
              scrollToTop();
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
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
      <h2 className="text-xl font-semibold">Students</h2>

      {/* Filters */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search by name, barcode, or class..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => navigate("/admin/students/new")}>
          <FaCirclePlus className="mr-2" />
          Add Student
        </Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
