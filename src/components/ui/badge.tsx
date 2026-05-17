import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-slate-700 bg-slate-800 text-slate-200",
        win: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        loss: "border-rose-500/30 bg-rose-500/10 text-rose-400",
        outline: "border-slate-600 text-slate-300",
        nse: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        bse: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        eq: "border-purple-500/30 bg-purple-500/10 text-purple-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
