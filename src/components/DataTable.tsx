import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { scrollToTop } from "@/utils/scroll";

// === External (server-side) pagination API ===
type ExternalPagination = {
  page: number; // 1-based
  lastPage: number; // from server
  total?: number; // optional display
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isError = false,
  skeletonRows = 8,
  externalPagination, // <- if provided, footer uses server-driven Prev/Next
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  skeletonRows?: number;
  externalPagination?: ExternalPagination;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    initialState: {
      pagination: {
        pageSize: 100, // purely client-side page size in the table viewport
      },
    },
  });

  const totalColumns = columns.length;

  React.useEffect(() => {
    if (externalPagination === undefined) return;
  }, [externalPagination]);

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rIdx) => (
                <TableRow key={`skeleton-${rIdx}`}>
                  {Array.from({ length: totalColumns }).map((__, cIdx) => (
                    <TableCell key={`skeleton-cell-${rIdx}-${cIdx}`}>
                      <Skeleton className="h-5 w-full max-w-[220px] rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns}
                  className="h-24 text-center text-red-600"
                >
                  Failed to load data.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={totalColumns} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between py-4">
        {/* Left side: selection + page size selector (client-only UI) */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getRowModel().rows.length} row(s) selected.
          </span>

          {/* You may keep or remove this; it doesn't affect server page size */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Show {table.getState().pagination.pageSize}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {[50, 100, 150, 200].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => table.setPageSize(size)}
                >
                  Show {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        {/* Right side: Pagination */}
        {externalPagination ? (
          // Server-side footer
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page{" "}
              <span className="font-medium">{externalPagination.page}</span> of{" "}
              <span className="font-medium">{externalPagination.lastPage}</span>
              {typeof externalPagination.total === "number" && (
                <>
                  {" "}
                  •{" "}
                  <span className="font-medium">
                    {externalPagination.total}
                  </span>{" "}
                  total
                </>
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                externalPagination.onPrev();
                scrollToTop();
              }}
              disabled={
                isLoading ||
                externalPagination.disabled ||
                externalPagination.page <= 1
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                externalPagination.onNext();
                scrollToTop();
              }}
              disabled={
                isLoading ||
                externalPagination.disabled ||
                externalPagination.page >= externalPagination.lastPage
              }
            >
              Next
            </Button>
          </div>
        ) : (
          // Client-side footer (fallback)
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.previousPage();
                scrollToTop();
              }}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.nextPage();
                scrollToTop();
              }}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
