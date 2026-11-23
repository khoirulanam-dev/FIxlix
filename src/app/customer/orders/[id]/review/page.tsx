import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getCustomerOrderWithDetails } from "@/modules/orders/service";
import { ArrowLeft, ChevronRight, Star } from "lucide-react";
import { ReviewForm } from "./review-form";

export const dynamic = "force-dynamic";

export default async function OrderReviewPage({
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

  // Must be completed
  if (order.status !== "COMPLETED") {
    redirect(`/customer/orders/${order.id}`);
  }

  // If already reviewed, redirect
  if (order.review) {
    redirect(`/customer/orders/${order.id}`);
  }

  const techProfile = order.technician.technicianProfile;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/customer" className="hover:text-emerald-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/customer/orders" className="hover:text-emerald-600 transition-colors">
          Pesanan Servis
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/customer/orders/${order.id}`} className="hover:text-emerald-600 transition-colors font-mono">
          {order.orderNumber}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-medium">Beri Ulasan</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Beri Ulasan Teknisi
        </h1>
        <p className="text-sm text-slate-500">
          Pesanan: <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span> • {order.deviceName}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            {techProfile?.profileImageKey ? (
              <img
                src={techProfile.profileImageKey}
                alt={techProfile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-sm">
                {order.technician.name[0]}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teknisi Servis</div>
            <div className="font-bold text-slate-900 text-sm">
              {techProfile?.displayName || order.technician.name}
            </div>
            <div className="text-xs text-slate-500">{order.category.name}</div>
          </div>
        </div>

        <div className="p-6">
          <ReviewForm orderId={order.id} />
        </div>
      </div>
    </div>
  );
}
