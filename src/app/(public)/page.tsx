import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  Search,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { PriceDisplay } from "@/components/shared/price-display";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { getCategories, getFeaturedServices } from "@/modules/catalog/service";
import { getTechnicians } from "@/modules/technicians/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, services, technicians] = await Promise.all([
    getCategories(),
    getFeaturedServices(),
    getTechnicians(),
  ]);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-transparent pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Solusi Servis Elektronik Rumah Tangga Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Perbaiki Peralatan Elektronik Rumah Tangga Jadi Lebih Mudah.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Temukan teknisi ahli untuk Rice Cooker, Kipas Angin, TV, AC, dan Kulkas. Konsultasi langsung via WhatsApp, kesepakatan harga transparan tanpa biaya tersembunyi.
              </p>

              {/* Quick Search Box */}
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 max-w-xl">
                <form action="/teknisi" method="GET" className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full flex items-center pl-3">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Cari perbaikan AC, TV mati, kipas angin..."
                      className="w-full pl-8 pr-4 py-2.5 text-sm outline-none text-slate-800 placeholder:text-slate-400 bg-transparent"
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl">
                    Cari Teknisi
                  </Button>
                </form>
              </div>

              {/* Value propositions */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Teknisi Berpengalaman & Terverifikasi</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Respon Cepat via WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rincian Biaya Transparan</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual illustration card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 shadow-2xl">
                <div className="rounded-[14px] bg-slate-900 overflow-hidden text-white p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Fixlix Service Guarantee</div>
                        <div className="text-xs text-slate-400">Transparansi Tanpa Mark-up</div>
                      </div>
                    </div>
                    <Badge variant="verified">100% Aman</Badge>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                      <span className="text-slate-400">Biaya Jasa Servis</span>
                      <span className="font-semibold text-emerald-400">Sesuai Kesepakatan</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                      <span className="text-slate-400">Sparepart Tambahan</span>
                      <span className="font-semibold text-white">Transparan & Disetujui</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400">Persetujuan Pelanggan</span>
                      <span className="font-semibold text-white">Wajib Sebelum Bayar</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-800/80 p-4 flex items-center gap-3">
                    <MessageCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                    <p className="text-xs text-slate-300">
                      Pelanggan berkonsultasi langsung melalui WhatsApp untuk memastikan kendala dan estimasi pengerjaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Kategori Layanan Utama
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Pilih kategori peralatan rumah tangga yang membutuhkan perbaikan
            </p>
          </div>
          <Link
            href="/kategori"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Lihat Semua Kategori <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="group block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-emerald-300 hover-lift"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                {cat.imageKey && (
                  <img
                    src={cat.imageKey}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Layanan Populer
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Daftar jasa perbaikan paling sering dipesan dengan harga dasar transparan
            </p>
          </div>
          <Link
            href="/kategori"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Jelajahi Semua Layanan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const techProfile = service.technician.technicianProfile;
            return (
              <Card key={service.id} className="overflow-hidden hover-lift flex flex-col justify-between">
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
      </section>

      {/* Verified Technicians Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Teknisi Ahli Terverifikasi
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Konsultasikan kendala barang elektronik Anda langsung kepada ahlinya
            </p>
          </div>
          <Link
            href="/teknisi"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Lihat Semua Teknisi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <Card key={tech.userId} className="overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link href={`/teknisi/${tech.slug}`}>
                        <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-600 transition-colors truncate">
                          {tech.displayName}
                        </h3>
                      </Link>
                      <Badge variant="verified" className="text-xs px-2 py-0.5">
                        Terverifikasi
                      </Badge>
                    </div>

                    <div className="mt-1">
                      <StarRating
                        rating={Number(tech.averageRating)}
                        totalReviews={tech.reviewCount}
                        size="sm"
                      />
                    </div>

                    {tech.serviceAreaText && (
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        📍 {tech.serviceAreaText}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {tech.bio}
                </p>

                {/* Specialties tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tech.user.technicianServices.map((srv) => (
                    <span
                      key={srv.id}
                      className="inline-block text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      {srv.category.name}
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
                  <Button variant="outline" size="sm" className="w-full">
                    Lihat Profil
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cara Kerja Fixlix
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Proses mudah dan transparan dari awal konsultasi hingga pengerjaan selesai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                1
              </div>
              <h3 className="font-bold text-base text-white">Cari Layanan & Teknisi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilih kategori peralatan rumah tangga Anda dan lihat profil teknisi berpengalaman di area Anda.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                2
              </div>
              <h3 className="font-bold text-base text-white">Konsultasi via WhatsApp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jelaskan gejala kerusakan barang Anda langsung kepada teknisi secara gratis dan sepakati estimasi biaya perbaikan.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                3
              </div>
              <h3 className="font-bold text-base text-white">Tinjau & Setujui Order</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Teknisi membuat rincian order di Fixlix. Anda meninjau rincian biaya sebelum menyetujui dan melakukan pembayaran.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                4
              </div>
              <h3 className="font-bold text-base text-white">Pengerjaan & Ulasan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Teknisi memperbaiki perangkat hingga tuntas. Setelah selesai, berikan ulasan nyata untuk pengalaman Anda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

