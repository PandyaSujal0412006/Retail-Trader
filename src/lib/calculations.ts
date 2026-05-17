import { Trade, DashboardStats, EquityPoint } from "@/types/trade";

export const INITIAL_CAPITAL = 100_000; // ₹1,00,000

export function calculateStats(trades: Trade[]): DashboardStats {
  if (trades.length === 0) {
    return {
      totalNetPnL: 0,
      winRate: 0,
      profitFactor: 0,
      totalTrades: 0,
      grossProfit: 0,
      grossLoss: 0,
      wins: 0,
      losses: 0,
    };
  }

  const wins = trades.filter((t) => t.status === "WIN");
  const losses = trades.filter((t) => t.status === "LOSS");
  const grossProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
  const totalNetPnL = trades.reduce((sum, t) => sum + t.pnl, 0);

  return {
    totalNetPnL: Math.round(totalNetPnL * 100) / 100,
    winRate: (wins.length / trades.length) * 100,
    profitFactor: grossLoss === 0 ? grossProfit : grossProfit / grossLoss,
    totalTrades: trades.length,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossLoss: Math.round(grossLoss * 100) / 100,
    wins: wins.length,
    losses: losses.length,
  };
}

export function buildEquityCurve(trades: Trade[]): EquityPoint[] {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let balance = INITIAL_CAPITAL;
  const curve: EquityPoint[] = [
    { date: "Start", balance: INITIAL_CAPITAL, pnl: 0 },
  ];

  sorted.forEach((trade) => {
    balance += trade.pnl;
    curve.push({
      date: trade.date,
      balance: Math.round(balance * 100) / 100,
      pnl: trade.pnl,
    });
  });

  return curve;
}
