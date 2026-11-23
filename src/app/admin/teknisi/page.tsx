import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { ChevronRight, ShieldCheck, Mail, Phone, MapPin, Wrench } from "lucide-react";
import { TechnicianVerificationButtons } from "./technician-verification-buttons";
import { AdminAddTechnicianDialog } from "./admin-add-technician-dialog";

export const dynamic = "force-dynamic";

export default async function AdminTechniciansPage() {
  await requireRole(["ADMIN"]);

  const technicians = await db.query.technicianProfiles.findMany({
    with: {
      user: {
        with: {
          technicianServices: {
            with: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: [desc(schema.technicianProfiles.createdAt)],
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-medium">Manajemen Teknisi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen & Verifikasi Teknisi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Validasi identitas teknisi, status verifikasi akun, dan kontrol akses operasional marketplace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
            Total Terdaftar: <strong className="text-emerald-600">{technicians.length}</strong>
          </span>
          <AdminAddTechnicianDialog />
        </div>
      </div>

      <div className="space-y-4">
        {technicians.map((t) => (
          <div
            key={t.userId}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm hover:border-slate-300 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                {t.profileImageKey ? (
                  <img
                    src={t.profileImageKey}
                    alt={t.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-lg">
                    {t.displayName[0]}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-base">{t.displayName}</h3>
                  <Badge
                    variant={
                      t.verificationStatus === "VERIFIED"
                        ? "verified"
                        : t.verificationStatus === "SUSPENDED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {t.verificationStatus}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {t.user.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {t.whatsappPhone}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {t.serviceAreaText || "Belum ditentukan"}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="text-slate-400 font-medium">Kategori Keahlian: </span>
                  {t.user.technicianServices.length > 0 ? (
                    t.user.technicianServices.map((s) => s.category.name).join(", ")
                  ) : (
                    <span className="italic text-slate-400">Belum ada listing layanan</span>
                  )}
                </div>

                <div className="pt-0.5">
                  <StarRating
                    rating={Number(t.averageRating) || 0}
                    totalReviews={t.reviewCount}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 w-full md:w-auto shrink-0">
              <TechnicianVerificationButtons
                userId={t.userId}
                currentStatus={t.verificationStatus}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
