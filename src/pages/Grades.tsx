import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
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

// Component
export default function Grades() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { role } = useUserStore();

  // Fetch grades with React Query
  const { data: grades = [], isLoading } = useQuery({
    queryKey: ["grades"],
    queryFn: async () => {
      const res = await api.get("/grades");
      return res.data.map((g: any) => ({
        id: g.id,
        studentName: g.student?.full_name ?? "N/A",
        subjectName: g.subject?.name ?? "N/A",
        gradingPeriod: g.grading_period,
        score: g.score,
        remarks: g.remarks ?? "",
      }));
    },
  });

  // Search filter
  const filtered = useMemo(
    () =>
      grades.filter(
        (r: GradeItem) =>
          q === "" ||
          r.studentName.toLowerCase().includes(q.toLowerCase()) ||
          r.subjectName.toLowerCase().includes(q.toLowerCase()) ||
          r.gradingPeriod.toLowerCase().includes(q.toLowerCase())
      ),
    [grades, q]
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

        return <Badge>{remarks || "—"}</Badge>;
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
        <Button onClick={() => navigate(`/${role}/grades/new`)}>
          <FaCirclePlus className="mr-2" />
          Add Grade
        </Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} isLoading={isLoading} />
    </div>
  );
}
