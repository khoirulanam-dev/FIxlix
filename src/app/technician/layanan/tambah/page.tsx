import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { AddServiceForm } from "./add-service-form";

export const dynamic = "force-dynamic";

export default async function AddTechnicianServicePage() {
  await requireRole(["TECHNICIAN", "ADMIN"]);

  const categories = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.isActive, true));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/technician/layanan"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Layanan</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tambah Layanan Servis Baru
        </h1>
        <p className="text-sm text-slate-500">
          Daftarkan jenis pengerjaan elektronik baru yang siap Anda kerjakan
        </p>
      </div>

      <AddServiceForm categories={categories} />
    </div>
  );
}

