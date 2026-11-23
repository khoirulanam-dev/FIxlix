import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Syarat dan Ketentuan Layanan
        </h1>
        <p className="text-xs text-slate-500">
          Terakhir diperbarui: 23 November 2026
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-base text-slate-900">1. Pendahuluan</h2>
          <p>
            Selamat datang di Fixlix. Dengan mengakses atau menggunakan situs web dan layanan Fixlix, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-slate-900">2. Peran Platform</h2>
          <p>
            Fixlix bertindak sebagai marketplace penghubung antara pelanggan yang membutuhkan jasa perbaikan peralatan rumah tangga dengan teknisi independen yang terverifikasi. Transaksi perbaikan dan konsultasi teknis disepakati antara pelanggan dan teknisi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-slate-900">3. Transparansi Biaya dan Pembayaran</h2>
          <p>
            Biaya jasa dan kebutuhan sparepart dicantumkan secara transparan dalam form rincian pesanan. Pelanggan wajib meninjau dan menyetujui rincian biaya sebelum pesanan dikerjakan. Fitur checkout menggunakan simulasi pembayaran digital terintegrasi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-slate-900">4. Ulasan dan Rating</h2>
          <p>
            Pelanggan berhak memberikan ulasan dan rating objektif untuk pesanan yang telah berstatus selesai. Ulasan palsu atau bermuatan ujaran kebencian dilarang keras.
          </p>
        </section>
      </div>
    </div>
  );
}

