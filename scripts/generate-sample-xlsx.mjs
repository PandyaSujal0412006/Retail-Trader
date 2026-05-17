// Run with: node scripts/generate-sample-xlsx.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
const path = require("path");

const trades = [
  ["Symbol","Trade Date","Exchange","Segment","Quantity","Buy Price","Sell Price"],
  ["RELIANCE","2024-01-02","NSE","EQ",10,2500.50,2580.25],
  ["INFY","2024-01-03","NSE","EQ",25,1420.00,1395.50],
  ["HDFCBANK","2024-01-04","NSE","EQ",15,1640.00,1698.75],
  ["TCS","2024-01-05","NSE","EQ",5,3850.00,3920.00],
  ["WIPRO","2024-01-08","NSE","EQ",50,480.25,465.00],
  ["ICICIBANK","2024-01-09","NSE","EQ",20,950.00,988.50],
  ["BAJFINANCE","2024-01-10","BSE","EQ",3,6800.00,7050.00],
  ["MARUTI","2024-01-11","NSE","EQ",2,9500.00,9320.00],
  ["SUNPHARMA","2024-01-12","NSE","EQ",30,1150.00,1198.00],
  ["TATAMOTORS","2024-01-15","NSE","EQ",40,620.00,610.50],
  ["ADANIPORTS","2024-01-16","NSE","EQ",25,780.00,825.00],
  ["ASIANPAINT","2024-01-17","NSE","EQ",8,3200.00,3285.00],
  ["SBIN","2024-01-19","NSE","EQ",100,580.00,605.00],
  ["NTPC","2024-01-24","NSE","EQ",200,245.00,252.50],
  ["ONGC","2024-01-29","NSE","EQ",100,168.00,174.50],
  ["ITC","2024-02-19","NSE","EQ",200,415.00,425.00],
  ["COALINDIA","2024-02-16","NSE","EQ",150,385.00,402.00],
  ["DIVISLAB","2024-02-06","NSE","EQ",6,3600.00,3780.00],
  ["DRREDDY","2024-02-08","NSE","EQ",5,5800.00,6050.00],
  ["APOLLOHOSP","2024-02-26","NSE","EQ",4,6200.00,6450.00],
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(trades);

// Style column widths
ws["!cols"] = [
  { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 10 },
  { wch: 10 }, { wch: 12 }, { wch: 12 },
];

XLSX.utils.book_append_sheet(wb, ws, "Trades");
const outPath = path.join(process.cwd(), "public", "Zerodha_Sample_Data.xlsx");
XLSX.writeFile(wb, outPath);
console.log("✅ Generated:", outPath);
