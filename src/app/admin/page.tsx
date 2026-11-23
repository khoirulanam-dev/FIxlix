import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getAdminMetrics } from "@/modules/admin/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import {
  DollarSign,
  Percent,
  TrendingUp,
  Users,
  ShieldCheck,
  Layers,
  ArrowRight,
  ChevronRight,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"]);
  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8">
      {/* CoolAdmin Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Fixlix</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-semibold">Admin Panel</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-purple-600 font-semibold">Executive Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Executive Management Accounting Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analisis arus kas marketplace, pendapatan komisi platform, hak bersih teknisi, dan performa kategori.
          </p>
        </div>

        <Link href="/admin/komisi">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 text-xs rounded-xl shadow-sm">
            <Percent className="w-4 h-4 text-emerald-400" />
            <span>Pengaturan Tarif Komisi</span>
          </Button>
        </Link>
      </div>

      {/* CoolAdmin 4-Card Accounting Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Gross Merchandise Value"
          value={formatRupiah(metrics.totalGrossRevenue)}
          subtitle="Total nilai transaksi pelanggan"
          icon={DollarSign}
          variant="blue"
        />
        <StatCard
          title="Pendapatan Komisi Platform"
          value={formatRupiah(metrics.totalPlatformCommission)}
          subtitle={`Komisi ${(metrics.currentCommissionRate * 100).toFixed(0)}% dari jasa`}
          icon={Percent}
          variant="emerald"
        />
        <StatCard
          title="Net Hak Teknisi"
          value={formatRupiah(metrics.totalTechnicianNet)}
          subtitle="Setelah dipotong komisi platform"
          icon={TrendingUp}
          variant="purple"
        />
        <StatCard
          title="Sparepart & Operasional"
          value={formatRupiah(metrics.totalParts + metrics.totalOtherCharges)}
          subtitle="100% pass-through (0% komisi)"
          icon={Layers}
          variant="amber"
        />
      </div>

      {/* Operational Volumes KPI Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pesanan</div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">{metrics.totalOrdersCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">{metrics.completedOrdersCount} selesai dikerjakan</div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pesanan Aktif</div>
          <div className="text-xl font-black text-emerald-600 mt-1 font-mono">{metrics.activeOrdersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sedang diproses / dikerjakan</div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Teknisi Terverifikasi</div>
          <div className="text-xl font-black text-emerald-600 mt-1 font-mono">
            {metrics.verifiedTechniciansCount} / {metrics.totalTechniciansCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Status verifikasi aktif</div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pelanggan Terdaftar</div>
          <div className="text-xl font-black text-slate-900 mt-1 font-mono">{metrics.totalCustomersCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Akun pelanggan aktif</div>
        </div>
      </div>

      {/* Category Breakdown CoolAdmin Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Analisis Performa per Kategori Layanan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Volume transaksi dan kontribusi komisi berdasarkan 5 kategori peralatan rumah tangga
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">Kategori Peralatan</th>
                <th className="py-3.5 px-6 text-center">Jumlah Pesanan</th>
                <th className="py-3.5 px-6 text-right">Volume Transaksi (GMV)</th>
                <th className="py-3.5 px-6 text-right font-bold text-emerald-700">Komisi Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {metrics.categoryStats.map((c) => (
                <tr key={c.categoryId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">{c.categoryName}</td>
                  <td className="py-4 px-6 text-center text-slate-700 font-semibold">{c.totalOrders} Pesanan</td>
                  <td className="py-4 px-6 text-right font-mono text-slate-800">{formatRupiah(c.volume)}</td>
                  <td className="py-4 px-6 text-right font-mono font-extrabold text-emerald-700 bg-emerald-50/40">
                    {formatRupiah(c.commission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technician Financial Summary CoolAdmin Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Rekapitulasi Keuangan per Teknisi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Omzet pengerjaan, potongan komisi platform, dan total pendapatan bersih teknisi
            </p>
          </div>
          <Link href="/admin/teknisi">
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
              Kelola Verifikasi Teknisi
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-6">Nama Teknisi</th>
                <th className="py-3.5 px-6">Status Verifikasi</th>
                <th className="py-3.5 px-6 text-center">Pesanan Selesai</th>
                <th className="py-3.5 px-6 text-right">Nilai Transaksi</th>
                <th className="py-3.5 px-6 text-right">Komisi Platform</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">Net Teknisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {metrics.technicianStats.map((t) => (
                <tr key={t.userId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{t.name}</td>
                  <td className="py-4 px-6">
                    <Badge variant={t.verificationStatus === "VERIFIED" ? "verified" : "secondary"}>
                      {t.verificationStatus}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-center text-slate-700 font-semibold">
                    {t.completedOrders} dari {t.totalOrders}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-slate-800">{formatRupiah(t.gross)}</td>
                  <td className="py-4 px-6 text-right font-mono text-amber-700">{formatRupiah(t.commission)}</td>
                  <td className="py-4 px-6 text-right font-mono font-extrabold text-emerald-700 bg-emerald-50/40">
                    {formatRupiah(t.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
