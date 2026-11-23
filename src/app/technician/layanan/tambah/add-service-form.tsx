"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

export function AddServiceForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();

  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [laborBasePrice, setLaborBasePrice] = useState<number>(75000);
  const [imageKey, setImageKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul layanan wajib diisi.");
      return;
    }
    if (!description.trim()) {
      setError("Deskripsi layanan wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/technician/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          title,
          description,
          laborBasePrice,
          imageKey: imageKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal menambahkan layanan.");
      }

      router.push("/technician/layanan");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="category">Kategori Peralatan *</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Judul Layanan *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Cuci AC Inverter 1 PK / Servis TV Mati Total"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="desc">Deskripsi Cakupan Servis *</Label>
        <Textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan apa saja yang dikerjakan pada servis ini, keunggulan, dan garansi..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price">Harga Jasa Dasar (Labor Fee) *</Label>
        <p className="text-xs text-slate-500">
          Hanya upah jasa pengerjaan teknisi, belum termasuk sparepart.
        </p>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
            Rp
          </span>
          <Input
            id="price"
            type="number"
            min={10000}
            step={5000}
            value={laborBasePrice}
            onChange={(e) => setLaborBasePrice(Number(e.target.value) || 0)}
            className="pl-12 font-bold text-slate-900"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="img">URL Foto Layanan (Opsional)</Label>
        <Input
          id="img"
          value={imageKey}
          onChange={(e) => setImageKey(e.target.value)}
          placeholder="https://example.com/foto-layanan.jpg"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Menyimpan Layanan...
          </>
        ) : (
          "Simpan ke Katalog Layanan"
        )}
      </Button>
    </form>
  );
}

