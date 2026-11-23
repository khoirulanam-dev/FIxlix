import React from "react";

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center animate-pulse">
        <div className="w-5 h-5 rounded-md bg-emerald-600 animate-spin" />
      </div>
      <div className="h-2 w-32 bg-slate-200 rounded-full animate-pulse" />
    </div>
  );
}

