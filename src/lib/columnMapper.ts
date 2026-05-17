import { Trade } from "@/types/trade";

export const COLUMN_MAPPINGS = {
  symbol: [
    "symbol", "scrip", "stock", "instrument", "security",
    "tradingsymbol", "trading symbol", "instrument name", "stock name",
  ],
  date: [
    "trade date", "date", "tradedate", "order date", "orderdate",
    "trade_date", "execution time", "order time", "date of trade",
  ],
  quantity: [
    "quantity", "qty", "shares", "units", "trade quantity",
    "trade qty", "no. of shares",
  ],
  buyPrice: [
    "buy price", "buy avg price", "buy rate", "purchase price",
    "avg buy price", "buy_price", "entry price", "avg. buy price", "buy avg",
  ],
  sellPrice: [
    "sell price", "sell avg price", "sell rate", "exit price",
    "avg sell price", "sell_price", "exit_price", "avg. sell price", "sell avg",
  ],
  exchange: ["exchange", "exch", "market", "exchseg"],
  segment: ["segment", "series", "type", "product"],
};

function cleanNumber(val: string): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[,₹\s]/g, "")) || 0;
}

/** Works on Record<string, string>[] — used by CSV and XLSX parsers */
export function mapObjectsToTrades(data: Record<string, string>[]): Trade[] {
  if (data.length === 0) throw new Error("File has no data rows.");

  const headers = Object.keys(data[0]);
  const norm = headers.map((h) => h.toLowerCase().trim());

  function findKey(names: string[]): string | undefined {
    for (const name of names) {
      const idx = norm.findIndex(
        (h) => h === name.toLowerCase() || h.includes(name.toLowerCase())
      );
      if (idx !== -1) return headers[idx];
    }
    return undefined;
  }

  const cols = {
    symbol: findKey(COLUMN_MAPPINGS.symbol),
    date: findKey(COLUMN_MAPPINGS.date),
    quantity: findKey(COLUMN_MAPPINGS.quantity),
    buyPrice: findKey(COLUMN_MAPPINGS.buyPrice),
    sellPrice: findKey(COLUMN_MAPPINGS.sellPrice),
    exchange: findKey(COLUMN_MAPPINGS.exchange),
    segment: findKey(COLUMN_MAPPINGS.segment),
  };

  if (!cols.symbol || !cols.date || !cols.quantity || !cols.buyPrice || !cols.sellPrice) {
    throw new Error(
      `Could not map required columns. Found: [${headers.join(", ")}]. ` +
        `Need: Symbol, Date, Quantity, Buy Price, Sell Price.`
    );
  }

  return data
    .map((row, idx) => {
      const qty = cleanNumber(row[cols.quantity!]);
      const buyPrice = cleanNumber(row[cols.buyPrice!]);
      const sellPrice = cleanNumber(row[cols.sellPrice!]);
      const pnl = Math.round((sellPrice - buyPrice) * qty * 100) / 100;
      return {
        id: `trade-${idx}-${Date.now()}`,
        symbol: (row[cols.symbol!] || "UNKNOWN").trim().toUpperCase(),
        date: (row[cols.date!] || new Date().toISOString()).trim(),
        quantity: qty,
        buyPrice,
        sellPrice,
        pnl,
        pnlPercentage:
          buyPrice > 0
            ? Math.round(((sellPrice - buyPrice) / buyPrice) * 100 * 100) / 100
            : 0,
        status: pnl >= 0 ? ("WIN" as const) : ("LOSS" as const),
        exchange: cols.exchange ? (row[cols.exchange] || "NSE").trim() : "NSE",
        segment: cols.segment ? (row[cols.segment] || "EQ").trim() : "EQ",
      };
    })
    .filter((t) => t.quantity > 0 && t.buyPrice > 0);
}

/** Works on string[][] (rows of cells) — used by PDF parser */
export function mapRowsToTrades(rows: string[][]): Trade[] {
  if (rows.length < 2) throw new Error("Not enough rows in file.");

  // Find the header row among the first 15 rows
  const allNames = Object.values(COLUMN_MAPPINGS).flat();
  let headerIdx = 0;
  let maxMatches = 0;
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const matches = rows[i].filter((cell) =>
      allNames.some((n) => cell.toLowerCase().includes(n.toLowerCase()))
    ).length;
    if (matches > maxMatches) { maxMatches = matches; headerIdx = i; }
  }

  if (maxMatches < 2) {
    throw new Error(
      `Could not find a header row. First row: [${rows[0].join(", ")}]. ` +
        `Ensure the PDF contains: Symbol, Date, Quantity, Buy Price, Sell Price columns.`
    );
  }

  const headers = rows[headerIdx];

  function findColIdx(names: string[]): number {
    const norm = headers.map((h) => h.toLowerCase().trim());
    for (const name of names) {
      const idx = norm.findIndex(
        (h) => h === name.toLowerCase() || h.includes(name.toLowerCase())
      );
      if (idx !== -1) return idx;
    }
    return -1;
  }

  const colIdx = {
    symbol: findColIdx(COLUMN_MAPPINGS.symbol),
    date: findColIdx(COLUMN_MAPPINGS.date),
    quantity: findColIdx(COLUMN_MAPPINGS.quantity),
    buyPrice: findColIdx(COLUMN_MAPPINGS.buyPrice),
    sellPrice: findColIdx(COLUMN_MAPPINGS.sellPrice),
    exchange: findColIdx(COLUMN_MAPPINGS.exchange),
    segment: findColIdx(COLUMN_MAPPINGS.segment),
  };

  if ([colIdx.symbol, colIdx.date, colIdx.quantity, colIdx.buyPrice, colIdx.sellPrice].some((i) => i === -1)) {
    throw new Error(
      `Could not map required columns. Found: [${headers.join(", ")}]. ` +
        `Need: Symbol, Date, Quantity, Buy Price, Sell Price.`
    );
  }

  return rows
    .slice(headerIdx + 1)
    .filter((row) => row.length > Math.max(colIdx.symbol, colIdx.buyPrice, colIdx.sellPrice))
    .map((row, idx) => {
      const qty = cleanNumber(row[colIdx.quantity] ?? "");
      const buyPrice = cleanNumber(row[colIdx.buyPrice] ?? "");
      const sellPrice = cleanNumber(row[colIdx.sellPrice] ?? "");
      const pnl = Math.round((sellPrice - buyPrice) * qty * 100) / 100;
      return {
        id: `trade-${idx}-${Date.now()}`,
        symbol: (row[colIdx.symbol] || "UNKNOWN").trim().toUpperCase(),
        date: (row[colIdx.date] || new Date().toISOString()).trim(),
        quantity: qty,
        buyPrice,
        sellPrice,
        pnl,
        pnlPercentage:
          buyPrice > 0
            ? Math.round(((sellPrice - buyPrice) / buyPrice) * 100 * 100) / 100
            : 0,
        status: pnl >= 0 ? ("WIN" as const) : ("LOSS" as const),
        exchange: colIdx.exchange >= 0 ? (row[colIdx.exchange] || "NSE").trim() : "NSE",
        segment: colIdx.segment >= 0 ? (row[colIdx.segment] || "EQ").trim() : "EQ",
      };
    })
    .filter((t) => t.quantity > 0 && t.buyPrice > 0);
}
