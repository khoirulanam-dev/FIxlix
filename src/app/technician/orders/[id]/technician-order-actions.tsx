"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Play, CheckCircle2, XCircle } from "lucide-react";
import { ConfirmModal } from "@/components/shared/confirm-modal";

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
  const [pendingAction, setPendingAction] = useState<"IN_PROGRESS" | "COMPLETED" | null>(null);

  const actionConfig = {
    IN_PROGRESS: {
      title: "Mulai Pengerjaan Servis?",
      description: "Status pesanan akan diubah menjadi 'Dalam Pengerjaan' (In Progress). Pelanggan dapat memantau status ini secara realtime.",
      confirmText: "Ya, Mulai Sekarang",
      variant: "success" as const,
    },
    COMPLETED: {
      title: "Tandai Pengerjaan Selesai?",
      description: "Pastikan seluruh pemeriksaan dan pengujian fungsi perangkat elektronik telah selesai dan berfungsi normal.",
      confirmText: "Ya, Selesaikan Servis",
      variant: "success" as const,
    },
  };

  const executeAction = async () => {
    if (!pendingAction) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/technician/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingAction }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal memperbarui status.");

      setPendingAction(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-sm text-slate-900">
            Aksi & Pembaruan Status Pengerjaan
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kontrol tahapan perbaikan fisik perangkat elektronik pelanggan
          </p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          {status === "PENDING_CUSTOMER_APPROVAL" && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong>Menunggu Persetujuan Pelanggan:</strong> Pelanggan sedang meninjau rincian biaya pesanan ini. Anda akan menerima pembaruan saat disetujui.
            </div>
          )}

          {status === "AWAITING_PAYMENT" && (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 leading-relaxed">
              <strong>Menunggu Pembayaran:</strong> Pelanggan telah menyetujui rincian biaya. Menunggu penyelesaian pembayaran digital sebelum servis dapat dimulai.
            </div>
          )}

          {status === "PAID" && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 font-medium">
                ✓ Pembayaran telah diterima secara penuh. Silakan klik tombol di bawah untuk memulai proses perbaikan.
              </div>
              <Button
                onClick={() => setPendingAction("IN_PROGRESS")}
                disabled={loading}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl text-xs sm:text-sm h-11 px-5 shadow-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Pengerjaan Servis (In Progress)</span>
              </Button>
            </div>
          )}

          {status === "IN_PROGRESS" && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                Perangkat sedang dalam pengerjaan. Setelah selesai dan diuji berfungsi normal, klik tombol di bawah untuk menyelesaikan pesanan:
              </div>
              <Button
                onClick={() => setPendingAction("COMPLETED")}
                disabled={loading}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl text-xs sm:text-sm h-11 px-5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tandai Pengerjaan Selesai (Completed)</span>
              </Button>
            </div>
          )}

          {status === "COMPLETED" && (
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pesanan ini telah selesai dikerjakan. Pelanggan telah diminta memberikan rating & ulasan.</span>
            </div>
          )}
        </div>
      </div>

      {pendingAction && (
        <ConfirmModal
          isOpen={!!pendingAction}
          onClose={() => setPendingAction(null)}
          onConfirm={executeAction}
          title={actionConfig[pendingAction].title}
          description={actionConfig[pendingAction].description}
          confirmText={actionConfig[pendingAction].confirmText}
          variant={actionConfig[pendingAction].variant}
          loading={loading}
        />
      )}
    </>
  );
}
