import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { PlusCircle, Wrench, ChevronRight, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TechnicianCatalogPage() {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);

  const services = await db.query.technicianServices.findMany({
    where: eq(schema.technicianServices.technicianId, session.user.id),
    with: {
      category: true,
    },
    orderBy: [desc(schema.technicianServices.createdAt)],
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Link href="/technician" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-medium">Katalog Layanan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Katalog Layanan Saya
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola jenis perbaikan elektronik yang Anda tawarkan dengan biaya jasa dasar transparan
          </p>
        </div>

        <Link href="/technician/layanan/tambah">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Layanan Baru</span>
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Belum Ada Layanan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Anda belum mendaftarkan layanan spesialisasi perbaikan pada katalog Anda.
            </p>
          </div>
          <Link href="/technician/layanan/tambah">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl">
              Tambah Layanan Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-100 border-b border-slate-100">
                  {srv.imageKey ? (
                    <img
                      src={srv.imageKey}
                      alt={srv.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Wrench className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs">
                    {srv.category.name}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Biaya Jasa Dasar</div>
                  <div className="text-base font-extrabold text-blue-600 font-mono">
                    {formatRupiah(srv.laborBasePrice)}
                  </div>
                </div>

                <Link href={`/layanan/${srv.id}`} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Listing</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
