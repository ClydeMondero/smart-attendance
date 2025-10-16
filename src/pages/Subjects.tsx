import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { convertToCSV, downloadCSV } from "@/utils/csv";
import { exportToPDF } from "@/utils/pdf";
import { scrollToTop } from "@/utils/scroll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Pencil,
  Trash,
} from "lucide-react";
import { useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// --- Types ---
type SubjectItem = {
  id: string;
  subjectName: string;
  className: string;
  status: "Active" | "Inactive";
};

export default function Subjects() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, user } = useUserStore();

  // Fetch subjects
  const { data, isLoading } = useQuery({
    queryKey: ["subjects", user?.id, role],
    queryFn: async () => {
      const res = await api.get("/subjects");
      return res.data;
    },
  });

  // Delete mutation with Sonner toast
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/subjects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject deleted successfully!");
    },
    onError: () => {
      toast.error("Delete failed", {
        description: "Something went wrong while deleting the subject.",
      });
    },
  });

  // Transform API data into table-friendly shape
  const subjects: SubjectItem[] = useMemo(() => {
    if (!data) return [];
    return data.map((s: any) => ({
      id: s.id,
      subjectName: s.name,
      className: s.school_class
        ? `${s.school_class.grade_level} - ${s.school_class.section}`
        : "N/A",
      status: s.status,
    }));
  }, [data]);

  // Search filter
  const filtered = subjects.filter(
    (r) =>
      q === "" ||
      r.subjectName.toLowerCase().includes(q.toLowerCase()) ||
      r.className.toLowerCase().includes(q.toLowerCase())
  );

  // Table columns
  const baseColumns: ColumnDef<SubjectItem>[] = [
    { accessorKey: "subjectName", header: "Subject Name" },
    { accessorKey: "className", header: "Class" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as SubjectItem["status"];
        const color =
          status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-200 text-gray-700";
        return <Badge className={color}>{status}</Badge>;
      },
    },
  ];

  const columns: ColumnDef<SubjectItem>[] = [
    ...baseColumns,
    ...(role !== "teacher"
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Button
                  size="icon"
                  onClick={() => {
                    navigate(`/${role}/subjects/${row.original.id}`);
                    scrollToTop();
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    navigate(`/admin/subjects/${row.original.id}/edit`)
                  }
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => deleteMutation.mutate(row.original.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ),
          } as ColumnDef<SubjectItem>,
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Subjects</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search by subject or class..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Select Status <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex item-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const csv = convertToCSV(subjects ?? [], columns);
              if (!csv) return toast.error("No data to export");
              downloadCSV(csv, "subjects.csv");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const exportColumns = columns.map((col: any) => ({
                header:
                  typeof col.header === "string"
                    ? col.header
                    : col.meta?.csvHeader || "",
                accessorKey: col.accessorKey,
                id: col.id,
              }));

              exportToPDF({
                rows: subjects ?? [],
                columns: exportColumns,
                filename: "subjects.pdf",
                title: "Subjects Report",
                websiteName: "Smart Attendance",
                logoUrl: "/logo.png",
              });
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>

          {role === "admin" && (
            <Button onClick={() => navigate("/admin/subjects/new")}>
              <FaCirclePlus className="mr-2" />
              Add Subject
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        skeletonRows={4}
      />
    </div>
  );
}
