import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-10 h-10 stroke-[1.75]" />
            </div>
            <span className="absolute -top-1 -right-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
              403
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Akses Dibatasi
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Anda tidak memiliki izin atau wewenang untuk membuka halaman ini. Pastikan Anda telah masuk dengan peran akun yang sesuai (Pelanggan / Teknisi / Admin).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 h-11 px-5 shadow-sm shadow-emerald-600/20">
                <Home className="w-4 h-4" />
                <span>Ke Halaman Utama</span>
              </Button>
            </Link>
            <Link href="/masuk" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full font-semibold gap-2 h-11 px-5 border-slate-200 hover:bg-slate-100">
                <LogIn className="w-4 h-4" />
                <span>Ganti Akun</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

