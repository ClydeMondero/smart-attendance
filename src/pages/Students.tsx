import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import useUserStore from "@/store/userStore";
import { convertToCSV, downloadCSV } from "@/utils/csv";
import { scrollToTop } from "@/utils/scroll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Eye, Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type StudentApi = {
  id: number;
  barcode: string;
  full_name: string;
  parent_contact?: string | null;
  school_class?: {
    id: number;
    grade_level: string;
    section?: string | null;
  } | null;
  is_active: number;
};

type Paginator<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};

type StudentItem = {
  id: string;
  fullName: string;
  barcode: string;
  className: string;
  parentContact: string;
};

export default function Students() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { role } = useUserStore();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedQ(q.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["students", { page, perPage, q: debouncedQ }],
    queryFn: async () => {
      const res = await api.get<Paginator<StudentApi>>("/students", {
        withCredentials: true,
        params: { page, per_page: perPage, q: debouncedQ || undefined },
      });
      return res.data;
    },
  });

  const rows: StudentItem[] = useMemo(() => {
    let list = data?.data ?? [];

    if (!showInactive) {
      list = list.filter((s) => s.is_active === 1);
    }

    return list.map((s) => ({
      id: String(s.id),
      fullName: s.full_name,
      barcode: s.barcode,
      className: s.school_class
        ? `${s.school_class.grade_level}${
            s.school_class.section ? ` - ${s.school_class.section}` : ""
          }`
        : "—",
      parentContact: s.parent_contact ?? "—",
    }));
  }, [data, showInactive]);

  const del = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/students/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success("Student deleted");
      qc.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ??
        (typeof e?.response?.data === "string" ? e.response.data : "") ??
        e.message;
      toast.error(msg);
    },
  });

  const columns: ColumnDef<StudentItem>[] = [
    {
      id: "barcodePlaceholder",
      header: "Barcode",
      cell: ({ row }) => (
        <div className="w-24 h-8 bg-muted flex items-center justify-center text-xs text-muted-foreground rounded">
          {row.original.barcode || "N/A"}
        </div>
      ),
      meta: { csvHeader: "Barcode" },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <span className="text-xs">
            {column.getIsSorted() === "asc"
              ? "▲"
              : column.getIsSorted() === "desc"
              ? "▼"
              : ""}
          </span>
        </button>
      ),
      meta: { csvHeader: "Full Name" },
    },
    {
      accessorKey: "className",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Class
          <span className="text-xs">
            {column.getIsSorted() === "asc"
              ? "▲"
              : column.getIsSorted() === "desc"
              ? "▼"
              : ""}
          </span>
        </button>
      ),
      meta: { csvHeader: "Class" },
    },
    {
      accessorKey: "parentContact",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parent Contact
          <span className="text-xs">
            {column.getIsSorted() === "asc"
              ? "▲"
              : column.getIsSorted() === "desc"
              ? "▼"
              : ""}
          </span>
        </button>
      ),
      meta: { csvHeader: "Parent Contact" },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="default"
            onClick={() => {
              navigate(`/${role}/students/${row.original.id}`);
              scrollToTop();
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {role === "admin" && (
            <>
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  navigate(`/admin/students/${row.original.id}/edit`)
                }
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                disabled={del.isPending}
                onClick={async () => {
                  await del.mutateAsync(row.original.id);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
      meta: { csvHeader: "" }, // Actions column excluded from CSV
    },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Students</h2>

      {/* Filters */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search by name, barcode, or class..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={(checked) => setShowInactive(!!checked)}
            />
            <Label htmlFor="show-inactive" className="text-sm">
              Show inactive students
            </Label>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              const exportColumns = columns.map((col: any) => ({
                ...col,
                header:
                  typeof col.header === "function"
                    ? col.meta?.csvHeader || ""
                    : col.header,
              }));

              const csv = convertToCSV(rows, exportColumns);
              if (!csv) return toast.error("No data to export");
              downloadCSV(csv, "students.csv");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>

          {role === "admin" && (
            <Button onClick={() => navigate("/admin/students/new")}>
              <FaCirclePlus className="mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading && !data}
        isError={isError}
        skeletonRows={8}
        externalPagination={{
          page: data?.current_page ?? page,
          lastPage: data?.last_page ?? 1,
          total: data?.total,
          onPrev: () => setPage((p) => Math.max(1, p - 1)),
          onNext: () => setPage((p) => p + 1),
          disabled: isFetching,
        }}
      />
    </div>
  );
}
