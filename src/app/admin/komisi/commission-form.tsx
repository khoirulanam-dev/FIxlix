"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

export function CommissionForm({ currentRate }: { currentRate: number }) {
  const router = useRouter();
  const [ratePercent, setRatePercent] = useState<number>(Math.round(currentRate * 100));
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const decimalRate = ratePercent / 100;
    if (decimalRate < 0 || decimalRate > 1) {
      setError("Persentase harus berada di antara 0% dan 100%.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rate: decimalRate,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal memperbarui tarif komisi.");
      }

      setMessage(data.message || "Tarif komisi berhasil diperbarui.");
      setReason("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
      <h3 className="font-bold text-slate-900 text-base">
        Perbarui Tarif Komisi Aktif
      </h3>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rate">Persentase Komisi (%)</Label>
          <div className="relative">
            <Input
              id="rate"
              type="number"
              min={0}
              max={100}
              step={1}
              value={ratePercent}
              onChange={(e) => setRatePercent(Number(e.target.value) || 0)}
              className="pr-10 font-bold text-slate-900 text-lg"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
              %
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Nilai desimal di database: {(ratePercent / 100).toFixed(4)}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reason">Alasan / Catatan Kebijakan</Label>
          <Input
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Penyesuaian komisi kuartal baru"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 h-11"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Menyimpan Perubahan...
          </>
        ) : (
          "Simpan & Terapkan Perubahan Komisi"
        )}
      </Button>
    </form>
  );
}

