"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, X, Loader2, CheckCircle2 } from "lucide-react";

export function AdminAddTechnicianDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [serviceAreaText, setServiceAreaText] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    setError(null);
    setSuccess(false);
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/technicians/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          serviceAreaText,
          bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal membuat akun teknisi.");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        setOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setServiceAreaText("");
        setBio("");
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Gagal membuat akun teknisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm gap-2"
      >
        <UserPlus className="w-4 h-4" />
        <span>+ Tambah Teknisi Baru</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          {/* Backdrop transparan tanpa efek gelap, klik di luar untuk menutup */}
          <div
            className="fixed inset-0 bg-transparent"
            onClick={handleClose}
          />
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-7 space-y-5 relative z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Tambah Akun Teknisi Baru
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Admin dapat mendaftarkan mitra teknisi baru dengan status langsung Terverifikasi.
              </p>
            </div>

            {success && (
              <Alert variant="success" className="rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <AlertDescription className="text-xs text-emerald-800 font-semibold">
                  Akun teknisi baru berhasil dibuat dan diverifikasi!
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tech-name" className="text-xs font-semibold text-slate-700">
                  Nama Lengkap / Nama Usaha *
                </Label>
                <Input
                  id="tech-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rudi Hartono (Spesialis Kulkas & AC)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tech-email" className="text-xs font-semibold text-slate-700">
                    Email Login *
                  </Label>
                  <Input
                    id="tech-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rudi.teknisi@fixlix.co.id"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tech-phone" className="text-xs font-semibold text-slate-700">
                    Nomor WhatsApp *
                  </Label>
                  <Input
                    id="tech-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081298765432"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tech-area" className="text-xs font-semibold text-slate-700">
                  Cakupan Area Layanan
                </Label>
                <Input
                  id="tech-area"
                  value={serviceAreaText}
                  onChange={(e) => setServiceAreaText(e.target.value)}
                  placeholder="Contoh: Jakarta Barat, Tangerang Kota, Ciledug"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tech-bio" className="text-xs font-semibold text-slate-700">
                  Bio / Pengalaman Kerja Singkat
                </Label>
                <Textarea
                  id="tech-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Pengalaman lebih dari 5 tahun menangani perbaikan kulkas inverter dan AC..."
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tech-pwd" className="text-xs font-semibold text-slate-700">
                  Kata Sandi Login *
                </Label>
                <Input
                  id="tech-pwd"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi (min. 8 karakter)"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="rounded-xl text-xs h-10 px-4"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan & Buat Akun"
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

