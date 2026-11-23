"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Play, CheckCircle2, XCircle } from "lucide-react";

interface TechnicianOrderActionsProps {
  orderId: string;
  status: string;
}

export function TechnicianOrderActions({
  orderId,
  status,
}: TechnicianOrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (newStatus: "IN_PROGRESS" | "COMPLETED" | "CANCELLED") => {
    const confirmationText =
      newStatus === "IN_PROGRESS"
        ? "Mulai pengerjaan perangkat ini sekarang?"
        : newStatus === "COMPLETED"
        ? "Tandai pengerjaan servis telah selesai?"
        : "Batalkan pesanan ini?";

    if (!confirm(confirmationText)) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/technician/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal memperbarui status.");

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 space-y-4">
      <h3 className="font-bold text-base text-white">
        Aksi & Pembaruan Status Pengerjaan
      </h3>

      {error && (
        <div className="p-3 rounded-xl bg-red-900/50 text-red-200 text-xs border border-red-800">
          {error}
        </div>
      )}

      {status === "PENDING_CUSTOMER_APPROVAL" && (
        <p className="text-xs text-slate-400">
          Menunggu pelanggan meninjau dan menyetujui rincian pesanan ini. Anda akan menerima notifikasi saat disetujui.
        </p>
      )}

      {status === "AWAITING_PAYMENT" && (
        <p className="text-xs text-slate-400">
          Pelanggan telah menyetujui pesanan. Menunggu pelanggan menyelesaikan pembayaran sebelum Anda dapat memulai pengerjaan.
        </p>
      )}

      {status === "PAID" && (
        <div className="space-y-3">
          <p className="text-xs text-emerald-400 font-medium">
            ✓ Pembayaran telah diterima. Silakan klik tombol di bawah untuk memulai pengerjaan servis.
          </p>
          <Button
            onClick={() => handleUpdate("IN_PROGRESS")}
            disabled={loading}
            size="lg"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>Mulai Pengerjaan Servis (In Progress)</span>
          </Button>
        </div>
      )}

      {status === "IN_PROGRESS" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-300">
            Perangkat sedang dalam pengerjaan. Setelah selesai dan diuji berfungsi normal, klik tombol di bawah ini:
          </p>
          <Button
            onClick={() => handleUpdate("COMPLETED")}
            disabled={loading}
            size="lg"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 shadow-md"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            <span>Tandai Pengerjaan Selesai (Completed)</span>
          </Button>
        </div>
      )}

      {status === "COMPLETED" && (
        <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Pesanan ini telah selesai dikerjakan. Pelanggan telah diminta memberikan rating & ulasan.
        </p>
      )}
    </div>
  );
}

