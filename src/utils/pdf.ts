import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Column = {
  header: string;
  accessorKey?: string;
  id?: string;
};

interface ExportPDFOptions<T> {
  rows: T[];
  columns: Column[];
  filename?: string;
  title?: string;
  websiteName?: string;
  logoUrl?: string; // e.g. "/logo.png" if in public folder
  excludeFields?: string[]; // e.g. ["barcode"]
}

export async function exportToPDF<T>({
  rows,
  columns,
  filename = "report.pdf",
  title = "Report",
  websiteName = "Smart Attendance",
  logoUrl,
  excludeFields = [],
}: ExportPDFOptions<T>) {
  if (!rows || rows.length === 0) return;

  const doc = new jsPDF();
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- HEADER ---
  let currentY = 10; // track vertical position

  if (logoUrl) {
    try {
      // fetch and convert image to base64
      const imgData = await fetch(logoUrl)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            })
        );

      const imgWidth = 25;
      const imgHeight = 20;
      const imgX = (pageWidth - imgWidth) / 2; // center horizontally
      doc.addImage(imgData, "PNG", imgX, currentY, imgWidth, imgHeight);

      currentY += imgHeight + 6; // move cursor below image
    } catch (e) {
      console.warn("Could not load logo", e);
    }
  }

  // Website name centered
  doc.setFontSize(14);
  doc.text(websiteName, pageWidth / 2, currentY, { align: "center" });
  currentY += 8;

  // Report title
  doc.setFontSize(12);
  doc.text(title, pageWidth / 2, currentY, { align: "center" });
  currentY += 10;

  // --- TABLE DATA ---
  const exportColumns = columns.filter(
    (col) =>
      col.header &&
      col.id !== "actions" &&
      !excludeFields.includes(col.accessorKey ?? col.id ?? "")
  );

  const headers = exportColumns.map((col) => col.header);

  const body = rows.map((row: any) =>
    exportColumns.map((col) => {
      if (col.accessorKey) return row[col.accessorKey] ?? "—";
      if (col.id) return row[col.id] ?? "—";
      return "";
    })
  );

  autoTable(doc, {
    startY: currentY,
    head: [headers],
    body,
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      const totalPages = (doc as any).getNumberOfPages();

      doc.setFontSize(8);

      doc.text(
        `Page ${data.pageNumber} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );

      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        margin,
        pageHeight - 10
      );
    },
  });

  // Save file
  doc.save(filename);
}
