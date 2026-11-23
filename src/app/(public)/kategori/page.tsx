import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { getCategories } from "@/modules/catalog/service";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
          <Layers className="w-3.5 h-3.5" />
          <span>Katalog Layanan</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kategori Servis Elektronik
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Pilih kategori peralatan rumah tangga untuk menemukan layanan reparasi dan teknisi spesialis terbaik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            className="group block rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
          >
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
              {cat.imageKey && (
                <img
                  src={cat.imageKey}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-emerald-600 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

