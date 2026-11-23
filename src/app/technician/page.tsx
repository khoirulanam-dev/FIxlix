import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getTechnicianOrders } from "@/modules/orders/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { StatCard } from "@/components/shared/stat-card";
import {
  Clock,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Percent,
  Wrench,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TechnicianDashboardPage() {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);
  const orders = await getTechnicianOrders(session.user.id);

  // Status counts
  const pendingApproval = orders.filter((o) => o.status === "PENDING_CUSTOMER_APPROVAL");
  const awaitingPayment = orders.filter((o) => o.status === "AWAITING_PAYMENT");
  const inProgress = orders.filter((o) => ["PAID", "IN_PROGRESS"].includes(o.status));
  const completed = orders.filter((o) => o.status === "COMPLETED");

  // Accounting aggregates from paid/completed orders
  const paidOrders = orders.filter((o) => ["PAID", "IN_PROGRESS", "COMPLETED"].includes(o.status));
  const grossCustomerTotal = paidOrders.reduce((sum, o) => sum + o.customerTotal, 0);
  const totalLaborFee = paidOrders.reduce((sum, o) => sum + o.laborFee, 0);
  const totalCommission = paidOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalTechnicianNet = paidOrders.reduce((sum, o) => sum + o.technicianNet, 0);

  return (
    <div className="space-y-8">
      {/* CoolAdmin Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Fixlix</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-semibold">Teknisi</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 font-semibold">Dashboard Operasional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Teknisi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Selamat datang, <strong className="text-slate-800">{session.user.name}</strong>. Kelola pesanan pengerjaan dan pantau penerimaan pendapatan bersih.
          </p>
        </div>

        <Link href="/technician/orders/baru">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl shadow-sm text-xs">
            <PlusCircle className="w-4 h-4" />
            <span>Buat Custom Order</span>
          </Button>
        </Link>
      </div>

      {/* CoolAdmin 4-Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pendapatan Bersih (Net)"
          value={formatRupiah(totalTechnicianNet)}
          subtitle="Hak teknisi setelah komisi 25%"
          icon={TrendingUp}
          variant="emerald"
        />
        <StatCard
          title="Total Nilai Transaksi (GMV)"
          value={formatRupiah(grossCustomerTotal)}
          subtitle="Dari pesanan berbayar / tuntas"
          icon={DollarSign}
          variant="blue"
        />
        <StatCard
          title="Sedang Dikerjakan"
          value={inProgress.length}
          subtitle="Status PAID & IN_PROGRESS"
          icon={Wrench}
          variant="purple"
        />
        <StatCard
          title="Pesanan Selesai"
          value={completed.length}
          subtitle={`${orders.length} total pesanan masuk`}
          icon={CheckCircle2}
          variant="amber"
        />
      </div>

      {/* Accounting Breakdown Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Rekapitulasi Akuntansi Komisi Platform
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              Komisi 25% Hanya Berlaku Pada Biaya Jasa Servis
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sparepart dan biaya tambahan operasional 100% diteruskan ke teknisi tanpa potongan.
            </p>
          </div>
          <Link href="/technician/pendapatan">
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 text-xs rounded-xl">
              Lihat Detail Buku Kas <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/60">
            <div className="text-slate-400 mb-1">Total Jasa Servis:</div>
            <div className="text-base font-extrabold text-emerald-400 font-mono">{formatRupiah(totalLaborFee)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Basis pemotongan komisi</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/60">
            <div className="text-slate-400 mb-1">Total Komisi Platform:</div>
            <div className="text-base font-extrabold text-amber-400 font-mono">- {formatRupiah(totalCommission)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">25% dari biaya jasa</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/60">
            <div className="text-slate-400 mb-1">Total Sparepart:</div>
            <div className="text-base font-extrabold text-white font-mono">{formatRupiah(paidOrders.reduce((s, o) => s + o.partsTotal, 0))}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">0% komisi platform</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/60">
            <div className="text-slate-400 mb-1">Estimasi Net Teknisi:</div>
            <div className="text-base font-extrabold text-emerald-300 font-mono">{formatRupiah(totalTechnicianNet)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sudah dibayar / selesai</div>
          </div>
        </div>
      </div>

      {/* Orders Table CoolAdmin Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Pesanan Masuk Terbaru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Pesanan perbaikan yang ditugaskan kepada Anda</p>
          </div>
          <Link
            href="/technician/orders"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-slate-500">Belum ada pesanan yang terdaftar.</p>
            <Link href="/technician/orders/baru">
              <Button size="sm" className="bg-emerald-600 text-white font-bold rounded-xl">
                Buat Custom Order Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">No. Pesanan</th>
                  <th className="py-3.5 px-6">Pelanggan</th>
                  <th className="py-3.5 px-6">Perangkat & Kategori</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Total Pelanggan</th>
                  <th className="py-3.5 px-6 text-right">Net Teknisi</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                      <div className="text-[10px] text-slate-400 font-normal">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{order.customer.name}</div>
                      <div className="text-[11px] text-slate-500">{order.customer.phone || order.customer.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{order.deviceName}</div>
                      <div className="text-[11px] text-slate-400">{order.category.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getOrderStatusVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-slate-700">
                      {formatRupiah(order.customerTotal)}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-extrabold text-emerald-700">
                      {formatRupiah(order.technicianNet)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href={`/technician/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                          Kelola
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
