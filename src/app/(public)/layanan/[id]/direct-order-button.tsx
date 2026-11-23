"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import { ShoppingBag, Loader2, X } from "lucide-react";

interface DirectOrderButtonProps {
  serviceId: string;
  serviceTitle: string;
  basePrice: number;
}

export function DirectOrderButton({
  serviceId,
  serviceTitle,
  basePrice,
}: DirectOrderButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!session?.user) {
      router.push(`/masuk?redirect=/layanan/${serviceId}`);
      return;
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!deviceName.trim()) {
      setError("Silakan isi nama / merek perangkat Anda.");
      return;
    }
    if (!description.trim()) {
      setError("Silakan jelaskan gejala kerusakan perangkat.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/customer/orders/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          deviceName,
          description,
          customerNotes: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal membuat order langsung.");
      }

      router.push(`/customer/orders/${data.orderId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="lg"
        onClick={handleClick}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 font-semibold"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Order Jasa Dasar Langsung</span>
      </Button>

      {/* Modal / Dialog for Direct Order */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in-0 zoom-in-95">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Order Jasa Dasar
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Layanan: <strong className="text-slate-700">{serviceTitle}</strong>
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">Biaya Jasa Dasar:</span>
              <span className="font-bold text-emerald-700 text-base">
                {formatRupiah(basePrice)}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="deviceName">Nama & Merek Perangkat *</Label>
                <Input
                  id="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Contoh: AC Sharp 1 PK Inverter / Kulkas 2 Pintu LG"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi Kerusakan / Gejala *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kendala yang dialami, misalnya tidak dingin, bocor air, berbunyi bising..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alamat patokan atau instruksi untuk teknisi"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Memproses...
                    </>
                  ) : (
                    "Buat Pesanan"
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

