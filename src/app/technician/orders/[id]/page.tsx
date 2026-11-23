import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getTechnicianOrderWithDetails } from "@/modules/orders/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Star, ChevronRight, User, Phone, Mail } from "lucide-react";
import { TechnicianOrderActions } from "./technician-order-actions";

export const dynamic = "force-dynamic";

export default async function TechnicianOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);
  const { id } = await params;
  const order = await getTechnicianOrderWithDetails(id, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/technician" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/technician/orders" className="hover:text-blue-600 transition-colors">
          Pesanan Servis
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-mono font-medium">{order.orderNumber}</span>
      </div>

      {/* Header Info Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Nomor Pesanan Servis
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono mt-0.5">
              {order.orderNumber}
            </h1>
          </div>
          <Badge variant={getOrderStatusVariant(order.status)} className="text-xs px-3 py-1 font-semibold">
            {getOrderStatusLabel(order.status)}
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block font-medium">Pelanggan:</span>
              <strong className="text-slate-900 text-sm block">{order.customer.name}</strong>
              <div className="text-slate-500 truncate">{order.customer.email}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block font-medium">Perangkat:</span>
              <strong className="text-slate-900 text-sm block">{order.deviceName}</strong>
              <div className="text-slate-500">Kategori: {order.category.name}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block font-medium">Tanggal Dibuat:</span>
              <strong className="text-slate-900 text-sm block">{formatDate(order.createdAt)}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block font-medium">Asal Pesanan:</span>
              <strong className="text-slate-900 text-sm block">
                {order.origin === "DIRECT_SERVICE" ? "Order Langsung" : "Custom Order"}
              </strong>
            </div>
          </div>

          {order.description && (
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                Deskripsi Kendala Pelanggan:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 leading-relaxed">
                {order.description}
              </p>
            </div>
          )}

          {order.technicianNotes && (
            <div>
              <span className="text-xs font-semibold text-blue-800 block mb-1">
                Catatan Anda untuk Pelanggan:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 bg-blue-50/50 rounded-xl p-3.5 border border-blue-100 leading-relaxed">
                {order.technicianNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accounting & Commission Breakdown (Visible to Technician) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">
            Rincian Finansial & Komisi Platform
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perhitungan akuntansi pendapatan bersih teknisi dan komisi platform Fixlix
          </p>
        </div>

        <div className="p-6 space-y-3 text-sm">
          <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
            <div>
              <span className="font-semibold text-slate-900">Biaya Jasa Servis</span>
              <p className="text-xs text-slate-500">
                Basis potongan komisi {(Number(order.commissionRateSnapshot) * 100).toFixed(0)}%
              </p>
            </div>
            <span className="font-bold text-slate-900 font-mono">
              {formatRupiah(order.laborFee)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-slate-100 text-amber-700">
            <div>
              <span className="font-semibold">
                Potongan Komisi Platform ({(Number(order.commissionRateSnapshot) * 100).toFixed(0)}%)
              </span>
              <p className="text-xs text-amber-600">Hanya dipotong dari biaya jasa pengerjaan</p>
            </div>
            <span className="font-bold font-mono">
              - {formatRupiah(order.commissionAmount)}
            </span>
          </div>

          {order.spareparts && order.spareparts.length > 0 && (
            <div className="space-y-2 py-2.5 border-b border-slate-100">
              <div className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                Komponen Sparepart (Komisi 0% - 100% Hak Teknisi)
              </div>
              {order.spareparts.map((sp: any) => (
                <div key={sp.id} className="flex justify-between items-center text-xs pl-2 text-slate-600">
                  <span>
                    {sp.name} ({sp.quantity}x @ {formatRupiah(sp.unitPrice)})
                  </span>
                  <span className="font-medium text-slate-800 font-mono">
                    {formatRupiah(sp.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {order.additionalCharges && order.additionalCharges.length > 0 && (
            <div className="space-y-2 py-2.5 border-b border-slate-100">
              <div className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                Biaya Tambahan Operasional (Komisi 0% - 100% Hak Teknisi)
              </div>
              {order.additionalCharges.map((ch: any) => (
                <div key={ch.id} className="flex justify-between items-center text-xs pl-2 text-slate-600">
                  <span>{ch.description}</span>
                  <span className="font-medium text-slate-800 font-mono">
                    {formatRupiah(ch.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-base">
            <div>
              <span className="font-extrabold text-slate-900 text-lg">Total Pendapatan Bersih Teknisi</span>
              <p className="text-xs text-slate-500">
                (Jasa - Komisi) + Sparepart + Biaya Tambahan
              </p>
            </div>
            <span className="font-extrabold text-emerald-700 text-2xl font-mono">
              {formatRupiah(order.technicianNet)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Decision Control */}
      <TechnicianOrderActions orderId={order.id} status={order.status} />
    </div>
  );
}
