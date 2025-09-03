import KpiCard from "@/components/KpiCard";
import SectionTitle from "@/components/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  CalendarDays,
  Clock,
  Eye,
  FileText,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ---------------------------------------------
// Demo data
// ---------------------------------------------
const days = [
  { d: "Aug 26", present: 320, absent: 45, late: 12 },
  { d: "Aug 27", present: 330, absent: 40, late: 15 },
  { d: "Aug 28", present: 310, absent: 55, late: 10 },
  { d: "Aug 29", present: 350, absent: 25, late: 8 },
  { d: "Aug 30", present: 340, absent: 30, late: 11 },
  { d: "Aug 31", present: 355, absent: 20, late: 6 },
  { d: "Sep 01", present: 360, absent: 22, late: 7 },
  { d: "Sep 02", present: 370, absent: 18, late: 9 },
];

const entryLogs = [
  {
    id: "LOG-2025-001",
    date: "2025-09-02",
    student: "Alice Johnson",
    class: "Math 10A",
    timeIn: "07:58",
    status: "Present",
  },
  {
    id: "LOG-2025-002",
    date: "2025-09-02",
    student: "Ben Carter",
    class: "Math 10A",
    timeIn: "08:12",
    status: "Late",
  },
  {
    id: "LOG-2025-003",
    date: "2025-09-02",
    student: "Clara Lee",
    class: "Science 9B",
    timeIn: null,
    status: "Absent",
  },
  {
    id: "LOG-2025-004",
    date: "2025-09-02",
    student: "David Kim",
    class: "Science 9B",
    timeIn: "07:55",
    status: "Present",
  },
];

const excuseRequests = [
  {
    id: "EX-1001",
    student: "Clara Lee",
    reason: "Medical Appointment",
    submittedAt: "2025-09-01 21:15",
    status: "Pending",
  },
  {
    id: "EX-1000",
    student: "Ethan Smith",
    reason: "Family Emergency",
    submittedAt: "2025-08-31 18:22",
    status: "Pending",
  },
];

const classes = [
  {
    key: "math10a",
    title: "Math 10A",
    kpis: [
      { key: "present", label: "Present", value: 32 },
      { key: "absent", label: "Absent", value: 3 },
      { key: "late", label: "Late", value: 2 },
    ],
    icon: BookOpen,
  },
  {
    key: "science9b",
    title: "Science 9B",
    kpis: [
      { key: "present", label: "Present", value: 28 },
      { key: "absent", label: "Absent", value: 1 },
      { key: "late", label: "Late", value: 4 },
    ],
    icon: FileText,
  },
];

// ---------------------------------------------
// Helper
// ---------------------------------------------
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

// ---------------------------------------------
// Main Component
// ---------------------------------------------
export default function Dashboard() {
  const [range, setRange] = useState<"7d" | "30d" | "12m">("7d");
  const [excuses, setExcuses] = useState(excuseRequests);

  // KPIs
  const kpis = useMemo(() => {
    const totalStudents = 400; // mock
    const presentToday = 370;
    const absentToday = 18;
    const lateToday = 9;
    const classesToday = classes.length;
    return {
      totalStudents,
      presentToday,
      absentToday,
      lateToday,
      classesToday,
    };
  }, []);

  const approveExcuse = (id: string) =>
    setExcuses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Approved" } : e))
    );
  const rejectExcuse = (id: string) =>
    setExcuses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Rejected" } : e))
    );

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <KpiCard
          title="Total Students"
          value={kpis.totalStudents.toString()}
          icon={Users}
        />
        <KpiCard
          title="Present Today"
          value={kpis.presentToday.toString()}
          icon={Activity}
          note="Checked in"
        />
        <KpiCard
          title="Absent Today"
          value={kpis.absentToday.toString()}
          icon={X}
          note="No entry log"
        />
        <KpiCard
          title="Late Today"
          value={kpis.lateToday.toString()}
          icon={Clock}
          note="After 8:00"
        />
        <KpiCard
          title="Classes Today"
          value={kpis.classesToday.toString()}
          icon={CalendarDays}
        />
      </div>

      {/* Attendance Trend */}
      <Card>
        <CardHeader className="pb-2">
          <SectionTitle
            icon={Activity}
            title="Attendance Trend"
            desc="Daily attendance summary"
          />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Tabs
              value={range}
              onValueChange={(v: any) => setRange(v as any)}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="12m">12m</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Present Avg:{" "}
                <span className="font-medium text-foreground">342</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4" /> Absent Avg:{" "}
                <span className="font-medium text-foreground">28</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={days}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="d" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="present"
                  strokeWidth={2}
                  stroke="green"
                  fill="green"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  strokeWidth={2}
                  stroke="red"
                  fill="red"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="late"
                  strokeWidth={2}
                  stroke="orange"
                  fill="orange"
                  fillOpacity={0.1}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Classes Snapshot */}
      <Card>
        <CardHeader className="pb-2">
          <SectionTitle
            icon={BookOpen}
            title="Classes Snapshot"
            desc="Attendance by class"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {classes.map((c) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-sm transition cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <c.icon className="h-5 w-5" />
                      <CardTitle className="text-base">{c.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-3">
                    {c.kpis.map((k) => (
                      <div key={k.key} className="rounded-lg border p-2">
                        <div className="text-xs text-muted-foreground">
                          {k.label}
                        </div>
                        <div className="text-sm font-medium">{k.value}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two-Panel: Logs + Excuses */}
      <div className="col-span-1 xl:col-span-2">
        {/* Logs */}
        <Card>
          <CardHeader className="pb-2">
            <SectionTitle
              icon={Activity}
              title="Recent Entry Logs"
              desc="Today’s attendance records"
            />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entryLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.student}</TableCell>
                      <TableCell>{log.class}</TableCell>
                      <TableCell>{log.timeIn ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === "Present"
                              ? "default"
                              : log.status === "Late"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Log {log.id}</DialogTitle>
                              <DialogDescription>
                                Student attendance details
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <Info label="Date" value={log.date} />
                              <Info label="Class" value={log.class} />
                              <Info label="Student" value={log.student} />
                              <Info label="Status" value={log.status} />
                              <Info label="Time In" value={log.timeIn ?? "—"} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Excuses */}
        {/* <Card>
          <CardHeader className="pb-2">
            <SectionTitle
              icon={ShieldCheck}
              title="Pending Excuse Requests"
              desc="Approve or reject"
            />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {excuses.map((e) => (
                    <TableRow key={e.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{e.id}</TableCell>
                      <TableCell>{e.student}</TableCell>
                      <TableCell>{e.reason}</TableCell>
                      <TableCell>{e.submittedAt}</TableCell>
                      <TableCell className="text-right">
                        {e.status === "Pending" ? (
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => approveExcuse(e.id)}
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1"
                              onClick={() => rejectExcuse(e.id)}
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant={
                              e.status === "Approved" ? "default" : "secondary"
                            }
                          >
                            {e.status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
