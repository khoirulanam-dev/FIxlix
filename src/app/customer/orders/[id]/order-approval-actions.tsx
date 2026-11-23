"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { ConfirmModal } from "@/components/shared/confirm-modal";

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
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/customer/orders/${orderId}/accept`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal menyetujui order.");
      setShowApproveModal(false);
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
    <>
      <div className="rounded-2xl border border-amber-200/90 bg-amber-50/60 p-6 space-y-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-amber-950">
            Persetujuan Rincian Biaya Servis
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            Mohon teliti rincian biaya jasa dan sparepart di atas. Anda dapat menyetujui pesanan untuk lanjut ke tahap pembayaran digital atau menolak jika terdapat ketidaksesuaian dengan kesepakatan WhatsApp.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Button
            onClick={() => setShowApproveModal(true)}
            disabled={loading}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 flex-1 rounded-xl text-xs sm:text-sm h-11 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Setujui Rincian Biaya</span>
          </Button>

          <Button
            onClick={() => setShowRejectModal(true)}
            disabled={loading}
            variant="outline"
            size="lg"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold gap-2 flex-1 rounded-xl text-xs sm:text-sm h-11"
          >
            <X className="w-4 h-4" />
            <span>Tolak Pesanan</span>
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Approval */}
      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleAccept}
        title="Setujui Pesanan Servis?"
        description={`Anda menyetujui rincian biaya pesanan ${orderNumber}. Status pesanan akan berlanjut ke tahap pembayaran.`}
        confirmText="Ya, Setujui Pesanan"
        variant="success"
        loading={loading}
      />

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => {
              if (!loading) setShowRejectModal(false);
            }}
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200/90 z-10 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Konfirmasi Penolakan Pesanan
                </h4>
                <p className="text-xs text-slate-500">
                  Tuliskan alasan penolakan untuk informasi teknisi
                </p>
              </div>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="rejectReason" className="text-xs font-semibold text-slate-700">
                  Alasan Penolakan *
                </Label>
                <Textarea
                  id="rejectReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Contoh: Kesepakatan harga di WhatsApp berbeda, atau peralatan sudah diperbaiki sendiri..."
                  rows={3}
                  required
                  className="rounded-xl border-slate-200 focus:border-red-500 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectModal(false)}
                  disabled={loading}
                  className="rounded-xl border-slate-200 text-slate-700 text-xs font-semibold px-4"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold px-5 shadow-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Memproses...
                    </>
                  ) : (
                    "Tolak Pesanan"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
