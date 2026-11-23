import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getAdminMetrics() {
  const [
    allOrders,
    allUsers,
    allTechnicians,
    allCategories,
    platformSetting,
    commissionHistory,
  ] = await Promise.all([
    db.query.orders.findMany({
      with: {
        customer: true,
        technician: true,
        category: true,
        payment: true,
      },
      orderBy: [desc(schema.orders.createdAt)],
    }),
    db.select().from(schema.users),
    db.query.technicianProfiles.findMany({
      with: {
        user: true,
      },
    }),
    db.select().from(schema.categories),
    db.query.platformSettings.findFirst({
      where: eq(schema.platformSettings.key, "commission_rate"),
    }),
    db.select().from(schema.commissionRateHistory).orderBy(desc(schema.commissionRateHistory.createdAt)),
  ]);

  // Aggregate financial metrics from paid/completed orders
  const paidOrders = allOrders.filter((o) =>
    ["PAID", "IN_PROGRESS", "COMPLETED"].includes(o.status)
  );

  const totalGrossRevenue = paidOrders.reduce((sum, o) => sum + o.customerTotal, 0);
  const totalLaborFee = paidOrders.reduce((sum, o) => sum + o.laborFee, 0);
  const totalParts = paidOrders.reduce((sum, o) => sum + o.partsTotal, 0);
  const totalOtherCharges = paidOrders.reduce((sum, o) => sum + o.otherCharges, 0);
  const totalPlatformCommission = paidOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const totalTechnicianNet = paidOrders.reduce((sum, o) => sum + o.technicianNet, 0);

  // Group by category
  const categoryStats = allCategories.map((cat) => {
    const catOrders = allOrders.filter((o) => o.categoryId === cat.id);
    const catPaid = catOrders.filter((o) => ["PAID", "IN_PROGRESS", "COMPLETED"].includes(o.status));
    const volume = catPaid.reduce((sum, o) => sum + o.customerTotal, 0);
    const commission = catPaid.reduce((sum, o) => sum + o.commissionAmount, 0);
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      totalOrders: catOrders.length,
      volume,
      commission,
    };
  });

  // Group by technician
  const technicianStats = allTechnicians.map((t) => {
    const techOrders = allOrders.filter((o) => o.technicianId === t.userId);
    const techPaid = techOrders.filter((o) => ["PAID", "IN_PROGRESS", "COMPLETED"].includes(o.status));
    const gross = techPaid.reduce((sum, o) => sum + o.customerTotal, 0);
    const net = techPaid.reduce((sum, o) => sum + o.technicianNet, 0);
    const commission = techPaid.reduce((sum, o) => sum + o.commissionAmount, 0);
    return {
      userId: t.userId,
      name: t.displayName,
      totalOrders: techOrders.length,
      completedOrders: techOrders.filter((o) => o.status === "COMPLETED").length,
      gross,
      commission,
      net,
      rating: t.averageRating,
      verificationStatus: t.verificationStatus,
    };
  });

  return {
    totalGrossRevenue,
    totalLaborFee,
    totalParts,
    totalOtherCharges,
    totalPlatformCommission,
    totalTechnicianNet,
    totalOrdersCount: allOrders.length,
    activeOrdersCount: allOrders.filter((o) => ["AWAITING_PAYMENT", "PAID", "IN_PROGRESS"].includes(o.status)).length,
    completedOrdersCount: allOrders.filter((o) => o.status === "COMPLETED").length,
    pendingApprovalCount: allOrders.filter((o) => o.status === "PENDING_CUSTOMER_APPROVAL").length,
    totalCustomersCount: allUsers.filter((u) => u.role === "CUSTOMER").length,
    totalTechniciansCount: allTechnicians.length,
    verifiedTechniciansCount: allTechnicians.filter((t) => t.verificationStatus === "VERIFIED").length,
    currentCommissionRate: (platformSetting?.value as any)?.rate || 0.25,
    categoryStats,
    technicianStats,
    recentOrders: allOrders.slice(0, 10),
    commissionHistory,
  };
}

export async function updatePlatformCommissionRate(params: {
  newRate: number;
  changedBy: string;
  reason?: string;
}) {
  if (params.newRate < 0 || params.newRate > 1) {
    throw new Error("Persentase komisi harus antara 0 (0%) dan 1 (100%).");
  }

  await db.transaction(async (tx) => {
    // 1. Update platform settings
    await tx
      .insert(schema.platformSettings)
      .values({
        key: "commission_rate",
        value: {
          rate: params.newRate,
          description: `Komisi platform ${(params.newRate * 100).toFixed(0)}% pada biaya jasa servis.`,
          updatedAt: new Date().toISOString(),
        },
        updatedBy: params.changedBy,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.platformSettings.key,
        set: {
          value: {
            rate: params.newRate,
            description: `Komisi platform ${(params.newRate * 100).toFixed(0)}% pada biaya jasa servis.`,
            updatedAt: new Date().toISOString(),
          },
          updatedBy: params.changedBy,
          updatedAt: new Date(),
        },
      });

    // 2. Append to versioned history
    await tx.insert(schema.commissionRateHistory).values({
      id: `crh-${Date.now()}`,
      rate: params.newRate.toFixed(4),
      effectiveAt: new Date(),
      changedBy: params.changedBy,
      reason: params.reason || "Pembaruan kebijakan komisi oleh Administrator.",
    });

    // 3. Log audit event
    await tx.insert(schema.auditLogs).values({
      id: `audit-${Date.now()}`,
      actorId: params.changedBy,
      action: "UPDATE_COMMISSION_RATE",
      entityType: "platform_settings",
      entityId: "commission_rate",
      metadata: {
        newRate: params.newRate,
        reason: params.reason,
      },
    });
  });
}

export async function updateTechnicianVerification(params: {
  userId: string;
  status: "VERIFIED" | "REJECTED" | "SUSPENDED" | "PENDING";
  adminId: string;
}) {
  await db.transaction(async (tx) => {
    await tx
      .update(schema.technicianProfiles)
      .set({
        verificationStatus: params.status,
        updatedAt: new Date(),
      })
      .where(eq(schema.technicianProfiles.userId, params.userId));

    await tx.insert(schema.auditLogs).values({
      id: `audit-${Date.now()}`,
      actorId: params.adminId,
      action: "UPDATE_TECHNICIAN_VERIFICATION",
      entityType: "technician_profile",
      entityId: params.userId,
      metadata: {
        newStatus: params.status,
      },
    });

    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: params.userId,
      type: "VERIFICATION_STATUS_CHANGED",
      title: "Status Verifikasi Diperbarui",
      body: `Status akun teknisi Anda telah diperbarui menjadi: ${params.status}.`,
      entityType: "technician_profile",
      entityId: params.userId,
    });
  });
}

