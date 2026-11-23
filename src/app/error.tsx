"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-10 h-10 stroke-[1.75]" />
            </div>
            <span className="absolute -top-1 -right-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white shadow-xs">
              500
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Terjadi Gangguan Sistem
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sistem Fixlix sedang mengalami kendala sementara saat memproses data Anda. Silakan coba muat ulang atau kembali beberapa saat lagi.
            </p>
            {error?.digest && (
              <p className="text-xs font-mono text-slate-400 bg-slate-100 py-1 px-2.5 rounded-lg inline-block">
                ID Error: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 h-11 px-5 shadow-sm shadow-emerald-600/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Coba Muat Ulang</span>
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full font-semibold gap-2 h-11 px-5 border-slate-200 hover:bg-slate-100">
                <Home className="w-4 h-4" />
                <span>Ke Beranda</span>
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200/60">
            <p className="text-xs text-slate-400">
              Perlu panduan lebih lanjut? Buka{" "}
              <Link href="/faq" className="text-emerald-600 font-semibold hover:underline">
                Pusat Bantuan & FAQ
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

