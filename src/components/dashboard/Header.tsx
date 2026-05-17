"use client";

import { TrendingUp, LogOut, Zap, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  const { user, profile, logout } = useAuth();

  return (
    <header className="border-b border-[#1e2d4a] bg-[#0B1120]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">
              TradeVault
            </h1>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Indian Market Analytics
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              NSE
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              BSE
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-700" />
          <div className="text-right hidden sm:block">
            <div className="text-xs font-mono text-slate-300">
              {new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Kolkata",
              })}{" "}
              IST
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "Asia/Kolkata",
              })}
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className="border-t border-[#1e2d4a] bg-[#0F172A]/50 px-6 py-2 flex items-center justify-between text-xs">
          <span className="text-slate-400">Logged in as: <span className="text-slate-200">{user.email}</span></span>
          <div className="flex items-center gap-3">
            {profile?.isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="h-7 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Admin
                </Button>
              </Link>
            )}
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="h-7 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Upgrade to Pro
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="h-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
