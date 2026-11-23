"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, XCircle, AlertTriangle, Loader2 } from "lucide-react";

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

  const handleUpdate = async (newStatus: "VERIFIED" | "SUSPENDED" | "PENDING") => {
    if (!confirm(`Ubah status verifikasi teknisi ini menjadi ${newStatus}?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/technicians/${userId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal mengubah status verifikasi.");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      {currentStatus !== "VERIFIED" && (
        <Button
          size="sm"
          disabled={loading}
          onClick={() => handleUpdate("VERIFIED")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          <span>Setujui (Verify)</span>
        </Button>
      )}

      {currentStatus !== "SUSPENDED" && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => handleUpdate("SUSPENDED")}
          className="border-red-300 text-red-700 hover:bg-red-50 text-xs gap-1"
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
          onClick={() => handleUpdate("PENDING")}
          className="text-slate-500 text-xs"
        >
          Reset ke Pending
        </Button>
      )}
    </div>
  );
}

