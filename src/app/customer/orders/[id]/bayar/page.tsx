import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getCustomerOrderWithDetails } from "@/modules/orders/service";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, ChevronRight, ShieldCheck, CreditCard } from "lucide-react";
import { CheckoutPaymentForm } from "./checkout-payment-form";

export const dynamic = "force-dynamic";

export default async function CheckoutPaymentPage({
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

  // Only allow payment if status is AWAITING_PAYMENT
  if (order.status !== "AWAITING_PAYMENT") {
    redirect(`/customer/orders/${order.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/customer" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/customer/orders" className="hover:text-blue-600 transition-colors">
          Pesanan Servis
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/customer/orders/${order.id}`} className="hover:text-blue-600 transition-colors font-mono">
          {order.orderNumber}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-medium">Pembayaran</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pembayaran Pesanan Servis
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pesanan: <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span> • {order.deviceName}
          </p>
        </div>
      </div>

      {/* CoolAdmin Summary Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Ringkasan Tagihan Servis
            </h3>
          </div>
          <span className="text-xs text-slate-400">Simulasi Transaksi Aman</span>
        </div>

        <div className="p-6 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between items-center py-1">
            <span>Biaya Jasa Servis:</span>
            <span className="font-medium text-slate-900 font-mono">{formatRupiah(order.laborFee)}</span>
          </div>
          {order.partsTotal > 0 && (
            <div className="flex justify-between items-center py-1">
              <span>Biaya Komponen Sparepart:</span>
              <span className="font-medium text-slate-900 font-mono">{formatRupiah(order.partsTotal)}</span>
            </div>
          )}
          {order.otherCharges > 0 && (
            <div className="flex justify-between items-center py-1">
              <span>Biaya Tambahan Operasional:</span>
              <span className="font-medium text-slate-900 font-mono">{formatRupiah(order.otherCharges)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-base font-extrabold text-slate-900">
            <span>Total yang Harus Dibayar:</span>
            <span className="text-blue-600 text-xl font-mono">{formatRupiah(order.customerTotal)}</span>
          </div>
        </div>
      </div>

      {/* Interactive Payment Method Selector */}
      <CheckoutPaymentForm orderId={order.id} totalAmount={order.customerTotal} />
    </div>
  );
}
