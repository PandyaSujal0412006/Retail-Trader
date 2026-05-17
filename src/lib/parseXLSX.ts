import * as XLSX from "xlsx";
import { Trade } from "@/types/trade";
import { mapObjectsToTrades } from "./columnMapper";

export function parseXLSXFile(file: File): Promise<Trade[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });

        // Use the first sheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject(new Error("XLSX file contains no sheets."));
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { raw: false, defval: "" }
        );

        if (jsonData.length === 0) {
          reject(new Error("XLSX sheet is empty or has no data rows."));
          return;
        }

        // Stringify all values so mapObjectsToTrades can handle them
        const stringData = jsonData.map((row) =>
          Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k, String(v ?? "")])
          )
        ) as Record<string, string>[];

        resolve(mapObjectsToTrades(stringData));
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Failed to parse XLSX file."));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read XLSX file."));
    reader.readAsArrayBuffer(file);
  });
}
