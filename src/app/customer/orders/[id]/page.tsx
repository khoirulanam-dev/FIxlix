import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getCustomerOrderWithDetails } from "@/modules/orders/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate, buildWhatsAppUrl } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, AlertTriangle, CreditCard, Star, ChevronRight, User, Wrench, XCircle, MessageCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { OrderApprovalActions } from "./order-approval-actions";
import { OrderAttachmentsSection } from "@/components/shared/order-attachments-section";

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
  const techPhone = techProfile?.whatsappPhone || order.technician.phone || "";
  const techName = techProfile?.displayName || order.technician.name || "Teknisi";
  const whatsappUrl = techPhone
    ? buildWhatsAppUrl(
        techPhone,
        `Halo ${techName}, saya sudah membayar pesanan servis ${order.orderNumber} (${order.deviceName}). Mohon konfirmasi jadwal/pengerjaannya ya. Terima kasih!`
      )
    : null;

  const getStepState = (stepIdx: number) => {
    const statusOrderMap: Record<string, number> = {
      PENDING_CUSTOMER_APPROVAL: 1,
      AWAITING_PAYMENT: 2,
      PAID: 3,
      IN_PROGRESS: 4,
      COMPLETED: 5,
    };
    const currentStep = statusOrderMap[order.status] || 0;
    if (order.status === "REJECTED" || order.status === "CANCELLED") return "cancelled";
    if (currentStep > stepIdx) return "completed";
    if (currentStep === stepIdx) return "current";
    return "pending";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/customer/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Kembali ke Daftar Pesanan</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/customer" className="hover:text-emerald-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/customer/orders" className="hover:text-emerald-600 transition-colors">
            Pesanan Servis
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-mono font-medium">{order.orderNumber}</span>
        </div>
      </div>

      {/* Visual Stepper / Progress Tracker */}
      {order.status !== "CANCELLED" && order.status !== "REJECTED" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center justify-between">
            <span>Alur Pengerjaan Servis</span>
            <span className="text-emerald-700 font-semibold lowercase">
              Status saat ini: {getOrderStatusLabel(order.status)}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { idx: 1, label: "Persetujuan", desc: "Kesepakatan Biaya" },
              { idx: 2, label: "Tagihan", desc: "Menunggu Bayar" },
              { idx: 3, label: "Terbayar", desc: "Dana Diamankan" },
              { idx: 4, label: "Pengerjaan", desc: "Reparasi Perangkat" },
              { idx: 5, label: "Selesai", desc: "Garansi & Ulasan" },
            ].map((s) => {
              const state = getStepState(s.idx);
              return (
                <div
                  key={s.idx}
                  className={`p-3 rounded-xl border transition-all ${
                    state === "completed"
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                      : state === "current"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {state === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          state === "current"
                            ? "bg-white text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {s.idx}
                      </span>
                    )}
                    <span
                      className={`text-xs font-bold truncate ${
                        state === "current"
                          ? "text-white"
                          : state === "completed"
                          ? "text-emerald-950"
                          : "text-slate-600"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate ${
                      state === "current"
                        ? "text-emerald-100"
                        : state === "completed"
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }`}
                  >
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Header & Status Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
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
            <Alert variant="destructive" className="rounded-xl">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <AlertTitle className="text-red-950 font-bold mb-0.5">Alasan Penolakan Pesanan</AlertTitle>
                <AlertDescription className="text-red-800 leading-relaxed text-xs sm:text-sm">
                  {order.rejectionReason}
                </AlertDescription>
              </div>
            </Alert>
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
              <span className="font-extrabold text-emerald-600 text-2xl font-mono">
                {formatRupiah(order.customerTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Foto & Dokumentasi Kerusakan / Servis */}
      <OrderAttachmentsSection
        orderId={order.id}
        attachments={order.attachments as any}
        canUpload={order.status !== "CANCELLED"}
      />

      {/* Action Decision: Approval / Reject / Pay / Review */}
      {order.status === "PENDING_CUSTOMER_APPROVAL" && (
        <OrderApprovalActions orderId={order.id} orderNumber={order.orderNumber} />
      )}

      {order.status === "AWAITING_PAYMENT" && (
        <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/90 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-emerald-900 text-base">
              Pesanan Telah Disetujui
            </h3>
            <p className="text-xs text-emerald-700">
              Lakukan pembayaran digital simulasi sebesar <strong className="font-mono">{formatRupiah(order.customerTotal)}</strong> untuk memulai proses servis.
            </p>
          </div>
          <Link href={`/customer/orders/${order.id}/bayar`} className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl shadow-sm">
              <CreditCard className="w-5 h-5" />
              <span>Bayar Sekarang</span>
            </Button>
          </Link>
        </div>
      )}

      {/* State Guidance Banner: PAID (Sudah Dibayar) */}
      {order.status === "PAID" && (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-50/60 border border-emerald-200/90 p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <span>Pembayaran Lunas</span>
                  <span>•</span>
                  <span>{formatRupiah(order.customerTotal)}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Pembayaran Berhasil! Apa Langkah Berikutnya?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  Dana Anda telah kami amankan. Teknisi <strong>{techName}</strong> telah menerima konfirmasi pembayaran dan sedang mempersiapkan jadwal serta peralatan untuk memulai perbaikan <strong>{order.deviceName}</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold gap-2 rounded-xl shadow-sm h-11 px-4 text-xs sm:text-sm cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    <span>Hubungi Teknisi di WhatsApp</span>
                  </Button>
                </a>
              )}
              <Link href="/customer/orders" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-11 px-4 text-xs font-bold rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-100/60">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  <span>Daftar Pesanan</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Panduan 3 Langkah untuk Pelanggan */}
          <div className="pt-4 border-t border-emerald-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-100 space-y-1.5 shadow-2xs">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Koordinasi Waktu & Lokasi</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Kirim pesan WhatsApp ke teknisi untuk memastikan jadwal kedatangan atau jam kunjungan ke lokasi Anda.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-100 space-y-1.5 shadow-2xs">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Teknisi Memulai Servis</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Status akan otomatis berubah menjadi &ldquo;Dalam Pengerjaan&rdquo; begitu teknisi mulai memperbaiki perangkat.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-100 space-y-1.5 shadow-2xs">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>Dokumentasi Foto Real-time</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Anda dapat melihat foto fisik barang, sparepart baru, atau hasil pengujian di bagian dokumentasi bawah.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* State Guidance Banner: IN_PROGRESS (Dalam Pengerjaan) */}
      {order.status === "IN_PROGRESS" && (
        <div className="rounded-2xl bg-blue-50/80 border border-blue-200/90 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/30">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                  <span>Tahap Reparasi Berlangsung</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Servis Sedang Dikerjakan Teknisi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  Teknisi <strong>{techName}</strong> sedang menangani perbaikan pada perangkat {order.deviceName}. Pantau dokumentasi foto fisik atau sparepart di bawah.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold gap-2 rounded-xl shadow-sm h-11 px-4 text-xs sm:text-sm cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat Teknisi di WhatsApp</span>
                  </Button>
                </a>
              )}
              <Link href="/customer/orders" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-11 px-4 text-xs font-bold rounded-xl border-blue-300 text-blue-800 hover:bg-blue-100/60">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  <span>Daftar Pesanan</span>
                </Button>
              </Link>
            </div>
          </div>
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

      {/* Footer Navigation Bar */}
      <div className="pt-2 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80">
        <Link href="/customer/orders" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100">
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Kembali ke Daftar Pesanan Servis</span>
          </Button>
        </Link>
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Ada Pertanyaan? Tanya Teknisi di WhatsApp</span>
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
