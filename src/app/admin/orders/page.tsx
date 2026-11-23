import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { ChevronRight, Wrench, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireRole(["ADMIN"]);

  const orders = await db.query.orders.findMany({
    with: {
      customer: true,
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
      payment: true,
    },
    orderBy: [desc(schema.orders.createdAt)],
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-medium">Semua Pesanan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ledger Transaksi & Pesanan
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit pelacakan pesanan menyeluruh, status pengerjaan, dan audit snapshot komisi
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
          Total Transaksi: <strong className="text-blue-600">{orders.length}</strong>
        </span>
      </div>

      {/* CoolAdmin Table Container */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Daftar Seluruh Pesanan Platform
          </h2>
          <span className="text-xs text-slate-400">Diperbarui realtime</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">No. Order</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Teknisi</th>
                <th className="py-3 px-4">Perangkat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Biaya Jasa</th>
                <th className="py-3 px-4 text-right text-amber-700">Komisi Platform</th>
                <th className="py-3 px-4 text-right font-bold text-slate-900">Total Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {o.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5 px-4 text-slate-800">{o.customer.name}</td>
                  <td className="py-3.5 px-4 text-slate-800">
                    {o.technician.technicianProfile?.displayName || o.technician.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 truncate max-w-[120px]">{o.deviceName}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getOrderStatusVariant(o.status)}>
                      {getOrderStatusLabel(o.status)}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-800">{formatRupiah(o.laborFee)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-amber-700 bg-amber-50/30">
                    {formatRupiah(o.commissionAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-blue-600">
                    {formatRupiah(o.customerTotal)}
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
