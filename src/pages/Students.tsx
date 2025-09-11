import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { scrollToTop } from "@/utils/scroll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type StudentApi = {
  id: number;
  barcode: string;
  full_name: string;
  grade_level: string;
  section?: string | null;
  parent_contact?: string | null;
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

  // server-side search + pagination
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25); // server page size

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
    // Optional nicety to prevent blanking while paging/searching:
    // placeholderData: (prev) => prev,
    // staleTime: 5_000,
  });

  const rows: StudentItem[] = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((s) => ({
      id: String(s.id),
      fullName: s.full_name,
      barcode: s.barcode,
      className: s.grade_level + (s.section ? ` - ${s.section}` : ""),
      parentContact: s.parent_contact ?? "—",
    }));
  }, [data]);

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
              navigate(`/admin/students/${row.original.id}`);
              scrollToTop();
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => navigate(`/admin/students/${row.original.id}/edit`)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            disabled={del.isPending}
            onClick={async () => {
              if (!confirm("Delete this student?")) return;
              await del.mutateAsync(row.original.id);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
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
          <Button onClick={() => navigate("/admin/students/new")}>
            <FaCirclePlus className="mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Table (uses DataTable's server footer) */}
      <DataTable
        columns={columns}
        data={rows}
        isLoading={isLoading && !data} // skeleton on initial load only
        isError={isError}
        skeletonRows={8}
        externalPagination={{
          page: data?.current_page ?? page,
          lastPage: data?.last_page ?? 1,
          total: data?.total,
          onPrev: () => setPage((p) => Math.max(1, p - 1)),
          onNext: () => setPage((p) => p + 1),
          disabled: isFetching, // disables buttons during background refetch
        }}
      />
    </div>
  );
}
