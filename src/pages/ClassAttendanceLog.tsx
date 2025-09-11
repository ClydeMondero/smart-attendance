// ClassAttendanceLog.tsx
import { DataTable } from "@/components/DataTable";
import ScanAttendance from "@/components/ScanAttendance"; // <— the scanner above
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
} from "@/components/ui/dialog"; // shadcn dialog
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type ClassAttendanceLogItem = {
  id: string;
  studentName: string;
  status: "Present" | "Absent" | "Late";
  timeIn: string;
  timeOut: string;
  date: string;
};

export default function ClassAttendanceLog() {
  const [q, setQ] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [scanOpen, setScanOpen] = useState(false);

  // Mock data
  const data = useMemo<ClassAttendanceLogItem[]>(
    () => [
      {
        id: "1",
        studentName: "Juan Dela Cruz",
        status: "Present",
        timeIn: "08:02",
        timeOut: "16:59",
        date: "2025-09-03",
      },
      {
        id: "2",
        studentName: "Maria Santos",
        status: "Late",
        timeIn: "08:25",
        timeOut: "17:05",
        date: "2025-09-03",
      },
      {
        id: "3",
        studentName: "Pedro Reyes",
        status: "Absent",
        timeIn: "-",
        timeOut: "-",
        date: "2025-09-02",
      },
    ],
    []
  );

  const filtered = data.filter(
    (r) =>
      r.date === selectedDate &&
      (q === "" ||
        r.studentName.toLowerCase().includes(q.toLowerCase()) ||
        r.status.toLowerCase().includes(q.toLowerCase()))
  );

  const columns: ColumnDef<ClassAttendanceLogItem>[] = [
    { accessorKey: "studentName", header: "Student Name" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "timeIn", header: "Time In" },
    { accessorKey: "timeOut", header: "Time Out" },
  ];

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
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => setScanOpen(true)}>
            <ClipboardList className="w-4 h-4 mr-2" />
            Start Attendance
          </Button>
          <Button variant="outline">Export to CSV</Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Scanner Dialog */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Scan Attendance</DialogTitle>
          </DialogHeader>

          <ScanAttendance
            type="class"
            classId={123} // pass the current class id if you have it
            gradeLevel="Grade 1" // optional defaults
            section="Class A"
            apiPath="/api/attendances"
            onSaved={() => {
              // Optionally: refetch a table query or update local state
              // queryClient.invalidateQueries({ queryKey: ['attendances', selectedDate, 123] })
              // or keep dialog open for continuous scans:
              // setScanOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
