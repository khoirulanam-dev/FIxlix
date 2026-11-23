import React from "react";

export default function PublicLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
      {/* Top Banner Skeleton */}
      <div className="w-full h-48 sm:h-64 rounded-3xl bg-slate-100 shimmer-box animate-pulse" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4 shadow-2xs">
            <div className="h-36 rounded-xl bg-slate-100 shimmer-box animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-100 rounded-md animate-pulse" />
            </div>
            <div className="pt-2 flex justify-between items-center">
              <div className="h-5 w-24 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
