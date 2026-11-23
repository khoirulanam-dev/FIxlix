"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      } as any);

      if (res.error) {
        throw new Error(res.error.message || "Gagal membuat akun.");
      }

      router.push("/customer");
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
          Buat akun pelanggan untuk memesan jasa servis dan memantau pesanan
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="phone">Nomor WhatsApp</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081234567890"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Kata Sandi (Min. 8 karakter)</Label>
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
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Mendaftar...
            </>
          ) : (
            "Daftar Sekarang"
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

