import React from "react";

export default function TechnicianLoading() {
  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-3.5 w-80 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <div className="h-7 w-28 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* List / Table Skeleton */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-2xs">
        <div className="flex justify-between items-center">
          <div className="h-5 w-36 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-20 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-50 border border-slate-100 shimmer-box animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

