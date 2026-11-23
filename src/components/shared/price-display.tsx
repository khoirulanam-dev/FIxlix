import React from "react";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number | bigint;
  label?: string;
  isBasePrice?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  valueClassName?: string;
}

export function PriceDisplay({
  amount,
  label,
  isBasePrice = false,
  size = "md",
  className,
  valueClassName,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm font-semibold",
    md: "text-base font-bold",
    lg: "text-xl font-bold",
    xl: "text-2xl font-extrabold",
  };

  return (
    <div className={cn("inline-flex flex-col", className)}>
      {label && <span className={cn("text-xs font-medium", valueClassName ? "opacity-90 text-inherit" : "text-slate-500")}>{label}</span>}
      <div className="flex items-baseline gap-1">
        {isBasePrice && (
          <span className={cn("text-xs font-normal", valueClassName ? "opacity-80 text-inherit" : "text-slate-500")}>Mulai</span>
        )}
        <span className={cn(sizeClasses[size], "tracking-tight", valueClassName || "text-emerald-700")}>
          {formatRupiah(amount)}
        </span>
      </div>
      {isBasePrice && (
        <span className={cn("text-xs leading-tight", valueClassName ? "opacity-80 text-inherit" : "text-slate-500")}>
          *Hanya biaya jasa, belum termasuk sparepart
        </span>
      )}
    </div>
  );
}

