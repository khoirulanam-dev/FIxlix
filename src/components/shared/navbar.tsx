"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, Search, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
  const userRole = (user as any)?.role || "CUSTOMER";

  const getDashboardHref = () => {
    if (userRole === "ADMIN") return "/admin";
    if (userRole === "TECHNICIAN") return "/technician";
    return "/customer";
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  Fixlix
                </span>
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
                  Marketplace Servis
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/kategori"
                className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Kategori Servis
              </Link>
              <Link
                href="/teknisi"
                className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Cari Teknisi
              </Link>
              <Link
                href="/cara-kerja"
                className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Cara Kerja
              </Link>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/teknisi">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100/90 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
              >
                <Search className="h-4 w-4 text-slate-500" />
                <span>Cari</span>
              </button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href={getDashboardHref()}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/25 hover:shadow-md hover:shadow-emerald-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4 text-white shrink-0" />
                    <span>Dashboard</span>
                  </button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/masuk">
                  <Button variant="ghost" size="sm" className="font-medium text-slate-700">
                    Masuk
                  </Button>
                </Link>
                <Link href="/daftar">
                  <Button size="sm" className="font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Beranda
          </Link>
          <Link
            href="/kategori"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Kategori Servis
          </Link>
          <Link
            href="/teknisi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Cari Teknisi
          </Link>
          <Link
            href="/cara-kerja"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Cara Kerja
          </Link>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl gap-2 shadow-sm justify-center">
                    <LayoutDashboard className="h-4 w-4 text-white" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-red-600 justify-center"
                >
                  Keluar
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/masuk" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Masuk
                  </Button>
                </Link>
                <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-emerald-600 text-white justify-center">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

