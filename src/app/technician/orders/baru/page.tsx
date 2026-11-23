import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { CustomOrderBuilder } from "./custom-order-builder";
import { getActiveCommissionRate } from "@/modules/orders/service";

export const dynamic = "force-dynamic";

export default async function NewCustomOrderPage() {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);

  // Fetch all registered customers and categories
  const [customers, categories, technicianServices, commissionRate] = await Promise.all([
    db.query.users.findMany({
      where: eq(schema.users.role, "CUSTOMER"),
      columns: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    }),
    db.select().from(schema.categories).where(eq(schema.categories.isActive, true)),
    db.query.technicianServices.findMany({
      where: eq(schema.technicianServices.technicianId, session.user.id),
      with: {
        category: true,
      },
    }),
    getActiveCommissionRate(),
  ]);

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
        <span className="text-slate-600 font-medium">Buat Custom Order</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Buat Custom Order Pelanggan
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Terbitkan rincian biaya resmi untuk pelanggan setelah kesepakatan harga perbaikan di WhatsApp
        </p>
      </div>

      <CustomOrderBuilder
        customers={customers}
        categories={categories}
        services={technicianServices}
        defaultCommissionRate={commissionRate}
      />
    </div>
  );
}
