import React from "react";
import Link from "next/link";
import { Search, Filter, ShieldCheck, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { getTechnicians } from "@/modules/technicians/service";
import { getCategories } from "@/modules/catalog/service";
import { TechnicianSearchFilter } from "./technician-search-filter";

export const dynamic = "force-dynamic";

export default async function TechniciansPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const [allTechnicians, categories] = await Promise.all([
    getTechnicians(category),
    getCategories(),
  ]);

  const filteredTechnicians = allTechnicians.filter((t) => {
    if (!q) return true;
    const query = q.toLowerCase();
    return (
      t.displayName.toLowerCase().includes(query) ||
      t.bio.toLowerCase().includes(query) ||
      (t.serviceAreaText && t.serviceAreaText.toLowerCase().includes(query)) ||
      t.user.technicianServices.some((s) =>
        s.title.toLowerCase().includes(query) || s.category.name.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Daftar Teknisi Terverifikasi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Temukan teknisi profesional berpengalaman di dekat Anda dan konsultasikan langsung melalui WhatsApp.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <TechnicianSearchFilter
        initialQuery={q}
        initialCategory={category}
        categories={categories}
      />

      {/* Technicians Grid */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500 font-medium">
          Ditemukan {filteredTechnicians.length} teknisi siap melayani
        </div>

        {filteredTechnicians.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500">
              Tidak ada teknisi yang sesuai dengan kriteria pencarian Anda.
            </p>
            <Link href="/teknisi" className="mt-3 inline-block">
              <Button variant="outline" size="sm">
                Reset Pencarian
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((tech) => (
              <Card key={tech.userId} className="overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {tech.profileImageKey ? (
                        <img
                          src={tech.profileImageKey}
                          alt={tech.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-lg">
                          {tech.displayName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/teknisi/${tech.slug}`}>
                          <h3 className="font-bold text-slate-900 text-base hover:text-emerald-600 transition-colors truncate">
                            {tech.displayName}
                          </h3>
                        </Link>
                      </div>

                      <div className="mt-1">
                        <StarRating
                          rating={Number(tech.averageRating)}
                          totalReviews={tech.reviewCount}
                          size="sm"
                        />
                      </div>

                      {tech.serviceAreaText && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{tech.serviceAreaText}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {tech.bio}
                  </p>

                  {/* Specialties */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {tech.user.technicianServices.map((s) => (
                      <span
                        key={s.id}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800"
                      >
                        {s.category.name}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                  <WhatsAppButton
                    phone={tech.whatsappPhone}
                    technicianName={tech.displayName}
                    size="sm"
                    text="Konsultasi WA"
                  />
                  <Link href={`/teknisi/${tech.slug}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-slate-700">
                      Lihat Profil
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

