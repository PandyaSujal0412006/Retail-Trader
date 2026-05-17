import type { Metadata } from "next";
import "./globals.css";
import { TradeProvider } from "@/contexts/TradeContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "TradeVault — Indian Market Analytics Dashboard",
  description:
    "Premium retail trader analytics dashboard for the Indian stock market. Track P&L, win rate, profit factor, and equity curve with Zerodha/Angel One CSV import.",
  keywords: "trading dashboard, NSE, BSE, Zerodha, P&L tracker, equity curve, India",
  authors: [{ name: "TradeVault" }],
  openGraph: {
    title: "TradeVault — Indian Market Analytics",
    description: "Premium trading analytics for retail investors",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>
          <TradeProvider>{children}</TradeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
