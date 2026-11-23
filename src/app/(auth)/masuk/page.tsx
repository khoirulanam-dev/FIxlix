"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        throw new Error(res.error.message || "Email atau kata sandi tidak valid.");
      }

      // Automatically redirect to role-specific dashboard instead of homepage
      const userRole = (res.data?.user as any)?.role;
      const dashboardUrl =
        userRole === "ADMIN"
          ? "/admin"
          : userRole === "TECHNICIAN"
          ? "/technician"
          : "/customer";

      // If a specific non-root path was explicitly requested, redirect there; otherwise always default to dashboard
      const targetUrl = redirectParam && redirectParam !== "/" ? redirectParam : dashboardUrl;

      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal masuk ke akun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Masuk ke Akun
        </h2>
        <p className="text-xs text-slate-500">
          Masukkan email dan kata sandi Anda untuk melanjutkan
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Kata Sandi</Label>
          </div>
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
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>

      {/* Helper seed logins reminder for testing */}
      <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="font-semibold text-slate-800">Akun Pengujian Cepat:</div>
        <div>• Pelanggan: <code>budi.santoso@gmail.com</code> / <code>Fixlix123!</code></div>
        <div>• Teknisi: <code>joko.teknisi@fixlix.co.id</code> / <code>Fixlix123!</code></div>
        <div>• Admin: <code>admin@fixlix.co.id</code> / <code>AdminFixlix123!</code></div>
      </div>

      <div className="text-center text-xs text-slate-600">
        Belum punya akun?{" "}
        <Link href="/daftar" className="text-emerald-600 font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-xs text-slate-400">Memuat form login...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
