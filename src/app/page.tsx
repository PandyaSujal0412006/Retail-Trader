"use client";

import { useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { FileDown, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const EquityCurve = dynamic(() => import("@/components/dashboard/EquityCurve").then(mod => mod.EquityCurve), { 
  ssr: false, 
  loading: () => <div className="h-[400px] flex items-center justify-center border border-[#1e2d4a] rounded-xl bg-[#0F1729]"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div> 
});

const CsvUploader = dynamic(() => import("@/components/dashboard/CsvUploader").then(mod => mod.CsvUploader), { 
  ssr: false,
  loading: () => <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-[#1e2d4a] rounded-xl"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div> 
});

const TradeLogTable = dynamic(() => import("@/components/dashboard/TradeLogTable").then(mod => mod.TradeLogTable), { 
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center border border-[#1e2d4a] rounded-xl bg-[#0F1729]"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div> 
});

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
        <div className="border-t border-[#1e2d4a] pt-4 pb-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-1 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} TradeMudra. All rights reserved.</span>
            <span className="hidden sm:inline">|</span>
            <span>Owned by Sujal Pandya</span>
          </div>
          <div className="flex items-center space-x-3 text-center sm:text-right">
            <a href="mailto:sujal.pandya0412006@gmail.com" className="hover:text-emerald-400 transition-colors">sujal.pandya0412006@gmail.com</a>
            <span className="hidden sm:inline">|</span>
            <a href="tel:+918799467476" className="hover:text-emerald-400 transition-colors">+91 87994 67476</a>
          </div>
        </div>
      </main>
    </div>
  );
}
