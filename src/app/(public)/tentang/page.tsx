import React from "react";
import { Wrench, ShieldCheck, Heart, Award } from "lucide-react";

export default function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Tentang Fixlix
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Platform marketplace modern yang menghubungkan pemilik peralatan elektronik rumah tangga dengan teknisi ahli terpercaya di Indonesia.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 space-y-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Visi & Misi Kami</h2>
          <p className="leading-relaxed">
            Fixlix hadir untuk menyelesaikan permasalahan klasik dalam servis peralatan elektronik rumah tangga: ketidakpastian biaya, kesulitan menemukan teknisi ahli yang jujur, dan minimnya transparansi rincian pengerjaan.
          </p>
          <p className="leading-relaxed">
            Melalui pendekatan digital yang praktis, kami memadukan fleksibilitas konsultasi langsung via WhatsApp dengan keandalan sistem persetujuan pesanan dan transparansi akuntansi yang jelas antara pelanggan, teknisi, dan platform.
          </p>
        </div>

        <div className="stagger-container grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Teknisi Terverifikasi</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Setiap teknisi yang terdaftar melalui proses verifikasi identitas, keahlian bidang elektronik, dan rekam jejak kerja.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-2">
            <Award className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="text-lg font-bold text-slate-900">Transparansi Tanpa Mark-up</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Biaya jasa tenaga kerja, sparepart, dan biaya operasional dipisahkan secara rinci. Komisi platform hanya berlaku pada biaya jasa tenaga kerja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

