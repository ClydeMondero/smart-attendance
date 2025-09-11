// ClassAttendanceLog.tsx
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

export default function ClassAttendanceLog() {
  const { id } = useParams<{ id: string }>();
  const classId = id; // keep a friendly alias
  const [q, setQ] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [scanOpen, setScanOpen] = useState(false);
  const qc = useQueryClient();

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
      { accessorKey: "timeIn", header: "Time In" },
      { accessorKey: "timeOut", header: "Time Out" },
    ],
    []
  );

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/classes">Classes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h2 className="text-xl font-semibold">Class Attendance Log</h2>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
              setScanOpen(true); // open now
              startMutation.mutate(); // pre-seed in background
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
            gradeLevel=""
            section=""
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
