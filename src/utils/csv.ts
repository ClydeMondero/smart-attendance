export function convertToCSV(data: any[], columns: any[]) {
  if (!data || !data.length) return "";

  const headers = columns
    .filter((col: any) => col.accessorKey)
    .map((col: any) => col.header);

  const rows = data.map((row) =>
    columns
      .filter((col: any) => col.accessorKey)
      .map((col: any) => {
        const val = row[col.accessorKey];
        // escape quotes and commas
        return `"${String(val ?? "").replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadCSV(csvString: string, filename = "export.csv") {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
