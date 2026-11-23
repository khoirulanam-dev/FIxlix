import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getCustomerOrders } from "@/modules/orders/service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatDate } from "@/lib/utils";
import { getOrderStatusLabel, getOrderStatusVariant } from "@/core/domain/order";
import { ChevronRight, Wrench, Eye, CreditCard, Star, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireRole(["CUSTOMER", "ADMIN"]);
  const { status } = await searchParams;
  const allOrders = await getCustomerOrders(session.user.id);

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
      {/* CoolAdmin Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Link href="/customer" className="hover:text-emerald-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-600 font-medium">Pesanan Servis</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pesanan Servis Saya
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola dan pantau seluruh status perbaikan perangkat elektronik Anda
          </p>
        </div>

        <Link href="/kategori">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm gap-2">
            <Wrench className="w-4 h-4" />
            <span>Pesan Servis Baru</span>
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
              href={tab.value ? `/customer/orders?status=${tab.value}` : "/customer/orders"}
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

      {/* CoolAdmin Table/Card Container */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Tidak Ada Pesanan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tidak ditemukan pesanan pada filter ini. Ajukan servis baru untuk perbaikan peralatan rumah tangga Anda.
            </p>
          </div>
          <Link href="/kategori">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl">
              Cari Jasa Servis
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
                    Kategori: <strong className="text-slate-700">{order.category.name}</strong> • Teknisi:{" "}
                    <strong className="text-slate-700">
                      {order.technician.technicianProfile?.displayName || order.technician.name}
                    </strong>
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium">Kendala: </span>
                  {order.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase font-semibold">Total Biaya</div>
                  <div className="text-lg font-extrabold text-slate-900 font-mono">
                    {formatRupiah(order.customerTotal)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === "AWAITING_PAYMENT" && (
                    <Link href={`/customer/orders/${order.id}/bayar`}>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-sm">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar</span>
                      </Button>
                    </Link>
                  )}
                  {order.status === "COMPLETED" && !order.review && (
                    <Link href={`/customer/orders/${order.id}/review`}>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-sm">
                        <Star className="w-3.5 h-3.5" />
                        <span>Beri Ulasan</span>
                      </Button>
                    </Link>
                  )}
                  <Link href={`/customer/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
