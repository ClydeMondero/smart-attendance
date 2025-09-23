import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import * as htmlToImage from "html-to-image";
import { Award, BookOpen, CalendarDays, Info } from "lucide-react";
import React, { forwardRef, useMemo, useRef } from "react";
import Barcode from "react-barcode";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserStore from "@/store/userStore";

type Student = {
  id: number;
  barcode: string;
  full_name: string;
  parent_contact?: string | null;
  created_at?: string;
  updated_at?: string;
  class_id: number;
  school_class?: {
    grade_level: string;
    section: string;
  };
};

const PX_W = 324; // 3.375in * 96
const PX_H = 204; // 2.125in * 96

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const { role } = useUserStore();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const {
    data: student,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const { data } = await api.get(`/students/${id}`, {
        withCredentials: true,
      });
      return data as Student;
    },
    enabled: !!id,
  });

  const { data: attendances } = useQuery({
    queryKey: ["attendances", id],
    queryFn: async () => {
      const { data } = await api.get(`/attendances?student_id=${id}`, {
        withCredentials: true,
      });

      return data;
    },
    enabled: !!id,
  });

  const { data: grades } = useQuery({
    queryKey: ["grades", id],
    queryFn: async () => {
      const { data } = await api.get(`/grades?student_id=${id}`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!id,
  });

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await api.get(`/subjects`, { withCredentials: true });
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 p-4">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Skeleton className="h-7 w-56 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !student) {
    return <div className="p-4 text-red-600">Student not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              {role === "admin" ? (
                <Link to="/admin/students">Students</Link>
              ) : (
                <Link to="/teacher/students">Students</Link>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{student.full_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{student.full_name}</h1>
          <p className="text-muted-foreground">
            {student.school_class?.grade_level}
            {student.school_class?.section
              ? ` • ${student.school_class.section}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrintButton student={student} />
          <DownloadPngButton student={student} target={() => cardRef.current} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">
            <Info className="w-4 h-4 mr-1" /> Details
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <CalendarDays className="w-4 h-4 mr-1" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="grades">
            <Award className="w-4 h-4 mr-1" /> Grades
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="w-4 h-4 mr-1" /> Subjects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StudentInfo student={student} />
            <IdCardPreview ref={cardRef} student={student} />
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="grid gap-3">
            {attendances?.data.map((a: any) => (
              <Card key={a.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {a.log_date}
                    <Badge
                      variant={a.status === "Present" ? "default" : "secondary"}
                    >
                      {a.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div>In: {a.time_in ?? "-"}</div>
                  <div>Out: {a.time_out ?? "-"}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grades">
          <div className="grid gap-3">
            {grades?.map((g: any) => (
              <Card key={g.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {g.subject?.name}
                    <Badge variant="outline">{g.grading_period}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div>Score: {g.score}</div>
                  <div>Remarks: {g.remarks ?? "-"}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="grid gap-3">
            {subjects
              ?.filter((s: any) => s.class_id === student.class_id)
              .map((s: any) => (
                <Card key={s.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      {s.name}
                      <Badge
                        variant={
                          s.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {s.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Student Info ---------- */
function StudentInfo({ student }: { student: Student }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Student Information</h2>
      <div className="space-y-1 text-sm">
        <div>
          <span className="font-medium">Barcode:</span> {student.barcode}
        </div>
        <div>
          <span className="font-medium">Name:</span> {student.full_name}
        </div>
        <div>
          <span className="font-medium">Grade Level:</span>{" "}
          {student.school_class?.grade_level}
        </div>
        <div>
          <span className="font-medium">Section:</span>{" "}
          {student.school_class?.section || "—"}
        </div>
        <div>
          <span className="font-medium">Parent Contact:</span>{" "}
          {student.parent_contact || "—"}
        </div>
      </div>
    </div>
  );
}

/* ---------- ID Card Preview (inches for on-screen/print) ---------- */
const IdCardPreview = forwardRef<HTMLDivElement, { student: Student }>(
  ({ student }, ref) => {
    const cardStyle = useMemo<React.CSSProperties>(
      () => ({ width: "3.375in", height: "2.125in" }),
      []
    );

    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow p-4">
        <h2 className="text-lg font-semibold mb-3">ID Card Preview</h2>

        <div
          ref={ref}
          className="relative overflow-hidden rounded-lg bg-white text-black mx-auto"
          style={cardStyle}
        >
          <div className="h-8 w-full bg-blue-600 text-white flex items-center px-3 text-sm font-medium">
            Smart Attendance
          </div>
          <div className="p-3 flex h-[calc(100%-2rem)]">
            <div className="w-1/3 pr-2 flex items-center justify-center">
              <div className="w-20 h-24 rounded bg-gray-200 flex items-center justify-center text-[10px] text-gray-600">
                PHOTO
              </div>
            </div>
            <div className="w-2/3 flex flex-col">
              <div className="text-xs">
                <div className="font-semibold leading-tight">
                  {student.full_name}
                </div>
                <div className="text-gray-600 leading-tight">
                  {student.school_class?.grade_level}
                  {student.school_class?.section
                    ? ` • ${student.school_class.section}`
                    : ""}
                </div>
              </div>
              <div className="mt-auto pt-1">
                <Barcode
                  value={student.barcode}
                  format="CODE128"
                  height={42}
                  width={1.6}
                  displayValue
                  margin={6}
                  fontSize={12}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Tip: print on <strong>A4</strong> or <strong>Letter</strong>, scale
          100%, margins “none”.
        </p>
      </div>
    );
  }
);
IdCardPreview.displayName = "IdCardPreview";

/* ---------- Actions ---------- */
function PrintButton({ student }: { student: Student }) {
  const handlePrint = async () => {
    const el = document.querySelector(
      "[data-id-card-root]"
    ) as HTMLElement | null;
    if (!el) return toast.error("ID card not found.");

    const win = window.open("", "printWindow", "width=480,height=320");
    if (!win) return toast.error("Popup blocked.");

    const styles = `
      <style>
      @page { size: auto; margin: 0; }
      html, body { padding: 0; margin: 0; background: #fff; }
      .sheet { display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; }
      </style>
    `;

    win.document.write(
      `<!doctype html><html><head><meta charset="utf-8">${styles}</head><body>
        <div class="sheet">${el.outerHTML}</div>
      </body></html>`
    );
    win.document.close();

    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  };

  return (
    <>
      {/* Hidden copy for printing */}
      <div className="hidden" data-id-card-root>
        <div
          style={{ width: "3.375in", height: "2.125in" }}
          className="relative overflow-hidden rounded-lg bg-white text-black"
        >
          <div className="h-8 w-full bg-blue-600 text-white flex items-center px-3 text-sm font-medium">
            Smart Attendance
          </div>
          <div className="p-3 flex h-[calc(100%-2rem)]">
            <div className="w-1/3 pr-2 flex items-center justify-center">
              <div className="w-20 h-24 rounded bg-gray-200 flex items-center justify-center text-[10px] text-gray-600">
                PHOTO
              </div>
            </div>
            <div className="w-2/3 flex flex-col">
              <div className="text-xs">
                <div className="font-semibold leading-tight">
                  {student.full_name}
                </div>
                <div className="text-gray-600 leading-tight">
                  {student.school_class?.grade_level}
                  {student.school_class?.section
                    ? ` • ${student.school_class.section}`
                    : ""}
                </div>
                <div className="text-gray-600 leading-tight">
                  ID: {student.id}
                </div>
              </div>
              <div className="mt-auto pt-1">
                <Barcode
                  value={student.barcode}
                  format="CODE128"
                  height={42}
                  width={1.6}
                  displayValue
                  margin={6}
                  fontSize={12}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handlePrint}>Print ID</Button>
    </>
  );
}

function DownloadPngButton({
  student,
  target,
}: {
  student: Student;
  target: () => HTMLElement | null;
}) {
  const handleDownload = async () => {
    const el = target();
    if (!el) return toast.error("ID card not found.");

    try {
      // Force exact px dimensions during capture to avoid fractional rounding
      const dataUrl = await htmlToImage.toPng(el, {
        cacheBust: true,
        pixelRatio: 3, // sharper output
        backgroundColor: "#ffffff",
        width: PX_W,
        height: PX_H,
        style: {
          width: `${PX_W}px`,
          height: `${PX_H}px`,
          transform: "none",
          margin: "0",
          padding: "0",
        },
      });

      const link = document.createElement("a");
      link.download = `student-${student.id}-id.png`;
      link.href = dataUrl;
      link.click();
    } catch (e: any) {
      toast.error(`Failed to export PNG: ${e.message}`);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      Download PNG
    </Button>
  );
}
