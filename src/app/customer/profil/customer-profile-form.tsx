"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

interface CustomerProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    image: string;
  };
}

export function CustomerProfileForm({ initialData }: CustomerProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [image, setImage] = useState(initialData.image || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          image,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal memperbarui profil.");
      }

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      {saved && (
        <Alert variant="success" className="rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <AlertTitle className="text-emerald-950 font-bold">Profil Berhasil Disimpan</AlertTitle>
            <AlertDescription className="text-emerald-800 text-xs sm:text-sm">
              Perubahan profil dan foto avatar Anda telah berhasil diperbarui.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Foto Avatar Pelanggan (File Upload) */}
      <div className="space-y-2">
        <ImageUpload
          label="Foto Avatar Profil"
          description="Unggah foto profil Anda. Format JPG, PNG, atau WEBP maks 5 MB."
          aspectRatio="square"
          value={image}
          onChange={setImage}
          onRemove={() => setImage("")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
            Nama Lengkap *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
            Nomor Telepon / WhatsApp
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081288889999"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
          Alamat Email (Akun Utama)
        </Label>
        <Input
          id="email"
          value={initialData.email}
          disabled
          className="bg-slate-50 text-slate-500 cursor-not-allowed"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-8 rounded-xl shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Menyimpan Profil...
            </>
          ) : (
            "Simpan Perubahan Profil"
          )}
        </Button>
      </div>
    </form>
  );
}

