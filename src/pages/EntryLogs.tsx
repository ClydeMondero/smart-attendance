import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Pencil,
  Trash,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function EntryLogs() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    classId: "",
  });

  // Fetch classes and sections
  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/classes?status=active");
      return res.data.data;
    },
  });

  // Fetch entry logs
  const { data, isLoading } = useQuery({
    queryKey: ["attendance", "entry", filters, q],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.classId) params.append("class_id", filters.classId);

      const res = await api.get(`/attendances?${params.toString()}`);

      return res.data.data.map((a: any) => ({
        id: String(a.id),
        date: a.log_date ? format(parseISO(a.log_date), "MM/dd/yyyy") : "—",
        name: a.student?.full_name ?? "—",
        studentId: a.student?.barcode ?? "—",
        gradeLevel: a.student?.school_class?.grade_level ?? "—",
        section: a.student?.school_class?.section ?? "—",
        timeIn: a.time_in
          ? format(parseISO(`1970-01-01T${a.time_in}`), "h:mm a")
          : "-",
        timeOut: a.time_out
          ? format(parseISO(`1970-01-01T${a.time_out}`), "h:mm a")
          : "-",
      }));
    },
  });

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "date", header: "Date" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "studentId", header: "Student ID" },
      { accessorKey: "gradeLevel", header: "Grade Level" },
      { accessorKey: "section", header: "Section" },
      { accessorKey: "timeIn", header: "Time In" },
      { accessorKey: "timeOut", header: "Time Out" },
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
    ],
    []
  );

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

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date
                  ? format(parseISO(filters.date), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date ? parseISO(filters.date) : undefined}
                onSelect={(date) =>
                  setFilters((prev) => ({
                    ...prev,
                    date: date ? format(date, "yyyy-MM-dd") : "",
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Class Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filters.classId ? `Class ${filters.classId}` : "Select Class"}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {classes?.map((cls: any) => (
                <DropdownMenuItem
                  key={cls.id}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      classId: cls.id,
                    }))
                  }
                >
                  {cls.grade_level} - {cls.section}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline">Export to CSV</Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
    </div>
  );
}
