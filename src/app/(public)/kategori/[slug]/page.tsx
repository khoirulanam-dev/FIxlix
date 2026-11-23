import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { PriceDisplay } from "@/components/shared/price-display";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { getCategoryBySlug, getServicesByCategory } from "@/modules/catalog/service";
import { getTechnicians } from "@/modules/technicians/service";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [services, technicians] = await Promise.all([
    getServicesByCategory(category.id),
    getTechnicians(category.slug),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/kategori"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Kategori</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-emerald-50/60 border border-emerald-100 rounded-3xl p-6 md:p-8">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="verified">Kategori Layanan</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Servis & Perbaikan {category.name}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 shadow-md">
            {category.imageKey && (
              <img
                src={category.imageKey}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Services List under this category */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Daftar Layanan Jasa {category.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Menampilkan {services.length} pilihan jasa pengerjaan teknisi profesional
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500">
              Belum ada layanan untuk kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const techProfile = service.technician.technicianProfile;
              return (
                <Card key={service.id} className="overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video w-full bg-slate-100">
                      {service.imageKey && (
                        <img
                          src={service.imageKey}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <CardContent className="p-5 space-y-4">
                      <div>
                        <Link href={`/layanan/${service.id}`} className="hover:text-emerald-600">
                          <h3 className="font-bold text-slate-900 text-base leading-snug">
                            {service.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Technician info */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            {techProfile?.profileImageKey ? (
                              <img
                                src={techProfile.profileImageKey}
                                alt={techProfile.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500">
                                {service.technician.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900">
                              {techProfile?.displayName || service.technician.name}
                            </div>
                            {techProfile && (
                              <StarRating
                                rating={Number(techProfile.averageRating)}
                                totalReviews={techProfile.reviewCount}
                                size="sm"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Base Labor Price */}
                      <div className="bg-slate-50 rounded-xl p-3">
                        <PriceDisplay
                          amount={service.laborBasePrice}
                          label="Biaya Jasa Dasar"
                          isBasePrice={true}
                          size="md"
                        />
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    {techProfile && (
                      <WhatsAppButton
                        phone={techProfile.whatsappPhone}
                        technicianName={techProfile.displayName}
                        serviceName={service.title}
                        size="sm"
                        text="Tanya WA"
                      />
                    )}
                    <Link href={`/layanan/${service.id}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-slate-700">
                        Detail Layanan
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Technicians specializing in this category */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Teknisi Spesialis {category.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hubungi teknisi terdekat untuk konsultasi kerusakan dan estimasi pengerjaan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <Card key={tech.userId} className="overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    {tech.profileImageKey ? (
                      <img
                        src={tech.profileImageKey}
                        alt={tech.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                        {tech.displayName[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/teknisi/${tech.slug}`}>
                      <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-600 transition-colors truncate">
                        {tech.displayName}
                      </h3>
                    </Link>
                    <div className="mt-1">
                      <StarRating
                        rating={Number(tech.averageRating)}
                        totalReviews={tech.reviewCount}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {tech.bio}
                </p>

                {tech.serviceAreaText && (
                  <p className="text-[11px] text-slate-500">
                    📍 Area: {tech.serviceAreaText}
                  </p>
                )}
              </CardContent>

              <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                <WhatsAppButton
                  phone={tech.whatsappPhone}
                  technicianName={tech.displayName}
                  size="sm"
                  text="Konsultasi WA"
                />
                <Link href={`/teknisi/${tech.slug}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Profil
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

