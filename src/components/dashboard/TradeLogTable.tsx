"use client";

import { useState, useMemo } from "react";
import { useTrades } from "@/contexts/TradeContext";
import { formatINR, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  TableIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Trade } from "@/types/trade";

type SortKey = keyof Trade;
type SortDir = "asc" | "desc";

const PAGE_SIZE = 15;

export function TradeLogTable() {
  const { trades } = useTrades();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"ALL" | "WIN" | "LOSS">("ALL");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const filtered = useMemo(
    () =>
      filter === "ALL" ? trades : trades.filter((t) => t.status === filter),
    [trades, filter]
  );

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col ? (
      <ChevronsUpDown className="w-3 h-3 text-slate-600" />
    ) : sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-emerald-400" />
    ) : (
      <ChevronDown className="w-3 h-3 text-emerald-400" />
    );

  const headers: { label: string; key: SortKey; align?: string }[] = [
    { label: "Symbol", key: "symbol" },
    { label: "Date", key: "date" },
    { label: "Qty", key: "quantity", align: "right" },
    { label: "Buy ₹", key: "buyPrice", align: "right" },
    { label: "Sell ₹", key: "sellPrice", align: "right" },
    { label: "P&L", key: "pnl", align: "right" },
    { label: "%", key: "pnlPercentage", align: "right" },
    { label: "Exch", key: "exchange" },
    { label: "Status", key: "status" },
  ];

  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Trade Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-slate-600 gap-2">
            <TableIcon className="w-10 h-10 opacity-30" />
            <p className="text-sm">No trades loaded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Trade Log
            </CardTitle>
            <p className="text-xs text-slate-600 mt-0.5">
              {filtered.length} of {trades.length} trades
            </p>
          </div>
          <div className="flex gap-1.5">
            {(["ALL", "WIN", "LOSS"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150
                  ${filter === f
                    ? f === "WIN"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : f === "LOSS"
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      : "bg-slate-700 text-slate-200 border border-slate-600"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-y border-[#1e2d4a] bg-slate-900/50">
                {headers.map(({ label, key, align }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`px-4 py-2.5 font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none whitespace-nowrap
                      ${align === "right" ? "text-right" : "text-left"}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {align === "right" && <SortIcon col={key} />}
                      {label}
                      {align !== "right" && <SortIcon col={key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((trade, i) => {
                const isWin = trade.status === "WIN";
                return (
                  <tr
                    key={trade.id}
                    className={`border-b border-[#1e2d4a]/50 transition-colors hover:bg-slate-800/30
                      ${i % 2 === 0 ? "bg-transparent" : "bg-slate-900/20"}`}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-200 whitespace-nowrap">
                      {trade.symbol}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {formatDate(trade.date)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">
                      {trade.quantity.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">
                      {formatINR(trade.buyPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">
                      {formatINR(trade.sellPrice)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono font-semibold whitespace-nowrap ${
                        isWin ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isWin ? "+" : ""}
                      {formatINR(trade.pnl)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono text-xs ${
                        isWin ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {isWin ? "+" : ""}
                      {trade.pnlPercentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          trade.exchange.toUpperCase() === "BSE" ? "bse" : "nse"
                        }
                      >
                        {trade.exchange.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={isWin ? "win" : "loss"}>
                        <span
                          className={`w-1 h-1 rounded-full ${
                            isWin ? "bg-emerald-400" : "bg-rose-400"
                          }`}
                        />
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e2d4a]">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {sorted.length} rows
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
