import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { formatDate } from "@/lib/utils";
import { getTechnicianBySlug } from "@/modules/technicians/service";

export const dynamic = "force-dynamic";

export default async function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const technician = await getTechnicianBySlug(slug);

  if (!technician) {
    notFound();
  }

  const services = technician.user.technicianServices;
  const reviews = technician.reviews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/teknisi"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Teknisi</span>
        </Link>
      </div>

      {/* Technician Profile Card Header */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-sm">
              {technician.profileImageKey ? (
                <img
                  src={technician.profileImageKey}
                  alt={technician.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-400">
                  {technician.displayName[0]}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {technician.displayName}
                </h1>
                {technician.verificationStatus === "VERIFIED" && (
                  <Badge variant="verified" className="text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Teknisi Terverifikasi
                  </Badge>
                )}
              </div>

              <div>
                <StarRating
                  rating={Number(technician.averageRating)}
                  totalReviews={technician.reviewCount}
                  size="md"
                />
              </div>

              {technician.serviceAreaText && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Area Layanan: {technician.serviceAreaText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action WhatsApp */}
          <div className="w-full md:w-auto shrink-0">
            <WhatsAppButton
              phone={technician.whatsappPhone}
              technicianName={technician.displayName}
              size="lg"
              className="w-full md:w-auto shadow-md"
              text="Konsultasi via WhatsApp"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Tentang Teknisi
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            {technician.bio}
          </p>
        </div>
      </div>

      {/* Catalog Section - LOCKED RULE: NO PRICES ON TECHNICIAN PROFILE CATALOG TILES */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">
            Katalog Layanan Pengerjaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar jenis perbaikan yang ditangani oleh {technician.displayName}. Konsultasikan melalui WhatsApp untuk kesepakatan harga akhir.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500">
              Belum ada katalog layanan yang didaftarkan teknisi ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
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
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-800 font-medium">
                        {service.category.name}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </div>

                {/* Profile tiles do NOT show price, customer views service detail or consults */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <WhatsAppButton
                    phone={technician.whatsappPhone}
                    technicianName={technician.displayName}
                    serviceName={service.title}
                    size="sm"
                    text="Tanya WA"
                  />
                  <Link href={`/layanan/${service.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-slate-700">
                      Lihat Layanan
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Verified Reviews Section */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Ulasan Pelanggan ({reviews.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ulasan terverifikasi dari pesanan yang telah selesai dikerjakan
            </p>
          </div>
          <div>
            <StarRating
              rating={Number(technician.averageRating)}
              totalReviews={technician.reviewCount}
              size="md"
            />
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500">
              Belum ada ulasan untuk teknisi ini. Jadilah yang pertama memberikan ulasan setelah pengerjaan selesai!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {rev.customer.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {rev.customer.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDate(rev.createdAt)}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" showCount={false} />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

