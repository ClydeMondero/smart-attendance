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
import { scrollToTop } from "@/utils/scroll";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Eye, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type ClassItem = {
  id: string;
  gradeLevel: string;
  section: string;
  teacher: string;
  schoolYear: string;
  status: "Active" | "Inactive";
};

export default function Classes() {
  const [q, setQ] = useState("");
  const [gradeLevel, setGradeLevel] = useState<string | undefined>();
  const [status, setStatus] = useState<"Active" | "Inactive" | undefined>();
  const navigate = useNavigate();
  const { role, user } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: ["classes", q, gradeLevel, status, role, user?.name],
    queryFn: async (): Promise<ClassItem[]> => {
      const res = await api.get("/classes", {
        params: {
          q,
          grade_level: gradeLevel,
          status,
          ...(role === "teacher" ? { teacher: user?.name } : {}),
        },
      });
      return res.data.data as ClassItem[];
    },
  });

  const columns: ColumnDef<ClassItem>[] = useMemo(
    () => [
      { accessorKey: "grade_level", header: "Grade Level" },
      { accessorKey: "section", header: "Section" },
      { accessorKey: "teacher", header: "Teacher" },
      { accessorKey: "school_year", header: "School Year" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as ClassItem["status"];
          const color =
            status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-700";
          return <Badge className={color}>{status}</Badge>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={() => {
                navigate(`/${role}/classes/${row.original.id}`);
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
                    navigate(`/admin/classes/${row.original.id}/edit`)
                  }
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Classes</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search by section or teacher..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />

          {/* Grade level */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {gradeLevel ?? "Select Grade Level"}{" "}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[
                "Grade 1",
                "Grade 2",
                "Grade 3",
                "Grade 4",
                "Grade 5",
                "Grade 6",
                "Grade 7",
                "Grade 8",
                "Grade 9",
                "Grade 10",
                "Grade 11",
                "Grade 12",
              ].map((gl) => (
                <DropdownMenuItem key={gl} onClick={() => setGradeLevel(gl)}>
                  {gl}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setGradeLevel(undefined)}>
                All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {status ?? "Select Status"}{" "}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatus("Active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatus("Inactive")}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatus(undefined)}>
                All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const csv = convertToCSV(data ?? [], columns);
              if (!csv) return toast.error("No data to export");
              downloadCSV(csv, "classes.csv");
            }}
          >
            Export to CSV
          </Button>

          {role === "admin" && (
            <Button onClick={() => navigate("/admin/classes/new")}>
              <FaCirclePlus className="mr-2" />
              Add Class
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
    </div>
  );
}
