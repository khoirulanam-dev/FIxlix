import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "emerald" | "blue" | "purple" | "amber" | "red" | "slate";
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "emerald",
  trend,
  className,
}: StatCardProps) {
  const variantStyles = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border",
            variantStyles[variant]
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold">
          <span
            className={
              trend.isPositive ? "text-emerald-600" : "text-amber-600"
            }
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
