import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Skeleton */}
      <div className="space-y-2 pb-2">
        <div className="h-7 w-48 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-3.5 w-64 bg-slate-100 rounded-md animate-pulse" />
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-2xs">
            <div className="h-3 w-20 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-7 w-24 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-2xs">
        <div className="h-5 w-44 bg-slate-200 rounded-md animate-pulse" />
        <div className="space-y-2.5 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-50 border border-slate-100 shimmer-box animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
