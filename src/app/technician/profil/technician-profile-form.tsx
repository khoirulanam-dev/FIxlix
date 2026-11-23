"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";

interface TechnicianProfileFormProps {
  initialData: {
    displayName: string;
    bio: string;
    whatsappPhone: string;
    serviceAreaText: string;
    profileImageKey: string;
    email: string;
  };
}

export function TechnicianProfileForm({ initialData }: TechnicianProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialData.displayName || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [whatsappPhone, setWhatsappPhone] = useState(initialData.whatsappPhone || "");
  const [serviceAreaText, setServiceAreaText] = useState(initialData.serviceAreaText || "");
  const [profileImageKey, setProfileImageKey] = useState(initialData.profileImageKey || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    if (!displayName.trim()) {
      setError("Nama tampilan profil wajib diisi.");
      return;
    }
    if (!whatsappPhone.trim()) {
      setError("Nomor WhatsApp wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/technician/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          whatsappPhone,
          serviceAreaText,
          profileImageKey,
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
              Perubahan data profil dan foto Anda telah berhasil diperbarui.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Foto Profil Teknisi (File Upload) */}
      <div className="space-y-2">
        <ImageUpload
          label="Foto Profil Teknisi *"
          description="Unggah foto wajah profesional Anda. Format JPG, PNG, atau WEBP maks 5 MB."
          aspectRatio="square"
          value={profileImageKey}
          onChange={setProfileImageKey}
          onRemove={() => setProfileImageKey("")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="displayName" className="text-xs font-semibold text-slate-700">
            Nama Tampilan Profil *
          </Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Contoh: Joko Supriyanto (Spesialis AC)"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="whatsapp" className="text-xs font-semibold text-slate-700">
            Nomor WhatsApp Konsultasi *
          </Label>
          <Input
            id="whatsapp"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            placeholder="081234567890"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="area" className="text-xs font-semibold text-slate-700">
          Cakupan Area Layanan
        </Label>
        <Input
          id="area"
          value={serviceAreaText}
          onChange={(e) => setServiceAreaText(e.target.value)}
          placeholder="Contoh: Jakarta Selatan, Depok, Cinere, Tangerang Selatan"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio" className="text-xs font-semibold text-slate-700">
          Deskripsi & Pengalaman Kerja (Bio) *
        </Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Jelaskan keahlian teknis Anda, sertifikasi, jumlah tahun pengalaman, dan komitmen layanan..."
          rows={4}
          required
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
