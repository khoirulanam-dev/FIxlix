import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getCustomerOrderWithDetails } from "@/modules/orders/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, AlertTriangle, CreditCard, Star, ChevronRight, User, Wrench } from "lucide-react";
import { OrderApprovalActions } from "./order-approval-actions";

export const dynamic = "force-dynamic";

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole(["CUSTOMER", "ADMIN"]);
  const { id } = await params;
  const order = await getCustomerOrderWithDetails(id, session.user.id);

  if (!order) {
    notFound();
  }

  const techProfile = order.technician.technicianProfile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/customer" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/customer/orders" className="hover:text-blue-600 transition-colors">
          Pesanan Servis
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-mono font-medium">{order.orderNumber}</span>
      </div>

      {/* Header & Status Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Nomor Referensi Pesanan
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
              <span className="text-slate-400 block font-medium">Perangkat:</span>
              <strong className="text-slate-900 text-sm block">{order.deviceName}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block font-medium">Kategori:</span>
              <strong className="text-slate-900 text-sm block">{order.category.name}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block font-medium">Teknisi:</span>
              <strong className="text-slate-900 text-sm block">
                {techProfile?.displayName || order.technician.name}
              </strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 block font-medium">Tanggal Pengajuan:</span>
              <strong className="text-slate-900 text-sm block">{formatDate(order.createdAt)}</strong>
            </div>
          </div>

          {order.description && (
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                Deskripsi Kendala & Kerusakan:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 leading-relaxed">
                {order.description}
              </p>
            </div>
          )}

          {order.technicianNotes && (
            <div>
              <span className="text-xs font-semibold text-emerald-800 block mb-1">
                Catatan Penjelasan Teknisi:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100 leading-relaxed">
                {order.technicianNotes}
              </p>
            </div>
          )}

          {order.rejectionReason && (
            <div>
              <span className="text-xs font-semibold text-red-600 block mb-1">
                Alasan Penolakan:
              </span>
              <p className="text-xs sm:text-sm text-red-700 bg-red-50 rounded-xl p-3.5 border border-red-200 leading-relaxed">
                {order.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Cost Itemization (NEVER SHOW COMMISSION OR TECH NET) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">
            Rincian Biaya Servis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparansi rincian biaya yang disepakati untuk perbaikan perangkat
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3 text-sm">
            {/* Biaya Jasa Dasar */}
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <div>
                <span className="font-semibold text-slate-900">Biaya Jasa Pengerjaan Teknisi</span>
                <p className="text-xs text-slate-500">Upah kerja profesional reparasi perangkat</p>
              </div>
              <span className="font-bold text-slate-900 font-mono">
                {formatRupiah(order.laborFee)}
              </span>
            </div>

            {/* Spareparts */}
            {order.spareparts && order.spareparts.length > 0 && (
              <div className="space-y-2 py-2.5 border-b border-slate-100">
                <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                  Komponen Sparepart
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

            {/* Additional Charges */}
            {order.additionalCharges && order.additionalCharges.length > 0 && (
              <div className="space-y-2 py-2.5 border-b border-slate-100">
                <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                  Biaya Tambahan Operasional
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

            {/* Total Payable by Customer */}
            <div className="flex justify-between items-center pt-3 text-base">
              <div>
                <span className="font-extrabold text-slate-900 text-lg">Total Pembayaran</span>
                <p className="text-xs text-slate-500">Nominal yang harus dibayarkan</p>
              </div>
              <span className="font-extrabold text-blue-600 text-2xl font-mono">
                {formatRupiah(order.customerTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Decision: Approval / Reject / Pay / Review */}
      {order.status === "PENDING_CUSTOMER_APPROVAL" && (
        <OrderApprovalActions orderId={order.id} orderNumber={order.orderNumber} />
      )}

      {order.status === "AWAITING_PAYMENT" && (
        <div className="rounded-2xl bg-blue-50/70 border border-blue-200/90 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-blue-900 text-base">
              Pesanan Telah Disetujui
            </h3>
            <p className="text-xs text-blue-700">
              Lakukan pembayaran digital simulasi sebesar <strong className="font-mono">{formatRupiah(order.customerTotal)}</strong> untuk memulai proses servis.
            </p>
          </div>
          <Link href={`/customer/orders/${order.id}/bayar`} className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 rounded-xl shadow-sm">
              <CreditCard className="w-5 h-5" />
              <span>Bayar Sekarang</span>
            </Button>
          </Link>
        </div>
      )}

      {order.status === "COMPLETED" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">
                  Servis Telah Selesai
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Perbaikan elektronik telah berhasil diselesaikan oleh teknisi.
              </p>
            </div>

            {!order.review ? (
              <Link href={`/customer/orders/${order.id}/review`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl gap-2 shadow-sm">
                  <Star className="w-4 h-4" />
                  <span>Beri Ulasan Teknisi</span>
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Ulasan Anda: {order.review.rating} / 5</span>
              </div>
            )}
          </div>

          {order.review && (
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="text-slate-400 block mb-0.5">Komentar Ulasan:</span>
              <p className="italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                &ldquo;{order.review.comment}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
