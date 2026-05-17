import { Trade } from "@/types/trade";
import { mapRowsToTrades } from "./columnMapper";

// pdfjs-dist is loaded dynamically (client-only, heavy bundle)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PdfjsLib = any;

let pdfjsPromise: Promise<PdfjsLib> | null = null;

async function getPdfjs(): Promise<PdfjsLib> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      // Use CDN-hosted worker matching the installed version
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

interface RawTextItem {
  str: string;
  transform: number[]; // [scaleX, skewX, skewY, scaleY, x, y]
}

/**
 * Groups PDF text items into rows by Y-coordinate proximity,
 * then sorts each row left-to-right by X-coordinate.
 */
function reconstructRows(items: RawTextItem[], yTolerance = 4): string[][] {
  if (items.length === 0) return [];

  // Sort top-to-bottom (PDF Y=0 is at bottom, so descending)
  const sorted = [...items].sort((a, b) => b.transform[5] - a.transform[5]);

  const buckets: Array<{ y: number; items: RawTextItem[] }> = [];

  for (const item of sorted) {
    const y = item.transform[5];
    const bucket = buckets.find((b) => Math.abs(b.y - y) <= yTolerance);
    if (bucket) {
      bucket.items.push(item);
    } else {
      buckets.push({ y, items: [item] });
    }
  }

  return buckets
    .map(({ items: rowItems }) => {
      rowItems.sort((a, b) => a.transform[4] - b.transform[4]);
      return rowItems.map((i) => i.str.trim()).filter((s) => s.length > 0);
    })
    .filter((row) => row.length > 0);
}

export async function parsePDFFile(file: File): Promise<Trade[]> {
  const pdfjs = await getPdfjs();
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const allRows: string[][] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const rows = reconstructRows(textContent.items as RawTextItem[]);
    allRows.push(...rows);
  }

  if (allRows.length === 0) {
    throw new Error(
      "No text content found in this PDF. It may be a scanned/image-based PDF which cannot be parsed."
    );
  }

  return mapRowsToTrades(allRows);
}
