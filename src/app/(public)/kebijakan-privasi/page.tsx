import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kebijakan Privasi
        </h1>
        <p className="text-xs text-slate-500">
          Terakhir diperbarui: 23 November 2026
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-base text-slate-900">1. Data yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan data akun seperti nama, alamat email, nomor telepon WhatsApp, dan riwayat pesanan yang Anda buat untuk keperluan penyediaan layanan reparasi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-slate-900">2. Penggunaan Data</h2>
          <p>
            Informasi Anda hanya digunakan untuk memfasilitasi komunikasi antara Anda dengan teknisi serta pencatatan transaksi layanan perbaikan. Kami tidak menjual data pribadi Anda kepada pihak ketiga mana pun.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-slate-900">3. Keamanan Data</h2>
          <p>
            Data akun dan kata sandi dienkripsi menggunakan standar keamanan tinggi dan disimpan pada infrastruktur cloud yang aman.
          </p>
        </section>
      </div>
    </div>
  );
}

