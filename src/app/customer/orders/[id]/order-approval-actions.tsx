"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";

interface OrderApprovalActionsProps {
  orderId: string;
  orderNumber: string;
}

export function OrderApprovalActions({
  orderId,
  orderNumber,
}: OrderApprovalActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!confirm(`Apakah Anda yakin ingin menyetujui rincian biaya pesanan ${orderNumber}?`)) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/customer/orders/${orderId}/accept`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal menyetujui order.");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/customer/orders/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal menolak order.");
      setShowRejectModal(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 sm:p-8 space-y-4">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-amber-900">
          Persetujuan Rincian Biaya Pesanan
        </h3>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
          Mohon teliti rincian biaya jasa dan sparepart di atas. Anda dapat menyetujui pesanan untuk lanjut ke tahap pembayaran atau menolak pesanan jika tidak sesuai dengan kesepakatan WhatsApp.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={handleAccept}
          disabled={loading}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 flex-1 shadow-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          <span>Setujui Rincian Biaya</span>
        </Button>

        <Button
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          variant="outline"
          size="lg"
          className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 font-semibold gap-2 flex-1"
        >
          <X className="w-5 h-5" />
          <span>Tolak Pesanan</span>
        </Button>
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4 shadow-2xl">
            <h4 className="font-bold text-base text-slate-900">
              Konfirmasi Penolakan Pesanan
            </h4>
            <p className="text-xs text-slate-500">
              Silakan tuliskan alasan penolakan pesanan ini untuk informasi teknisi:
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reason">Alasan Penolakan</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Contoh: Biaya sparepart tidak sesuai kesepakatan chat / ingin membatalkan servis"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? "Menolak..." : "Ya, Tolak Pesanan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

