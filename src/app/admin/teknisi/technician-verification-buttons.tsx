"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/components/shared/confirm-modal";

interface TechnicianVerificationButtonsProps {
  userId: string;
  currentStatus: string;
}

export function TechnicianVerificationButtons({
  userId,
  currentStatus,
}: TechnicianVerificationButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"VERIFIED" | "SUSPENDED" | "PENDING" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const confirmConfig = {
    VERIFIED: {
      title: "Verifikasi Akun Teknisi",
      description: "Teknisi ini akan diverifikasi resmi dan listing jasanya dapat langsung dipesan oleh pelanggan.",
      confirmText: "Verifikasi Sekarang",
      variant: "success" as const,
    },
    SUSPENDED: {
      title: "Tangguhkan Akun Teknisi",
      description: "Akses teknisi ini akan dinonaktifkan sementara dan profilnya tidak akan muncul dalam pencarian pelanggan.",
      confirmText: "Tangguhkan Akun",
      variant: "danger" as const,
    },
    PENDING: {
      title: "Reset Status ke Pending",
      description: "Status verifikasi akan dikembalikan ke peninjauan awal.",
      confirmText: "Kembalikan ke Pending",
      variant: "warning" as const,
    },
  };

  const handleExecute = async () => {
    if (!pendingStatus) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/technicians/${userId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingStatus }),
      });

      if (!res.ok) throw new Error("Gagal mengubah status verifikasi teknisi.");
      setPendingStatus(null);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        {currentStatus !== "VERIFIED" && (
          <Button
            size="sm"
            disabled={loading}
            onClick={() => setPendingStatus("VERIFIED")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 rounded-xl shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Setujui (Verify)</span>
          </Button>
        )}

        {currentStatus !== "SUSPENDED" && (
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => setPendingStatus("SUSPENDED")}
            className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold gap-1.5 rounded-xl"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Tangguhkan (Suspend)</span>
          </Button>
        )}

        {currentStatus !== "PENDING" && (
          <Button
            size="sm"
            variant="ghost"
            disabled={loading}
            onClick={() => setPendingStatus("PENDING")}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-xs rounded-xl"
          >
            Reset ke Pending
          </Button>
        )}
      </div>

      {pendingStatus && (
        <ConfirmModal
          isOpen={!!pendingStatus}
          onClose={() => setPendingStatus(null)}
          onConfirm={handleExecute}
          title={confirmConfig[pendingStatus].title}
          description={confirmConfig[pendingStatus].description}
          confirmText={confirmConfig[pendingStatus].confirmText}
          variant={confirmConfig[pendingStatus].variant}
          loading={loading}
        />
      )}
    </>
  );
}
