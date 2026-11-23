import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getTechnicianOrders } from "@/modules/orders/service";
import { formatRupiah, formatDate } from "@/lib/utils";
import { DollarSign, Percent, TrendingUp, ShieldCheck, ChevronRight, FileText, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

export const dynamic = "force-dynamic";

export default async function TechnicianEarningsPage() {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);
  const orders = await getTechnicianOrders(session.user.id);

  // Paid and completed orders
  const paidOrders = orders.filter((o) =>
    ["PAID", "IN_PROGRESS", "COMPLETED"].includes(o.status)
  );

  const grossCustomerTotal = paidOrders.reduce((sum, o) => sum + o.customerTotal, 0);
  const totalLaborFee = paidOrders.reduce((sum, o) => sum + o.laborFee, 0);
  const totalCommission = paidOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalParts = paidOrders.reduce((sum, o) => sum + o.partsTotal, 0);
  const totalOther = paidOrders.reduce((sum, o) => sum + o.otherCharges, 0);
  const totalTechnicianNet = paidOrders.reduce((sum, o) => sum + o.technicianNet, 0);

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
            <span className="text-slate-600 font-medium">Pendapatan & Akuntansi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Pendapatan & Akuntansi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Transparansi penuh perhitungan bagi hasil komisi platform dan pendapatan bersih Anda
          </p>
        </div>
      </div>

      {/* CoolAdmin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pendapatan Bersih (Net)"
          value={formatRupiah(totalTechnicianNet)}
          subtitle="Hak bersih Anda yang siap dicairkan"
          icon={TrendingUp}
          variant="emerald"
        />
        <StatCard
          title="Total Nilai Transaksi"
          value={formatRupiah(grossCustomerTotal)}
          subtitle={`Dari ${paidOrders.length} transaksi berbayar`}
          icon={DollarSign}
          variant="blue"
        />
        <StatCard
          title="Komisi Platform (25%)"
          value={formatRupiah(totalCommission)}
          subtitle="Dipotong hanya dari biaya jasa servis"
          icon={Percent}
          variant="amber"
        />
        <StatCard
          title="Sparepart & Biaya Lain"
          value={formatRupiah(totalParts + totalOther)}
          subtitle="100% hak teknisi tanpa potongan"
          icon={ShieldCheck}
          variant="purple"
        />
      </div>

      {/* CoolAdmin Itemized Table per Order */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Riwayat Perhitungan Akuntansi per Pesanan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown rinci formula akuntansi setiap transaksi yang telah dibayar
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            {paidOrders.length} Transaksi
          </span>
        </div>

        {paidOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            Belum ada transaksi berbayar untuk dianalisis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Perangkat</th>
                  <th className="py-3 px-4 text-right">Biaya Jasa</th>
                  <th className="py-3 px-4 text-right text-amber-700">Komisi (25%)</th>
                  <th className="py-3 px-4 text-right">Sparepart & Biaya</th>
                  <th className="py-3 px-4 text-right">Total Pelanggan</th>
                  <th className="py-3 px-4 text-right font-bold text-emerald-700">Net Teknisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paidOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      <Link href={`/technician/orders/${o.id}`} className="hover:text-blue-600">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{o.customer.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[130px]">{o.deviceName}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-800">{formatRupiah(o.laborFee)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-700 bg-amber-50/30">
                      -{formatRupiah(o.commissionAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {formatRupiah(o.partsTotal + o.otherCharges)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(o.customerTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700 bg-emerald-50/30">
                      {formatRupiah(o.technicianNet)}
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
