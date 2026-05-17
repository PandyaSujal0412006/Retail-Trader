"use client";

import dynamic from "next/dynamic";
import { useTrades } from "@/contexts/TradeContext";
import { formatINR } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INITIAL_CAPITAL } from "@/lib/calculations";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { pnl: number } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const balance = payload[0].value;
  const pnl = balance - INITIAL_CAPITAL;
  const pnlColor = pnl >= 0 ? "#10b981" : "#f43f5e";

  return (
    <div className="bg-[#0F1729] border border-[#1e2d4a] rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-1.5 font-medium">
        {label === "Start" ? "Starting Capital" : label}
      </p>
      <p className="font-mono font-bold text-slate-100 text-sm">
        {formatINR(balance)}
      </p>
      <p className="font-mono mt-0.5" style={{ color: pnlColor }}>
        {pnl >= 0 ? "+" : ""}
        {formatINR(pnl)} ({pnl >= 0 ? "+" : ""}
        {((pnl / INITIAL_CAPITAL) * 100).toFixed(2)}%)
      </p>
      {payload[0].payload.pnl !== 0 && (
        <p className="text-slate-500 mt-1">
          Trade P&L: {formatINR(payload[0].payload.pnl)}
        </p>
      )}
    </div>
  );
}

function EquityCurveInner() {
  const { equityCurve, stats, trades } = useTrades();

  const isProfit = stats.totalNetPnL >= 0;
  const lineColor = isProfit ? "#10b981" : "#f43f5e";
  const gradientId = isProfit ? "equityGradientGreen" : "equityGradientRed";
  const pnlPct =
    trades.length > 0
      ? ((stats.totalNetPnL / INITIAL_CAPITAL) * 100).toFixed(2)
      : null;

  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Equity Curve
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col items-center justify-center text-slate-600 gap-2">
            <TrendingUp className="w-10 h-10 opacity-30" />
            <p className="text-sm">Upload a CSV to plot your equity curve</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Equity Curve
            </CardTitle>
            <p className="text-xs text-slate-600 mt-1">
              Starting capital: {formatINR(INITIAL_CAPITAL)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isProfit ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
            <span
              className="text-lg font-bold font-mono"
              style={{ color: lineColor }}
            >
              {pnlPct && `${Number(pnlPct) >= 0 ? "+" : ""}${pnlPct}%`}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pr-2">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={equityCurve}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2d4a"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#1e2d4a" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
                return `₹${(v / 1000).toFixed(0)}K`;
              }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={INITIAL_CAPITAL}
              stroke="#334155"
              strokeDasharray="4 4"
              label={{
                value: "Capital",
                fill: "#475569",
                fontSize: 10,
                position: "insideTopLeft",
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: lineColor, stroke: "#0B1120", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Must render client-side only (recharts uses browser APIs)
export const EquityCurve = dynamic(() => Promise.resolve(EquityCurveInner), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="h-72 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </CardContent>
    </Card>
  ),
});
