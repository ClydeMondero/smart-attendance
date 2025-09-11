import { DataTable } from "@/components/DataTable";
import ScanAttendance from "@/components/ScanAttendance";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

type ClassAttendanceLogItem = {
  id: string;
  studentName: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  timeIn: string;
  timeOut: string;
  date: string;
};

type SchoolClassShow = {
  id: number;
  grade_level: string;
  section: string;
  teacher?: string | null;
  school_year?: string | null;
  status: "active" | "inactive";
  students_count?: number;
};

function parseTimeCell(v: string | null | undefined, selectedDate: string) {
  if (!v || v === "-") return null;
  const s = String(v).trim();

  if (
    /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?(Z|[+-]\d{2}:\d{2})?$/.test(
      s
    )
  ) {
    const isoish = s.replace(" ", "T");
    const dt = parseISO(isoish);
    return isNaN(dt.getTime()) ? null : dt;
  }

  const t = /^\d{2}:\d{2}$/.test(s) ? `${s}:00` : s;
  const dt = new Date(`${selectedDate}T${t}`);
  return isNaN(dt.getTime()) ? null : dt;
}

export default function ClassAttendanceLog() {
  const { id } = useParams<{ id: string }>();
  const classId = id!;
  const [q, setQ] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [scanOpen, setScanOpen] = useState(false);
  const qc = useQueryClient();

  // 🔹 Fetch class details for breadcrumb (+ pass to scanner)
  const { data: cls } = useQuery({
    queryKey: ["class", classId],
    enabled: !!classId,
    queryFn: async (): Promise<SchoolClassShow> => {
      const res = await api.get(`/classes/${classId}`);
      return res.data as SchoolClassShow;
    },
  });

  const { data } = useQuery({
    queryKey: ["attendance", classId, selectedDate, q],
    enabled: !!classId,
    queryFn: async (): Promise<ClassAttendanceLogItem[]> => {
      const res = await api.get("/attendances", {
        params: { type: "class", class_id: classId, date: selectedDate, q },
      });
      return res.data.data as ClassAttendanceLogItem[];
    },
  });

  const startMutation = useMutation({
    mutationFn: async () =>
      api.post("/attendances", {
        action: "start",
        class_id: Number(classId),
        date: selectedDate,
      }),
    onSuccess: () => {
      toast.success("Attendance started for selected date.");
      qc.invalidateQueries({ queryKey: ["attendance", classId, selectedDate] });
    },
    onError: () => toast.error("Failed to start attendance"),
  });

  const columns: ColumnDef<ClassAttendanceLogItem>[] = useMemo(
    () => [
      { accessorKey: "studentName", header: "Student Name" },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "timeIn",
        header: "Time In",
        cell: ({ row }) => {
          const v = row.getValue<string>("timeIn");
          const dt = parseTimeCell(v, selectedDate);
          return dt ? format(dt, "h:mm a") : v && v !== "-" ? v : "—";
        },
      },
      {
        accessorKey: "timeOut",
        header: "Time Out",
        cell: ({ row }) => {
          const v = row.getValue<string>("timeOut");
          const dt = parseTimeCell(v, selectedDate);
          return dt ? format(dt, "h:mm a") : v && v !== "-" ? v : "—";
        },
      },
    ],
    [selectedDate]
  );

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      {/* 🔹 Breadcrumb now shows Grade Level and Section */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/classes">Classes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Attendance Log</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Optional page heading */}
      <h2 className="text-xl font-semibold">
        {cls ? `${cls.grade_level} - ${cls.section}` : "Class Attendance Log"}
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search student..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setScanOpen(true);
              startMutation.mutate();
            }}
            disabled={!classId || startMutation.isPending}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Start Attendance
          </Button>
          <Button
            variant="outline"
            disabled={!classId}
            onClick={() => {
              if (!classId) return;
              window.location.href = `/attendances-export?class_id=${classId}&date=${selectedDate}`;
            }}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={data ?? []} />

      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Scan Attendance</DialogTitle>
          </DialogHeader>
          <ScanAttendance
            type="class"
            classId={Number(classId)}
            apiPath="/attendances"
            gradeLevel={cls?.grade_level ?? ""}
            section={cls?.section ?? ""}
            date={selectedDate}
            onSaved={() =>
              qc.invalidateQueries({
                queryKey: ["attendance", classId, selectedDate],
              })
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
