"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Trade, DashboardStats, EquityPoint } from "@/types/trade";
import { calculateStats, buildEquityCurve } from "@/lib/calculations";

interface TradeContextType {
  trades: Trade[];
  stats: DashboardStats;
  equityCurve: EquityPoint[];
  setTrades: (trades: Trade[]) => void;
  clearTrades: () => void;
  isLoading: boolean;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);
const STORAGE_KEY = "tradevault_trades_v1";

export function TradeProvider({ children }: { children: ReactNode }) {
  const [trades, setTradesState] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTradesState(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load trades:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setTrades = (newTrades: Trade[]) => {
    setTradesState(newTrades);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTrades));
    } catch (e) {
      console.error("Failed to save trades:", e);
    }
  };

  const clearTrades = () => {
    setTradesState([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TradeContext.Provider
      value={{
        trades,
        stats: calculateStats(trades),
        equityCurve: buildEquityCurve(trades),
        setTrades,
        clearTrades,
        isLoading,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export function useTrades() {
  const ctx = useContext(TradeContext);
  if (!ctx) throw new Error("useTrades must be used within TradeProvider");
  return ctx;
}
