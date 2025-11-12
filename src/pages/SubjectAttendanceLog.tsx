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
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TimePicker from "@/components/ui/timepicker";

import api from "@/lib/api";
import { cn } from "@/lib/utils";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parse, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserStore from "@/store/userStore";

type SubjectAttendanceLogItem = {
  id: string;
  studentName: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  timeIn: string;
  timeOut: string;
  date: string;
};

type SubjectShow = {
  id: number;
  name: string;
  class_id: number;
  school_class?: {
    id: number;
    grade_level: string;
    section: string;
  };
  status: "active" | "inactive";
  expected_time_in?: string | null;
  expected_time_out?: string | null; // ✅ added
};

function ymd(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

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

export default function SubjectAttendanceLog() {
  const { id } = useParams<{ id: string }>();
  const subjectId = id!;
  const [q, setQ] = useState("");
  const [scanOpen, setScanOpen] = useState(false);

  const { role } = useUserStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDateStr = ymd(selectedDate);

  const [expectedTime, setExpectedTime] = useState<string | null>(null);
  const [expectedTimeOut, setExpectedTimeOut] = useState<string | null>(null); // ✅ added

  const qc = useQueryClient();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // fetch subject
  const { data: subject, isLoading: subjectLoading } = useQuery({
    queryKey: ["subject", subjectId],
    enabled: !!subjectId,
    queryFn: async (): Promise<SubjectShow> => {
      const res = await api.get(`/subjects/${subjectId}`);
      return res.data as SubjectShow;
    },
  });

  // initialize expected time from subject when loaded
  useEffect(() => {
    if (subject?.expected_time_in) setExpectedTime(subject.expected_time_in);
    if (subject?.expected_time_out)
      setExpectedTimeOut(subject.expected_time_out); // ✅ added
  }, [subject]);

  // fetch attendance rows
  const { data, isLoading: rowsLoading } = useQuery({
    queryKey: ["attendance", "subject", subjectId, selectedDateStr, q],
    enabled: !!subjectId,
    queryFn: async (): Promise<SubjectAttendanceLogItem[]> => {
      const res = await api.get("/attendances", {
        params: {
          type: "subject",
          subject_id: subjectId,
          date: selectedDateStr,
          q,
        },
      });
      return res.data.data as SubjectAttendanceLogItem[];
    },
  });

  // mutations
  const startMutation = useMutation({
    mutationFn: async () =>
      api.post("/attendances", {
        action: "start",
        class_id: subject?.class_id,
        subject_id: Number(subjectId),
        date: selectedDateStr,
      }),
    onSuccess: () => {
      toast.success("Attendance started for selected date.");
      qc.invalidateQueries({
        queryKey: ["attendance", "subject", subjectId, selectedDateStr],
      });
    },
    onError: () => toast.error("Failed to start attendance"),
  });

  const stopMutation = useMutation({
    mutationFn: async () =>
      api.post("/attendances", {
        action: "stop",
        class_id: subject?.class_id,
        subject_id: Number(subjectId),
        date: selectedDateStr,
      }),
    onSuccess: (res) => {
      toast.success(
        `Stopped. SMS sent to ${res.data.sent_count} absent parents.`
      );
      qc.invalidateQueries({
        queryKey: ["attendance", "subject", subjectId, selectedDateStr],
      });
    },
    onError: () => toast.error("Failed to stop attendance"),
  });

  const updateTimeInMutation = useMutation({
    mutationFn: async (payload: { id: string; time_in: string }) => {
      return api.patch(`/attendances/${payload.id}`, {
        time_in: payload.time_in,
        expected_time_in: expectedTime,
      });
    },
    onSuccess: (_data, variables) => {
      toast.success(`Time In updated to "${variables.time_in}"`);
      qc.invalidateQueries({
        queryKey: ["attendance", "subject", subjectId, selectedDateStr, q],
      });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to update time in");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      return api.patch(`/attendances/${payload.id}`, {
        status: payload.status.toLowerCase(),
      });
    },
    onSuccess: (_data, variables) => {
      toast.success(`Status updated to "${variables.status}"`);
      qc.invalidateQueries({
        queryKey: ["attendance", "subject", subjectId, selectedDateStr],
      });
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to update status");
    },
  });

  const updateExpectedTimeMutation = useMutation({
    mutationFn: async (time: string) =>
      api.patch(`/subjects/${subjectId}`, { expected_time_in: time }),
    onSuccess: () => {
      toast.success("Expected Time updated");
      qc.invalidateQueries({ queryKey: ["subject", subjectId] });
    },
    onError: () => toast.error("Failed to update expected time"),
  });

  // ✅ New mutation for expected time out
  const updateExpectedTimeOutMutation = useMutation({
    mutationFn: async (time: string) =>
      api.patch(`/subjects/${subjectId}`, { expected_time_out: time }),
    onSuccess: () => {
      toast.success("Expected Time Out updated");
      qc.invalidateQueries({ queryKey: ["subject", subjectId] });
    },
    onError: () => toast.error("Failed to update expected time out"),
  });

  // ✅ Automatically stop attendance when time reaches expected time out
  useEffect(() => {
    if (!expectedTimeOut || isFinished) return;

    const checkTime = () => {
      const now = new Date();
      const [hour, minute] = expectedTimeOut.split(":").map(Number);
      const target = new Date();
      target.setHours(hour, minute, 0, 0);

      if (now >= target) {
        if (!stopMutation.isPending) {
          stopMutation.mutate();
          setIsFinished(true);
          toast.info(
            "Attendance automatically stopped based on expected time out."
          );
        }
      }
    };

    const interval = setInterval(checkTime, 30 * 1000);
    return () => clearInterval(interval);
  }, [expectedTimeOut, isFinished]);

  const columns: ColumnDef<SubjectAttendanceLogItem>[] = useMemo(
    () => [
      { accessorKey: "studentName", header: "Student Name" },
      {
        accessorKey: "timeIn",
        header: "Time In",
        cell: ({ row }) => {
          const original = row.original as SubjectAttendanceLogItem;
          const rowId = original.id;
          const v = row.getValue<string>("timeIn");
          const dt = parseTimeCell(v, selectedDateStr);
          const currentTimeIn = dt ? format(dt, "HH:mm") : "—";

          const [draft, setDraft] = useState(currentTimeIn);

          useEffect(() => {
            setDraft(currentTimeIn);
          }, [currentTimeIn]);

          const commitUpdate = async (val: string) => {
            if (!val || val === currentTimeIn) return;

            const parsed = parse(val, "HH:mm", new Date());
            const formatted = format(parsed, "HH:mm:ss");

            try {
              setUpdatingId(rowId);
              await updateTimeInMutation.mutateAsync({
                id: rowId,
                time_in: formatted,
              });
            } finally {
              setUpdatingId(null);
            }
          };

          const handleChange = (val: string) => setDraft(val);

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter") commitUpdate(draft);
          };

          return (
            <div onKeyDown={handleKeyDown}>
              <TimePicker
                value={draft}
                onChange={handleChange}
                disabled={updatingId === rowId}
              />
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const original = row.original as SubjectAttendanceLogItem;
          const rowId = original.id;
          const currentStatus = original.status ?? "Absent";

          const onChange = async (val: string) => {
            if (!val || val === currentStatus) return;
            try {
              setUpdatingId(rowId);
              await updateStatusMutation.mutateAsync({
                id: rowId,
                status: val,
              });
            } finally {
              setUpdatingId(null);
            }
          };

          return (
            <div className="w-full">
              <Select
                defaultValue={currentStatus}
                value={currentStatus}
                onValueChange={onChange}
                disabled={updatingId === rowId}
              >
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Update..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Excused">Excused</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        },
      },
    ],
    [selectedDateStr, subject?.expected_time_in, updatingId]
  );

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/${role}/subjects`}>Subjects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Attendance Log</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h2 className="text-xl font-semibold">
        {subject
          ? `${subject?.name} (${subject?.school_class?.grade_level} - ${subject?.school_class?.section})`
          : subjectLoading
          ? "Loading subject..."
          : "Subject Attendance Log"}
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search student..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "MMMM d, yyyy")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {selectedDate?.toDateString() === new Date().toDateString() &&
          !isFinished && (
            <div className="flex items-center gap-3">
              {/* Expected Time In */}
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">
                  Expected Time In
                </span>
                <TimePicker
                  value={expectedTime ?? "07:00"}
                  onChange={(val) => {
                    setExpectedTime(val);
                    if (val) updateExpectedTimeMutation.mutate(val);
                  }}
                />
              </div>

              {/*  Expected Time Out */}
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">
                  Expected Time Out
                </span>
                <TimePicker
                  value={expectedTimeOut ?? "17:00"}
                  onChange={(val) => {
                    setExpectedTimeOut(val);
                    if (val) updateExpectedTimeOutMutation.mutate(val);
                  }}
                />
              </div>

              <Button
                onClick={() => {
                  setScanOpen(true);
                  startMutation.mutate();
                }}
                disabled={!subjectId || startMutation.isPending}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Record Attendance
              </Button>

              <Button
                onClick={() => {
                  stopMutation.mutate();
                  setIsFinished(true);
                }}
                disabled={!subjectId || stopMutation.isPending}
                variant="outline"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finish Attendance
              </Button>
            </div>
          )}
      </div>

      <DataTable columns={columns} data={data ?? []} isLoading={rowsLoading} />

      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Scan Attendance</DialogTitle>
          </DialogHeader>
          <ScanAttendance
            type="subject"
            subjectId={Number(subjectId)}
            apiPath="/attendances"
            date={selectedDateStr}
            expectedTime={expectedTime ?? "07:00"}
            onSaved={() =>
              qc.invalidateQueries({
                queryKey: ["attendance", "subject", subjectId, selectedDateStr],
              })
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
