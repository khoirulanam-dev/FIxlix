import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { ChevronRight, CreditCard, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  await requireRole(["ADMIN"]);

  const payments = await db.query.payments.findMany({
    with: {
      order: {
        with: {
          customer: true,
          technician: true,
        },
      },
    },
    orderBy: [desc(schema.payments.createdAt)],
  });

  const totalReconciled = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-medium">Rekonsiliasi Pembayaran</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rekonsiliasi Transaksi & Pembayaran
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar record transaksi simulasi pembayaran digital (QRIS, Bank Transfer, E-Wallet)
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200/90 px-4 py-2.5 shadow-sm text-right">
          <div className="text-xs text-slate-500 uppercase font-semibold">Total Terekonsiliasi</div>
          <div className="text-lg font-extrabold text-emerald-700 font-mono">
            {formatRupiah(totalReconciled)}
          </div>
        </div>
      </div>

      {/* CoolAdmin Table Container */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Log Mutasi Pembayaran Digital
          </h2>
          <span className="text-xs text-slate-400">Total {payments.length} Mutasi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider text-xs font-bold">
                <th className="py-3 px-4">No. Referensi Pembayaran</th>
                <th className="py-3 px-4">No. Pesanan</th>
                <th className="py-3 px-4">Waktu Bayar</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Teknisi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right font-bold text-slate-900">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{p.referenceNumber}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{p.order.orderNumber}</td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{formatDate(p.paidAt || p.createdAt)}</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-semibold text-xs">
                      {p.paymentMethod.replace("SIMULATED_", "")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800">{p.order.customer.name}</td>
                  <td className="py-3.5 px-4 text-slate-800">{p.order.technician.name}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={p.status === "PAID" ? "default" : "destructive"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700">
                    {formatRupiah(p.amount)}
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
