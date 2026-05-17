import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  const absAmount = Math.abs(amount);
  let formatted: string;

  if (absAmount >= 10_000_000) {
    formatted = `₹${(absAmount / 10_000_000).toFixed(2)} Cr`;
  } else if (absAmount >= 100_000) {
    formatted = `₹${(absAmount / 100_000).toFixed(2)} L`;
  } else {
    formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absAmount);
  }

  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}
