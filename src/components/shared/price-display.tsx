import React from "react";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number | bigint;
  label?: string;
  isBasePrice?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PriceDisplay({
  amount,
  label,
  isBasePrice = false,
  size = "md",
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm font-semibold",
    md: "text-base font-bold",
    lg: "text-xl font-bold",
    xl: "text-2xl font-extrabold",
  };

  return (
    <div className={cn("inline-flex flex-col", className)}>
      {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
      <div className="flex items-baseline gap-1">
        {isBasePrice && (
          <span className="text-xs text-slate-500 font-normal">Mulai</span>
        )}
        <span className={cn("text-emerald-700 tracking-tight", sizeClasses[size])}>
          {formatRupiah(amount)}
        </span>
      </div>
      {isBasePrice && (
        <span className="text-xs text-slate-500 leading-tight">
          *Hanya biaya jasa, belum termasuk sparepart
        </span>
      )}
    </div>
  );
}

