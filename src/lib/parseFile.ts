import { Trade } from "@/types/trade";

export type FileFormat = "csv" | "xlsx" | "xls" | "pdf";

export function detectFormat(fileName: string): FileFormat | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "csv") return "csv";
  if (ext === "xlsx") return "xlsx";
  if (ext === "xls") return "xls";
  if (ext === "pdf") return "pdf";
  return null;
}

export const ACCEPTED_TYPES =
  ".csv,.xlsx,.xls,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";

export async function parseTradeFile(file: File): Promise<Trade[]> {
  const format = detectFormat(file.name);

  if (!format) {
    throw new Error(
      `Unsupported file type "${file.name.split(".").pop()?.toUpperCase()}". ` +
        `Please upload a CSV, XLSX, XLS, or PDF file.`
    );
  }

  switch (format) {
    case "csv": {
      const { parseTradeCSV } = await import("./parseCSV");
      return parseTradeCSV(file);
    }
    case "xlsx":
    case "xls": {
      const { parseXLSXFile } = await import("./parseXLSX");
      return parseXLSXFile(file);
    }
    case "pdf": {
      const { parsePDFFile } = await import("./parsePDF");
      return parsePDFFile(file);
    }
  }
}
