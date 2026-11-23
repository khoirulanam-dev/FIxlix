import React from "react";
import Link from "next/link";
import { Wrench, ShieldCheck, MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Fixlix
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Marketplace jasa servis dan perbaikan peralatan elektronik rumah tangga. Menghubungkan Anda dengan teknisi terpercaya secara transparan.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Teknisi Terverifikasi & Harga Terbuka</span>
            </div>
          </div>

          {/* Kategori Layanan */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              Kategori Layanan
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/kategori/rice-cooker" className="hover:text-emerald-600 transition-colors">
                  Rice Cooker & Magic Com
                </Link>
              </li>
              <li>
                <Link href="/kategori/fan" className="hover:text-emerald-600 transition-colors">
                  Kipas Angin
                </Link>
              </li>
              <li>
                <Link href="/kategori/television" className="hover:text-emerald-600 transition-colors">
                  Televisi (LED / Smart TV)
                </Link>
              </li>
              <li>
                <Link href="/kategori/ac" className="hover:text-emerald-600 transition-colors">
                  Air Conditioner (AC)
                </Link>
              </li>
              <li>
                <Link href="/kategori/refrigerator" className="hover:text-emerald-600 transition-colors">
                  Kulkas & Pendingin
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigasi & Akun */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/teknisi" className="hover:text-emerald-600 transition-colors">
                  Daftar Teknisi
                </Link>
              </li>
              <li>
                <Link href="/cara-kerja" className="hover:text-emerald-600 transition-colors">
                  Cara Kerja & Konsultasi
                </Link>
              </li>
              <li>
                <Link href="/masuk" className="hover:text-emerald-600 transition-colors">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <Link href="/daftar" className="hover:text-emerald-600 transition-colors">
                  Daftar Pelanggan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kebijakan & Ketentuan */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">
              Informasi & Kebijakan
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/tentang" className="hover:text-emerald-600 transition-colors">
                  Tentang Fixlix
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-600 transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-emerald-600 transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-emerald-600 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Fixlix Indonesia. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            <span>Dibuat untuk kepuasan reparasi elektronik rumah tangga</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

