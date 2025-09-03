import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";

// --- Types ---
type GradeItem = {
  id: string;
  studentName: string;
  subjectName: string;
  gradingPeriod: string;
  score: number;
  remarks: string;
};

// --- Component ---
export default function Grades() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  // Mock data
  const data = useMemo<GradeItem[]>(
    () => [
      {
        id: "1",
        studentName: "Juan Dela Cruz",
        subjectName: "Mathematics",
        gradingPeriod: "1st Quarter",
        score: 89.5,
        remarks: "Good performance",
      },
      {
        id: "2",
        studentName: "Maria Santos",
        subjectName: "Science",
        gradingPeriod: "1st Quarter",
        score: 92.0,
        remarks: "Excellent",
      },
      {
        id: "3",
        studentName: "Pedro Reyes",
        subjectName: "English",
        gradingPeriod: "1st Quarter",
        score: 74.0,
        remarks: "Needs improvement",
      },
    ],
    []
  );

  // Search filter
  const filtered = data.filter(
    (r) =>
      q === "" ||
      r.studentName.toLowerCase().includes(q.toLowerCase()) ||
      r.subjectName.toLowerCase().includes(q.toLowerCase()) ||
      r.gradingPeriod.toLowerCase().includes(q.toLowerCase())
  );

  // Table columns
  const columns: ColumnDef<GradeItem>[] = [
    { accessorKey: "studentName", header: "Student Name" },
    { accessorKey: "subjectName", header: "Subject" },
    { accessorKey: "gradingPeriod", header: "Grading Period" },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("score")}</span>
      ),
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }) => {
        const remarks = row.getValue("remarks") as string;
        let color = "bg-gray-200 text-gray-700";

        if (remarks.toLowerCase().includes("excellent"))
          color = "bg-green-100 text-green-800";
        if (remarks.toLowerCase().includes("needs improvement"))
          color = "bg-red-100 text-red-800";

        return <Badge className={color}>{remarks}</Badge>;
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Grades</h2>

      {/* Filters */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search by student, subject, or grading period..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => navigate("/admin/grades/new")}>
          <FaCirclePlus className="mr-2" />
          Add Grade
        </Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
