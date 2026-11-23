import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { CustomerProfileForm } from "./customer-profile-form";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage() {
  const session = await requireRole(["CUSTOMER", "ADMIN"]);

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <Link href="/customer" className="hover:text-emerald-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-medium">Profil & Akun</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profil Pelanggan
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola foto avatar, nama lengkap, dan nomor kontak akun Fixlix Anda
        </p>
      </div>

      <CustomerProfileForm
        initialData={{
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          image: user?.image || "",
        }}
      />
    </div>
  );
}
