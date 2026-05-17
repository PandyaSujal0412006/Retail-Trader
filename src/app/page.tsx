"use client";

import { useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { EquityCurve } from "@/components/dashboard/EquityCurve";
import { CsvUploader } from "@/components/dashboard/CsvUploader";
import { TradeLogTable } from "@/components/dashboard/TradeLogTable";
import { FileDown, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] grid-bg">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
        {/* Page title */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Portfolio Overview
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time P&amp;L analytics · NSE &amp; BSE
            </p>
          </div>
          <a
            href="/Zerodha_Sample_Data.csv"
            download
            className="hidden sm:flex items-center gap-2 text-xs text-slate-500 hover:text-emerald-400 transition-colors border border-[#1e2d4a] hover:border-emerald-500/30 rounded-lg px-3 py-2"
          >
            <FileDown className="w-3.5 h-3.5" />
            Sample CSV
          </a>
        </div>

        {/* Hero — 4 stat cards */}
        <SummaryCards />

        {/* Middle row — Chart + Uploader side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <EquityCurve />
          </div>
          <div className="flex flex-col gap-4">
            {/* Upload card */}
            <div className="rounded-xl border border-[#1e2d4a] bg-[#0F1729] p-5 flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Import Trade Log
              </p>
              <CsvUploader />
            </div>

            {/* Guidelines Card */}
            <div className="rounded-xl border border-[#1e2d4a] bg-[#0F1729] p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                How to get your Trade Log?
              </p>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="space-y-1">
                  <span className="text-emerald-400 font-medium">Zerodha Kite:</span>
                  <p>Console &rarr; Reports &rarr; Tradebook &rarr; Select Dates &rarr; Download CSV</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-medium">Upstox:</span>
                  <p>Account &rarr; Reports &rarr; Profit & Loss &rarr; Download Excel/CSV</p>
                </div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-medium">Groww:</span>
                  <p>Profile &rarr; Reports &rarr; P&L Report &rarr; Download CSV</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trade log table */}
        <TradeLogTable />

        {/* Footer */}
        <div className="border-t border-[#1e2d4a] pt-4 pb-6 flex items-center justify-between text-xs text-slate-600">
          <span>
            TradeVault v1.0 · Built for Indian Retail Traders
          </span>
          <span>NSE · BSE · Zerodha · Angel One · Upstox</span>
        </div>
      </main>
    </div>
  );
}
