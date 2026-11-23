import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wrench,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { PriceDisplay } from "@/components/shared/price-display";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getServiceById } from "@/modules/catalog/service";
import { DirectOrderButton } from "./direct-order-button";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  const techProfile = service.technician.technicianProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back link */}
      <div>
        <Link
          href={`/kategori/${service.category.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kategori {service.category.name}</span>
        </Link>
      </div>

      <div className="stagger-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Image & Service Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-video w-full rounded-3xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-sm">
            {service.imageKey && (
              <img
                src={service.imageKey}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-slate-800 font-semibold px-3 py-1">
                {service.category.name}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {service.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Kategori: <strong className="text-slate-800">{service.category.name}</strong></span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Garansi Pengerjaan Teknisi
              </span>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Deskripsi & Cakupan Pengerjaan
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            <Alert variant="warning" className="rounded-2xl">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <AlertTitle className="text-amber-950 font-bold mb-1">Ketentuan Harga Layanan</AlertTitle>
                <AlertDescription className="text-amber-900 leading-relaxed text-xs sm:text-sm">
                  Harga yang tercantum adalah <strong className="font-semibold">biaya jasa pengerjaan dasar teknisi</strong>. Apabila diperlukan penggantian komponen sparepart atau ada kendala teknis tambahan, biaya sparepart disepakati terpisah melalui konsultasi WhatsApp sebelum dikerjakan.
                </AlertDescription>
              </div>
            </Alert>
          </div>
        </div>

        {/* Right column: Pricing card, Technician card, Actions */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-slate-200/90 shadow-md overflow-hidden">
            <div className="bg-emerald-600 p-6 text-white space-y-2">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-100">
                Biaya Jasa Dasar (Labor Fee)
              </div>
              <PriceDisplay
                amount={service.laborBasePrice}
                size="xl"
                valueClassName="text-white text-3xl font-extrabold"
              />
              <p className="text-xs text-emerald-100/90 font-medium">
                Hanya jasa pengerjaan, tidak termasuk biaya sparepart.
              </p>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Technician Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  {techProfile?.profileImageKey ? (
                    <img
                      src={techProfile.profileImageKey}
                      alt={techProfile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                      {service.technician.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-xs text-slate-500 font-medium">Disediakan oleh teknisi:</div>
                  <Link
                    href={`/teknisi/${techProfile?.slug || ""}`}
                    className="font-bold text-sm text-slate-900 hover:text-emerald-600 transition-colors block line-clamp-2 leading-snug"
                  >
                    {techProfile?.displayName || service.technician.name}
                  </Link>
                  {techProfile && (
                    <div className="pt-0.5">
                      <StarRating
                        rating={Number(techProfile.averageRating)}
                        totalReviews={techProfile.reviewCount}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {techProfile && (
                  <WhatsAppButton
                    phone={techProfile.whatsappPhone}
                    technicianName={techProfile.displayName}
                    serviceName={service.title}
                    size="lg"
                    className="w-full"
                    text="Konsultasi WhatsApp Dulu"
                  />
                )}

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">atau</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <DirectOrderButton
                  serviceId={service.id}
                  serviceTitle={service.title}
                  basePrice={service.laborBasePrice}
                />
              </div>

              <div className="text-center text-xs text-slate-500 leading-normal">
                Disarankan konsultasi via WhatsApp terlebih dahulu agar teknisi dapat memastikan ketersediaan sparepart dan tingkat kerusakan.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

