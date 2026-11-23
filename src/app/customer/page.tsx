import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getCustomerOrders } from "@/modules/orders/service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { StatCard } from "@/components/shared/stat-card";
import {
  Clock,
  CreditCard,
  Wrench,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Star,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  const session = await requireRole(["CUSTOMER", "ADMIN"]);
  const orders = await getCustomerOrders(session.user.id);

  // Status metrics
  const pendingApproval = orders.filter((o) => o.status === "PENDING_CUSTOMER_APPROVAL");
  const awaitingPayment = orders.filter((o) => o.status === "AWAITING_PAYMENT");
  const inProgress = orders.filter((o) => ["PAID", "IN_PROGRESS"].includes(o.status));
  const completed = orders.filter((o) => o.status === "COMPLETED");
  const needsReview = completed.filter((o) => !o.review);

  return (
    <div className="space-y-8">
      {/* CoolAdmin Breadcrumb & Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Fixlix</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-semibold">Pelanggan</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 font-semibold">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Selamat datang kembali, <strong className="text-slate-800">{session.user.name}</strong>. Pantau tahapan perbaikan alat elektronik Anda.
          </p>
        </div>

        <Link href="/kategori">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 rounded-xl shadow-sm">
            <ShoppingBag className="w-4 h-4" />
            <span>Pesan Layanan Baru</span>
          </Button>
        </Link>
      </div>

      {/* Action Alerts */}
      {pendingApproval.length > 0 && (
        <div className="rounded-3xl bg-amber-50/90 border border-amber-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-sm">
                Ada {pendingApproval.length} pesanan baru menunggu persetujuan Anda
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Teknisi telah menerbitkan rincian biaya. Silakan tinjau dan setujui untuk melanjutkan pengerjaan.
              </p>
            </div>
          </div>
          <Link href={`/customer/orders/${pendingApproval[0].id}`}>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 rounded-xl font-bold">
              Tinjau Sekarang
            </Button>
          </Link>
        </div>
      )}

      {awaitingPayment.length > 0 && (
        <div className="rounded-3xl bg-emerald-50/90 border border-emerald-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">
                Ada {awaitingPayment.length} pesanan siap untuk dibayar
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Selesaikan pembayaran digital agar teknisi dapat segera memulai perbaikan.
              </p>
            </div>
          </div>
          <Link href={`/customer/orders/${awaitingPayment[0].id}/bayar`}>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 rounded-xl font-bold">
              Bayar Sekarang
            </Button>
          </Link>
        </div>
      )}

      {needsReview.length > 0 && (
        <div className="rounded-3xl bg-emerald-50/90 border border-emerald-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">
                Perbaikan {needsReview[0].deviceName} telah selesai!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Berikan ulasan dan rating kepuasan Anda untuk mendukung teknisi kami.
              </p>
            </div>
          </div>
          <Link href={`/customer/orders/${needsReview[0].id}/review`}>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 rounded-xl font-bold">
              Beri Ulasan
            </Button>
          </Link>
        </div>
      )}

      {/* CoolAdmin 4-Card Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Menunggu Persetujuan"
          value={pendingApproval.length}
          subtitle="Order menanti review rincian"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Menunggu Pembayaran"
          value={awaitingPayment.length}
          subtitle="Siap checkout simulasi"
          icon={CreditCard}
          variant="blue"
        />
        <StatCard
          title="Dalam Pengerjaan"
          value={inProgress.length}
          subtitle="Sedang diservis teknisi"
          icon={Wrench}
          variant="purple"
        />
        <StatCard
          title="Servis Selesai"
          value={completed.length}
          subtitle="Pengerjaan tuntas"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Recent Orders CoolAdmin Table Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Pesanan Servis Terbaru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar perbaikan perangkat aktif Anda</p>
          </div>
          <Link
            href="/customer/orders"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-slate-500">Anda belum memiliki riwayat pesanan.</p>
            <Link href="/kategori">
              <Button size="sm" className="bg-emerald-600 text-white font-bold rounded-xl">
                Cari Layanan Servis
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">No. Pesanan</th>
                  <th className="py-3.5 px-6">Perangkat</th>
                  <th className="py-3.5 px-6">Teknisi & Kategori</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Total Biaya</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                      <div className="text-xs text-slate-500 font-normal">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{order.deviceName}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{order.description}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="font-semibold text-slate-800">{order.technician.technicianProfile?.displayName || order.technician.name}</div>
                      <div className="text-xs text-slate-500">{order.category.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getOrderStatusVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-extrabold text-slate-900 text-sm">
                      {formatRupiah(order.customerTotal)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/customer/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
