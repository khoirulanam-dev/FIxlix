import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getReviewsForTechnician } from "@/modules/reviews/service";
import { StarRating } from "@/components/shared/star-rating";
import { formatDate } from "@/lib/utils";
import { Star, ChevronRight, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TechnicianReviewsPage() {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);
  const reviews = await getReviewsForTechnician(session.user.id);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

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
            <span className="text-slate-600 font-medium">Ulasan Pelanggan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ulasan & Reputasi Teknisi
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ulasan dan rating asli dari pelanggan setelah menyelesaikan perbaikan barang elektronik
          </p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200/90 px-4 py-2.5 shadow-sm">
          <StarRating rating={avgRating} totalReviews={reviews.length} size="lg" />
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Belum Ada Ulasan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Belum ada ulasan yang masuk. Selesaikan perbaikan pesanan untuk mendapatkan ulasan pertama Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                    {rev.customer.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{rev.customer.name}</div>
                    <div className="text-xs text-slate-400">
                      Pesanan: <span className="font-mono text-slate-600 font-medium">{rev.order.orderNumber}</span> ({rev.order.deviceName}) • {formatDate(rev.createdAt)}
                    </div>
                  </div>
                </div>
                <StarRating rating={rev.rating} size="sm" showCount={false} />
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
