"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { QrCode, Building, Wallet, CheckCircle2, Loader2, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CheckoutPaymentFormProps {
  orderId: string;
  totalAmount: number;
}

export function CheckoutPaymentForm({
  orderId,
  totalAmount,
}: CheckoutPaymentFormProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<
    "SIMULATED_QRIS" | "SIMULATED_BANK_TRANSFER" | "SIMULATED_EWALLET"
  >("SIMULATED_QRIS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/customer/orders/${orderId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal memproses pembayaran.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/customer/orders/${orderId}`);
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pembayaran Berhasil!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Transaksi sebesar <strong className="font-mono text-slate-900">{formatRupiah(totalAmount)}</strong> telah berhasil diverifikasi. Dana Anda aman bersama Fixlix dan pesanan diteruskan ke teknisi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href={`/customer/orders/${orderId}`} className="w-full sm:w-auto">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-5 rounded-xl shadow-sm">
              <span>Lihat Detail & Panduan Servis</span>
            </Button>
          </Link>
          <Link href="/customer/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-11 px-5 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Ke Daftar Pesanan</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-900 text-sm">
          Pilih Metode Pembayaran
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilih kanal simulasi transaksi digital yang diinginkan
        </p>
      </div>

      <div className="p-6 space-y-5">
        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        {/* Methods Radio Cards */}
        <div className="space-y-3">
          {/* QRIS */}
          <div
            onClick={() => setSelectedMethod("SIMULATED_QRIS")}
            className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all ${
              selectedMethod === "SIMULATED_QRIS"
                ? "border-emerald-600 bg-emerald-50/40 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">QRIS Instan</div>
                <div className="text-xs text-slate-500">Scan via BCA, Mandiri, GoPay, OVO, ShopeePay</div>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
              {selectedMethod === "SIMULATED_QRIS" && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              )}
            </div>
          </div>

          {/* Bank Transfer */}
          <div
            onClick={() => setSelectedMethod("SIMULATED_BANK_TRANSFER")}
            className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all ${
              selectedMethod === "SIMULATED_BANK_TRANSFER"
                ? "border-emerald-600 bg-emerald-50/40 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">Transfer Bank Virtual Account</div>
                <div className="text-xs text-slate-500">BCA, Mandiri, BNI, BRI</div>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
              {selectedMethod === "SIMULATED_BANK_TRANSFER" && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              )}
            </div>
          </div>

          {/* E-Wallet */}
          <div
            onClick={() => setSelectedMethod("SIMULATED_EWALLET")}
            className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all ${
              selectedMethod === "SIMULATED_EWALLET"
                ? "border-emerald-600 bg-emerald-50/40 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">E-Wallet</div>
                <div className="text-xs text-slate-500">GoPay, OVO, DANA, LinkAja</div>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
              {selectedMethod === "SIMULATED_EWALLET" && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <Button
            onClick={handlePay}
            disabled={loading}
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-sm text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Memproses Transaksi...
              </>
            ) : (
              `Bayar ${formatRupiah(totalAmount)} Sekarang`
            )}
          </Button>

          <Link href={`/customer/orders/${orderId}`} className="block">
            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-800 text-xs font-semibold h-9 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Batal & Kembali ke Rincian Pesanan</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Simulasi transaksi aman dan terverifikasi secara instan</span>
        </div>
      </div>
    </div>
  );
}
