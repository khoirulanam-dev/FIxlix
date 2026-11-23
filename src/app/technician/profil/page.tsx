import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronRight, User } from "lucide-react";
import { TechnicianProfileForm } from "./technician-profile-form";

export const dynamic = "force-dynamic";

export default async function TechnicianProfilePage() {
  const session = await requireRole(["TECHNICIAN"]);

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.user.id),
    with: {
      technicianProfile: true,
    },
  });

  const profile = user?.technicianProfile;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <Link href="/technician" className="hover:text-emerald-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-medium">Profil & Akun</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profil Teknisi
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola informasi identitas, foto profil profesional, dan kontak WhatsApp layanan Anda
        </p>
      </div>

      <TechnicianProfileForm
        initialData={{
          displayName: profile?.displayName || user?.name || "",
          bio: profile?.bio || "",
          whatsappPhone: profile?.whatsappPhone || user?.phone || "",
          serviceAreaText: profile?.serviceAreaText || "",
          profileImageKey: profile?.profileImageKey || user?.image || "",
          email: user?.email || "",
        }}
      />
    </div>
  );
}

