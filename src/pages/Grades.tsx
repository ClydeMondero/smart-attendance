import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useToggleSettings } from "@/hooks/useSettings";
import { useSyncSettings } from "@/hooks/useSyncSettings";
import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import useSettingStore from "@/store/useSettingStore";
import { convertToCSV, downloadCSV } from "@/utils/csv";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { LockIcon, LockOpenIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// --- Types ---
type GradeItem = {
  id: string;
  studentName: string;
  subjectName: string;
  gradingPeriod: string;
  score: number;
  remarks: string;
};

export default function Grades() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { role } = useUserStore();
  useSyncSettings();
  const { allowGrades, setAllowGrades } = useSettingStore();
  const toggleSettings = useToggleSettings();

  // --- Fetch grades ---
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

  // --- Search filter ---
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

  // --- Table columns ---
  const columns: ColumnDef<GradeItem>[] = [
    { accessorKey: "studentName", header: "Student Name" },
    { accessorKey: "subjectName", header: "Subject" },
    { accessorKey: "gradingPeriod", header: "Grading Period" },
    {
      accessorKey: "score",
      header: "Grades",
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

      {/* Filters + Actions */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search by student, subject, or grading period..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const csv = convertToCSV(grades ?? [], columns);
              if (!csv) return toast.error("No data to export");
              downloadCSV(csv, "grades.csv");
            }}
          >
            Export to CSV
          </Button>

          {role === "admin" && (
            <Toggle
              pressed={allowGrades}
              onPressedChange={(newValue) => {
                setAllowGrades(newValue); // update local store immediately (optimistic)

                toggleSettings.mutate(newValue, {
                  onError: () => {
                    // rollback if failed
                    setAllowGrades(!newValue);
                  },
                });
              }}
              aria-label="Toggle Allow Grades"
              variant="outline"
            >
              {allowGrades ? (
                <LockIcon size={18} />
              ) : (
                <LockOpenIcon size={18} />
              )}
              {allowGrades ? "Disable Grades" : "Allow Grades"}
            </Toggle>
          )}

          {allowGrades && (
            <Button onClick={() => navigate(`/${role}/grades/new`)}>
              <FaCirclePlus className="mr-2" />
              Add Grade
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} isLoading={isLoading} />
    </div>
  );
}
