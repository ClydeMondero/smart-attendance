import KpiCard from "@/components/KpiCard";
import SectionTitle from "@/components/SectionTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Clock,
  FileText,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
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
// Helper
// ---------------------------------------------
// function Info({ label, value }: { label: string; value: string }) {
//   return (
//     <div>
//       <div className="text-xs text-muted-foreground">{label}</div>
//       <div className="text-sm font-medium">{value}</div>
//     </div>
//   );
// }

// ---------------------------------------------
// Main Component
// ---------------------------------------------
export default function Dashboard() {
  const [range, setRange] = useState("7d");
  // const queryClient = useQueryClient();

  // Queries
  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => (await api.get("/dashboard/summary")).data,
  });

  const trendQuery = useQuery({
    queryKey: ["dashboard", "trend", range],
    queryFn: async () =>
      (await api.get(`/dashboard/trend?range=${range}`)).data,
  });

  const classesQuery = useQuery({
    queryKey: ["dashboard", "classes"],
    queryFn: async () => (await api.get("/dashboard/classes?date=today")).data,
  });

  const logsQuery = useQuery({
    queryKey: ["dashboard", "logs"],
    queryFn: async () => (await api.get("/dashboard/logs?date=today")).data,
  });

  // const excusesQuery = useQuery({
  //   queryKey: ["dashboard", "excuses"],
  //   queryFn: async () =>
  //     (await api.get("/dashboard/excuses?status=pending")).data,
  // });

  // Mutations for excuses
  // const approveExcuse = useMutation({
  //   mutationFn: (id: string) => api.post(`/dashboard/excuses/${id}/approve`),
  //   onSuccess: () => queryClient.invalidateQueries(["dashboard", "excuses"]),
  // });

  // const rejectExcuse = useMutation({
  //   mutationFn: (id: string) => api.post(`/dashboard/excuses/${id}/reject`),
  //   onSuccess: () => queryClient.invalidateQueries(["dashboard", "excuses"]),
  // });

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total Students"
          value={
            summaryQuery.isLoading
              ? "…"
              : summaryQuery.data?.students?.toString() ?? "0"
          }
          icon={Users}
        />
        <KpiCard
          title="Present Today"
          value={
            summaryQuery.isLoading
              ? "…"
              : summaryQuery.data?.present?.toString() ?? "0"
          }
          icon={Activity}
          note="Checked in"
        />
        <KpiCard
          title="Absent Today"
          value={
            summaryQuery.isLoading
              ? "…"
              : summaryQuery.data?.absent?.toString() ?? "0"
          }
          icon={X}
          note="No entry log"
        />
        <KpiCard
          title="Late Today"
          value={
            summaryQuery.isLoading
              ? "…"
              : summaryQuery.data?.late?.toString() ?? "0"
          }
          icon={Clock}
          note="After 8:00"
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
            <Tabs value={range} onValueChange={(v) => setRange(v)}>
              <TabsList>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="12m">12m</TabsTrigger>
              </TabsList>
            </Tabs>
            {!trendQuery.isLoading && trendQuery.data && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> Present Avg:{" "}
                  <span className="font-medium text-foreground">
                    {trendQuery.data.avgPresent}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" /> Absent Avg:{" "}
                  <span className="font-medium text-foreground">
                    {trendQuery.data.avgAbsent}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="h-64">
            {trendQuery.isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendQuery.data?.days ?? []}>
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
            )}
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
          {classesQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {classesQuery.data?.map((c: any) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-sm transition cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <CardTitle className="text-base">
                          {c.grade_level} - {c.section}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg border p-2">
                        <div className="text-xs text-muted-foreground">
                          Present
                        </div>
                        <div className="text-sm font-medium">{c.present}</div>
                      </div>
                      <div className="rounded-lg border p-2">
                        <div className="text-xs text-muted-foreground">
                          Absent
                        </div>
                        <div className="text-sm font-medium">{c.absent}</div>
                      </div>
                      <div className="rounded-lg border p-2">
                        <div className="text-xs text-muted-foreground">
                          Late
                        </div>
                        <div className="text-sm font-medium">{c.late}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-Panel: Logs + Excuses */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
              {logsQuery.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Time Out</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {logsQuery.isLoading ? (
                      // Skeleton rows
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={7}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : logsQuery.data && logsQuery.data.length > 0 ? (
                      logsQuery.data.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.studentName}</TableCell>
                          <TableCell>{log.barcode}</TableCell>
                          <TableCell>{log.class}</TableCell>
                          <TableCell>{log.status}</TableCell>
                          <TableCell>{log.timeIn}</TableCell>
                          <TableCell>{log.timeOut}</TableCell>
                          <TableCell>{log.date}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // 👇 Empty state
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground py-6"
                        >
                          No entry logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Excuses */}
        {/* <Card>
          <CardHeader className="pb-2">
            <SectionTitle
              icon={Clock}
              title="Pending Excuse Requests"
              desc="Approve or reject"
            />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {excusesQuery.isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : (
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
                    {excusesQuery.data?.map((e: any) => (
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
                                onClick={() => approveExcuse.mutate(e.id)}
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1"
                                onClick={() => rejectExcuse.mutate(e.id)}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Badge
                              variant={
                                e.status === "Approved"
                                  ? "default"
                                  : "secondary"
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
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
