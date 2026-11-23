import React from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, ShieldCheck, CheckCircle2, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CaraKerjaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cara Kerja Layanan Fixlix
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Panduan praktis menggunakan platform Fixlix untuk memperbaiki peralatan elektronik rumah tangga Anda secara aman, transparan, dan terpercaya.
        </p>
      </div>

      {/* 4 Steps Detailed */}
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 text-xl">
            1
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              Pilih Kategori & Temukan Teknisi Terverifikasi
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Jelajahi kategori servis kami (Rice Cooker, Kipas Angin, Televisi, AC, Kulkas) atau cari teknisi spesialis berdasarkan lokasi terdekat. Anda dapat melihat bio keahlian, ulasan asli pelanggan lain, serta katalog jenis perbaikan yang ditangani teknisi.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#1DA851] font-extrabold flex items-center justify-center shrink-0 text-xl">
            2
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              Konsultasi Langsung via WhatsApp
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Klik tombol <strong>"Konsultasi WhatsApp"</strong> pada profil teknisi atau layanan. Anda akan diarahkan ke WhatsApp teknisi dengan pesan pengantar otomatis. Jelaskan merek, tipe, dan gejala kerusakan barang Anda. Diskusikan perkiraan kebutuhan sparepart dan sepakati harga perbaikan.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-xl">
            3
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              Tinjau & Setujui Order di Akun Anda
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Setelah kesepakatan di WhatsApp, teknisi akan menerbitkan form order resmi ke akun Fixlix Anda. Anda dapat memeriksa rincian biaya: biaya jasa tenaga kerja, biaya sparepart (jika ada), dan biaya operasional. <strong>Order tidak akan diproses sebelum Anda menyetujuinya.</strong>
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center shrink-0 text-xl">
            4
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              Pengerjaan Selesai & Berikan Ulasan
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Teknisi melakukan perbaikan hingga perangkat berfungsi normal kembali. Setelah teknisi menandai pekerjaan selesai, Anda dipersilakan memberikan rating bintang 1–5 dan ulasan pengalaman nyata untuk membantu pelanggan lainnya.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-emerald-600 p-8 sm:p-10 text-white text-center space-y-4 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Peralatan Elektronik Anda Sedang Bermasalah?
        </h2>
        <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
          Temukan teknisi ahli sekarang juga dan nikmati perbaikan peralatan rumah tangga tanpa rasa cemas.
        </p>
        <div className="pt-2">
          <Link href="/teknisi">
            <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-8">
              Cari Teknisi Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

