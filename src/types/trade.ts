export interface Trade {
  id: string;
  symbol: string;
  date: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  pnl: number;
  pnlPercentage: number;
  status: "WIN" | "LOSS";
  exchange: string;
  segment: string;
}

export interface DashboardStats {
  totalNetPnL: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  grossProfit: number;
  grossLoss: number;
  wins: number;
  losses: number;
}

export interface EquityPoint {
  date: string;
  balance: number;
  pnl: number;
}
