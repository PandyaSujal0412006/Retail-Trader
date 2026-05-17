import Papa from "papaparse";
import { Trade } from "@/types/trade";
import { mapObjectsToTrades } from "./columnMapper";

export function parseTradeCSV(file: File): Promise<Trade[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, string>[];
          if (data.length === 0) {
            reject(new Error("CSV file is empty or has no data rows."));
            return;
          }
          resolve(mapObjectsToTrades(data));
        } catch (err) {
          reject(err);
        }
      },
      error: (err: Error) => reject(err),
    });
  });
}
