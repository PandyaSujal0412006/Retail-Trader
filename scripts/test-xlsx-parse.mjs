// Test the XLSX parser logic directly in Node.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// ──── replicate columnMapper.mapObjectsToTrades ────
const COLUMN_MAPPINGS = {
  symbol: ["symbol", "scrip", "stock", "instrument", "tradingsymbol", "trading symbol"],
  date: ["trade date", "date", "tradedate", "order date", "trade_date"],
  quantity: ["quantity", "qty", "shares", "units", "trade quantity"],
  buyPrice: ["buy price", "buy avg price", "buy rate", "purchase price", "entry price"],
  sellPrice: ["sell price", "sell avg price", "sell rate", "exit price", "avg sell price"],
  exchange: ["exchange", "exch"],
  segment: ["segment", "series"],
};

function findKey(headers, norm, names) {
  for (const name of names) {
    const idx = norm.findIndex(h => h === name || h.includes(name));
    if (idx !== -1) return headers[idx];
  }
  return undefined;
}

function cleanNumber(val) {
  return parseFloat(String(val).replace(/[,₹\s]/g, "")) || 0;
}

// ──── Parse the XLSX ────
const filePath = path.join(process.cwd(), "public", "Zerodha_Sample_Data.xlsx");
const fileBuffer = fs.readFileSync(filePath);
const workbook = XLSX.read(fileBuffer, { type: "buffer", cellDates: true });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });

console.log(`\n✅ Sheet: "${sheetName}", Rows: ${jsonData.length}`);
console.log("   Headers:", Object.keys(jsonData[0]).join(", "));

const headers = Object.keys(jsonData[0]);
const norm = headers.map(h => h.toLowerCase().trim());

const cols = {
  symbol: findKey(headers, norm, COLUMN_MAPPINGS.symbol),
  date: findKey(headers, norm, COLUMN_MAPPINGS.date),
  quantity: findKey(headers, norm, COLUMN_MAPPINGS.quantity),
  buyPrice: findKey(headers, norm, COLUMN_MAPPINGS.buyPrice),
  sellPrice: findKey(headers, norm, COLUMN_MAPPINGS.sellPrice),
};

console.log("\n   Mapped columns:", cols);

const trades = jsonData
  .map(row => {
    const qty = cleanNumber(row[cols.quantity]);
    const buy = cleanNumber(row[cols.buyPrice]);
    const sell = cleanNumber(row[cols.sellPrice]);
    const pnl = Math.round((sell - buy) * qty * 100) / 100;
    return { symbol: String(row[cols.symbol]).toUpperCase(), date: row[cols.date], qty, buy, sell, pnl, status: pnl >= 0 ? "WIN" : "LOSS" };
  })
  .filter(t => t.qty > 0 && t.buy > 0);

const wins = trades.filter(t => t.status === "WIN");
const losses = trades.filter(t => t.status === "LOSS");
const netPnL = trades.reduce((s, t) => s + t.pnl, 0);

console.log(`\n✅ Trades parsed:   ${trades.length}`);
console.log(`   Wins / Losses:   ${wins.length}W / ${losses.length}L`);
console.log(`   Net P&L:         ₹${netPnL.toFixed(2)}`);
console.log(`   Win Rate:        ${((wins.length / trades.length) * 100).toFixed(1)}%`);
console.log("\n   First 5 trades:");
trades.slice(0, 5).forEach(t =>
  console.log(`   ${t.symbol.padEnd(14)} ${t.date.padEnd(12)} Qty:${t.qty} Buy:${t.buy} Sell:${t.sell} P&L:${t.pnl >= 0 ? "+" : ""}${t.pnl} [${t.status}]`)
);
