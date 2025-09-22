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
import { Calendar as CalendarIcon, ClipboardList } from "lucide-react";
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
    expected_time_in?: string | null;
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

    // Time-only (HH:mm or HH:mm:ss)
    const t = /^\d{2}:\d{2}$/.test(s) ? `${s}:00` : s;
    const dt = new Date(`${selectedDate}T${t}`);
    return isNaN(dt.getTime()) ? null : dt;
}

export default function ClassAttendanceLog() {
    const { id } = useParams<{ id: string }>();
    const classId = id!;
    const [q, setQ] = useState("");
    const [scanOpen, setScanOpen] = useState(false);

    const { role } = useUserStore()

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const selectedDateStr = ymd(selectedDate);

    const [expectedTime, setExpectedTime] = useState<string>("20:00");

    const qc = useQueryClient();

    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const { data: cls, isLoading: classLoading } = useQuery({
        queryKey: ["class", classId],
        enabled: !!classId,
        queryFn: async (): Promise<SchoolClassShow> => {
            const res = await api.get(`/classes/${classId}`);
            return res.data as SchoolClassShow;
        },
    });

    const { data, isLoading: rowsLoading } = useQuery({
        queryKey: ["attendance", classId, selectedDateStr, q],
        enabled: !!classId,
        queryFn: async (): Promise<ClassAttendanceLogItem[]> => {
            const res = await api.get("/attendances", {
                params: { type: "class", class_id: classId, date: selectedDateStr, q },
            });
            return res.data.data as ClassAttendanceLogItem[];
        },
    });

    const startMutation = useMutation({
        mutationFn: async () =>
            api.post("/attendances", {
                action: "start",
                class_id: Number(classId),
                date: selectedDateStr,
            }),
        onSuccess: () => {
            toast.success("Attendance started for selected date.");
            qc.invalidateQueries({
                queryKey: ["attendance", classId, selectedDateStr],
            });
        },
        onError: () => toast.error("Failed to start attendance"),
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
                queryKey: ["attendance", classId, selectedDateStr, q],
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
                queryKey: ["attendance", classId, selectedDateStr],
            });
        },
        onError: (err: any) => {
            console.error(err);
            toast.error("Failed to update status");
        },
    });

    const columns: ColumnDef<ClassAttendanceLogItem>[] = useMemo(
        () => [
            { accessorKey: "studentName", header: "Student Name" },
            {
                accessorKey: "timeIn",
                header: "Time In",
                cell: ({ row }) => {
                    const original = row.original as ClassAttendanceLogItem;
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

                    const handleChange = (val: string) => {
                        setDraft(val);
                    };

                    const handleKeyDown = (e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                            commitUpdate(draft);
                        }
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
                    const original = row.original as ClassAttendanceLogItem;
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
        [selectedDateStr, cls?.expected_time_in, updatingId]
    );

    return (
        <div className="min-h-screen flex flex-col gap-4 p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={`/${role}/classes`}>Classes</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Attendance Log</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h2 className="text-xl font-semibold">
                {cls
                    ? `${cls.grade_level} - ${cls.section}`
                    : classLoading
                        ? "Loading class..."
                        : "Class Attendance Log"}
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

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <TimePicker value={expectedTime} onChange={setExpectedTime} />
                    </div>

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
                </div>
            </div>

            <DataTable columns={columns} data={data ?? []} isLoading={rowsLoading} />

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
                        date={selectedDateStr}
                        onSaved={() =>
                            qc.invalidateQueries({
                                queryKey: ["attendance", classId, selectedDateStr],
                            })
                        }
                        expectedTime={expectedTime}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
