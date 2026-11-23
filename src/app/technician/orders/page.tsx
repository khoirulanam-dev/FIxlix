import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getTechnicianOrders } from "@/modules/orders/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { PlusCircle, ChevronRight, Eye, Wrench, Clock, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TechnicianOrdersListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);
  const { status } = await searchParams;
  const allOrders = await getTechnicianOrders(session.user.id);

  const filteredOrders = status
    ? allOrders.filter((o) => o.status === status)
    : allOrders;

  const tabs = [
    { label: "Semua", value: "", count: allOrders.length },
    {
      label: "Menunggu Persetujuan",
      value: "PENDING_CUSTOMER_APPROVAL",
      count: allOrders.filter((o) => o.status === "PENDING_CUSTOMER_APPROVAL").length,
    },
    {
      label: "Menunggu Pembayaran",
      value: "AWAITING_PAYMENT",
      count: allOrders.filter((o) => o.status === "AWAITING_PAYMENT").length,
    },
    {
      label: "Sudah Dibayar",
      value: "PAID",
      count: allOrders.filter((o) => o.status === "PAID").length,
    },
    {
      label: "Dalam Pengerjaan",
      value: "IN_PROGRESS",
      count: allOrders.filter((o) => o.status === "IN_PROGRESS").length,
    },
    {
      label: "Selesai",
      value: "COMPLETED",
      count: allOrders.filter((o) => o.status === "COMPLETED").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Link href="/technician" className="hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-medium">Pesanan Servis</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Pesanan Servis
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar seluruh pesanan perbaikan elektronik yang ditugaskan kepada Anda
          </p>
        </div>

        <Link href="/technician/orders/baru">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Buat Order Kustom</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs - CoolAdmin Pill Style */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((tab) => {
          const isActive = (status || "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/technician/orders?status=${tab.value}` : "/technician/orders"}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* CoolAdmin Table/Cards */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Tidak Ada Pesanan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Belum ada pesanan pada status ini. Anda dapat membuat order kustom baru setelah berdiskusi via WhatsApp dengan pelanggan.
            </p>
          </div>
          <Link href="/technician/orders/baru">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl">
              Buat Order Kustom Baru
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {order.orderNumber}
                  </span>
                  <Badge variant={getOrderStatusVariant(order.status)}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    • {formatDate(order.createdAt)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {order.deviceName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pelanggan: <strong className="text-slate-700">{order.customer.name}</strong> • Kategori:{" "}
                    <strong className="text-slate-700">{order.category.name}</strong>
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium">Kendala: </span>
                  {order.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Net Teknisi</div>
                  <div className="text-lg font-extrabold text-emerald-700 font-mono">
                    {formatRupiah(order.technicianNet)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Total order: {formatRupiah(order.customerTotal)}
                  </div>
                </div>

                <Link href={`/technician/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail & Aksi</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
