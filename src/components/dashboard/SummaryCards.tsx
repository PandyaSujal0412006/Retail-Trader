"use client";

import { useTrades } from "@/contexts/TradeContext";
import { formatINR, formatPercent } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart2,
  Activity,
  Award,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
  accentColor: string;
  glowColor: string;
  isLoading: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor,
  glowColor,
  isLoading,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Activity;
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-rose-400"
      : "text-slate-400";

  return (
    <Card className="relative overflow-hidden group">
      {/* Subtle glow effect */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${glowColor} 0%, transparent 70%)`,
        }}
      />
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              {title}
            </p>
            {isLoading ? (
              <div className="h-8 w-32 bg-slate-800 rounded animate-pulse" />
            ) : (
              <p
                className="text-2xl font-bold font-mono tracking-tight leading-none"
                style={{ color: accentColor }}
              >
                {value}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ml-3"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}
          >
            <Icon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
        </div>
        <div className={`flex items-center gap-1 mt-3 text-xs ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="font-mono">{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards() {
  const { stats, isLoading } = useTrades();

  const cards = [
    {
      title: "Total Net P&L",
      value: formatINR(stats.totalNetPnL),
      subtitle:
        stats.totalNetPnL >= 0
          ? `+${formatINR(stats.grossProfit)} gross profit`
          : `${formatINR(stats.grossLoss)} gross loss`,
      icon: stats.totalNetPnL >= 0 ? TrendingUp : TrendingDown,
      trend: (stats.totalNetPnL >= 0 ? "up" : "down") as "up" | "down",
      accentColor: stats.totalNetPnL >= 0 ? "#10b981" : "#f43f5e",
      glowColor:
        stats.totalNetPnL >= 0
          ? "rgba(16,185,129,0.08)"
          : "rgba(244,63,94,0.08)",
    },
    {
      title: "Win Rate",
      value:
        stats.totalTrades > 0
          ? formatPercent(stats.winRate, 1)
          : "—",
      subtitle: `${stats.wins}W / ${stats.losses}L of ${stats.totalTrades} trades`,
      icon: Target,
      trend: (stats.winRate >= 50 ? "up" : stats.winRate > 0 ? "down" : "neutral") as
        | "up"
        | "down"
        | "neutral",
      accentColor: stats.winRate >= 50 ? "#10b981" : stats.winRate > 0 ? "#f43f5e" : "#64748b",
      glowColor:
        stats.winRate >= 50
          ? "rgba(16,185,129,0.08)"
          : "rgba(244,63,94,0.08)",
    },
    {
      title: "Profit Factor",
      value:
        stats.totalTrades > 0 ? stats.profitFactor.toFixed(2) : "—",
      subtitle:
        stats.profitFactor >= 1
          ? "Profitable system"
          : stats.profitFactor > 0
          ? "Needs improvement"
          : "No trades yet",
      icon: BarChart2,
      trend: (stats.profitFactor >= 1.5 ? "up" : stats.profitFactor > 1 ? "neutral" : "down") as
        | "up"
        | "down"
        | "neutral",
      accentColor:
        stats.profitFactor >= 1.5
          ? "#10b981"
          : stats.profitFactor >= 1
          ? "#f59e0b"
          : "#f43f5e",
      glowColor:
        stats.profitFactor >= 1
          ? "rgba(16,185,129,0.08)"
          : "rgba(244,63,94,0.08)",
    },
    {
      title: "Total Trades",
      value: stats.totalTrades.toString(),
      subtitle:
        stats.totalTrades > 0
          ? `Avg P&L: ${formatINR(stats.totalNetPnL / stats.totalTrades)} per trade`
          : "Upload a CSV to get started",
      icon: Award,
      trend: "neutral" as "neutral",
      accentColor: "#6366f1",
      glowColor: "rgba(99,102,241,0.08)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}
