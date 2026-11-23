import React from "react";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "Bagaimana cara melakukan konsultasi perbaikan barang?",
      a: "Anda cukup memilih teknisi atau layanan yang diinginkan, kemudian klik tombol 'Konsultasi WhatsApp'. Anda akan langsung diarahkan ke nomor WhatsApp teknisi dengan format pesan otomatis mengenai barang Anda.",
    },
    {
      q: "Apakah biaya yang tertera di katalog layanan sudah merupakan harga akhir?",
      a: "Harga dasar yang tertera di katalog adalah biaya jasa pengerjaan standar teknisi dan belum termasuk penggantian sparepart. Harga akhir disepakati bersama teknisi via WhatsApp tergantung tingkat kerusakan fisik barang.",
    },
    {
      q: "Kapan saya harus membayar pesanan?",
      a: "Setelah kesepakatan harga di WhatsApp, teknisi akan membuatkan rincian order di dashboard Fixlix Anda. Anda wajib meninjau dan menekan tombol 'Setujui' sebelum dapat melakukan pembayaran.",
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Fixlix menyediakan simulasi pembayaran digital melalui QRIS, Transfer Bank, dan E-Wallet (GoPay, OVO, Dana) yang cepat dan otomatis tercatat.",
    },
    {
      q: "Apakah ada garansi setelah pengerjaan selesai?",
      a: "Setiap teknisi terverifikasi di Fixlix memberikan garansi servis untuk pengerjaan yang sama sesuai kesepakatan kerja.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pertanyaan Umum (FAQ)
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Temukan jawaban atas pertanyaan seputar penggunaan platform dan alur perbaikan di Fixlix.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2">
            <h3 className="font-bold text-base text-slate-900 flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{f.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 pl-7 leading-relaxed">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

