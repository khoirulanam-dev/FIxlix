"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth/auth-client";
import { Loader2, User, Wrench, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"CUSTOMER" | "TECHNICIAN">("CUSTOMER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceAreaText, setServiceAreaText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
        phone,
        role,
      } as any);

      if (res.error) {
        throw new Error(res.error.message || "Gagal membuat akun.");
      }

      // Jika mendaftar sebagai teknisi, pastikan profil teknisi dibuat
      if (role === "TECHNICIAN") {
        try {
          await fetch("/api/technician/init-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              displayName: name,
              whatsappPhone: phone,
              serviceAreaText,
            }),
          });
        } catch (e) {
          console.warn("Init profile non-critical error:", e);
        }

        router.push("/technician");
      } else {
        router.push("/customer");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Daftar Akun Fixlix
        </h2>
        <p className="text-xs text-slate-500">
          Pilih jenis akun yang ingin Anda daftarkan di platform Fixlix
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setRole("CUSTOMER")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all text-center ${
            role === "CUSTOMER"
              ? "bg-white text-emerald-800 shadow-sm font-bold border border-emerald-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <User className={`w-4 h-4 ${role === "CUSTOMER" ? "text-emerald-600" : "text-slate-400"}`} />
            <span className="text-xs sm:text-sm">Pelanggan</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Pesan & servis alat</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("TECHNICIAN")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all text-center ${
            role === "TECHNICIAN"
              ? "bg-white text-emerald-800 shadow-sm font-bold border border-emerald-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <Wrench className={`w-4 h-4 ${role === "TECHNICIAN" ? "text-emerald-600" : "text-slate-400"}`} />
            <span className="text-xs sm:text-sm">Mitra Teknisi</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">Tawarkan jasa & keahlian</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            {role === "TECHNICIAN" ? "Nama Lengkap / Nama Usaha *" : "Nama Lengkap *"}
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === "TECHNICIAN" ? "Contoh: Hendra Wijaya (Spesialis AC)" : "Contoh: Budi Santoso"}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="budi@example.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Nomor WhatsApp *</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081234567890"
            required
          />
        </div>

        {role === "TECHNICIAN" && (
          <div className="space-y-1.5">
            <Label htmlFor="serviceArea">Cakupan Area Layanan</Label>
            <Input
              id="serviceArea"
              value={serviceAreaText}
              onChange={(e) => setServiceAreaText(e.target.value)}
              placeholder="Contoh: Jakarta Selatan, Depok, Cinere"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="password">Kata Sandi (Min. 8 karakter) *</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 rounded-xl shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Mendaftarkan Akun...
            </>
          ) : role === "TECHNICIAN" ? (
            "Daftar Sebagai Mitra Teknisi"
          ) : (
            "Daftar Sebagai Pelanggan"
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-slate-600">
        Sudah memiliki akun?{" "}
        <Link href="/masuk" className="text-emerald-600 font-semibold hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
