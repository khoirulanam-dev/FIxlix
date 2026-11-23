import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc, and, or, sql } from "drizzle-orm";
import { calculatePricing, DEFAULT_COMMISSION_RATE } from "@/core/domain/commission";
import { OrderStatus, canTransitionOrder, OrderStatusType } from "@/core/domain/order";

/**
 * Generate human-readable order number e.g. FX-202611-1234
 */
function generateOrderNumber(): string {
  const d = new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FX-${yearMonth}-${random}`;
}

/**
 * Get active commission rate from platform settings
 */
export async function getActiveCommissionRate(): Promise<number> {
  const setting = await db.query.platformSettings.findFirst({
    where: eq(schema.platformSettings.key, "commission_rate"),
  });
  if (setting && setting.value && typeof (setting.value as any).rate === "number") {
    return (setting.value as any).rate;
  }
  return DEFAULT_COMMISSION_RATE;
}

/**
 * 1. Create Direct Order (Customer directly orders base labor service)
 */
export async function createDirectOrder(params: {
  customerId: string;
  serviceId: string;
  deviceName: string;
  description: string;
  customerNotes?: string;
}) {
  const service = await db.query.technicianServices.findFirst({
    where: eq(schema.technicianServices.id, params.serviceId),
  });

  if (!service) {
    throw new Error("Layanan tidak ditemukan.");
  }

  const commissionRate = await getActiveCommissionRate();
  const pricing = calculatePricing({
    laborFee: service.laborBasePrice,
    partsTotal: 0,
    otherCharges: 0,
    commissionRate,
  });

  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = generateOrderNumber();

  await db.transaction(async (tx) => {
    await tx.insert(schema.orders).values({
      id: orderId,
      orderNumber,
      customerId: params.customerId,
      technicianId: service.technicianId,
      serviceId: service.id,
      categoryId: service.categoryId,
      origin: "DIRECT_SERVICE",
      status: "AWAITING_PAYMENT", // Direct order already agreed to base price
      deviceName: params.deviceName,
      description: params.description,
      customerNotes: params.customerNotes,
      laborFee: pricing.laborFee,
      partsTotal: 0,
      otherCharges: 0,
      customerTotal: pricing.customerTotal,
      commissionRateSnapshot: commissionRate.toFixed(4),
      commissionAmount: pricing.commissionAmount,
      technicianNet: pricing.technicianNet,
      customerAcceptedAt: new Date(),
    });

    await tx.insert(schema.orderStatusHistory).values({
      id: `osh-${Date.now()}`,
      orderId,
      actorId: params.customerId,
      fromStatus: null,
      toStatus: "AWAITING_PAYMENT",
      reason: "Order langsung jasa dasar dibuat oleh pelanggan.",
    });

    // Notify technician
    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: service.technicianId,
      type: "ORDER_CREATED",
      title: "Pesanan Langsung Baru",
      body: `Pelanggan membuat pesanan langsung untuk layanan ${service.title}.`,
      entityType: "order",
      entityId: orderId,
    });
  });

  return { orderId, orderNumber };
}

/**
 * 2. Create Custom Order (Technician creates after WhatsApp consultation)
 */
export async function createCustomOrder(params: {
  technicianId: string;
  customerId: string;
  categoryId: string;
  serviceId?: string;
  deviceName: string;
  description: string;
  laborFee: number;
  spareparts?: { name: string; quantity: number; unitPrice: number }[];
  otherCharges?: number;
  otherChargesDescription?: string;
  technicianNotes?: string;
}) {
  const commissionRate = await getActiveCommissionRate();

  const partsTotal = (params.spareparts || []).reduce(
    (sum, p) => sum + p.quantity * p.unitPrice,
    0
  );

  const pricing = calculatePricing({
    laborFee: params.laborFee,
    partsTotal,
    otherCharges: params.otherCharges || 0,
    commissionRate,
  });

  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = generateOrderNumber();

  await db.transaction(async (tx) => {
    await tx.insert(schema.orders).values({
      id: orderId,
      orderNumber,
      customerId: params.customerId,
      technicianId: params.technicianId,
      serviceId: params.serviceId || null,
      categoryId: params.categoryId,
      origin: "TECHNICIAN_CUSTOM",
      status: "PENDING_CUSTOMER_APPROVAL",
      deviceName: params.deviceName,
      description: params.description,
      technicianNotes: params.technicianNotes,
      laborFee: pricing.laborFee,
      partsTotal: pricing.partsTotal,
      otherCharges: pricing.otherCharges,
      customerTotal: pricing.customerTotal,
      commissionRateSnapshot: commissionRate.toFixed(4),
      commissionAmount: pricing.commissionAmount,
      technicianNet: pricing.technicianNet,
    });

    if (params.spareparts && params.spareparts.length > 0) {
      for (const sp of params.spareparts) {
        await tx.insert(schema.orderSpareparts).values({
          id: `sp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          orderId,
          name: sp.name,
          quantity: sp.quantity,
          unitPrice: sp.unitPrice,
          subtotal: sp.quantity * sp.unitPrice,
        });
      }
    }

    if (params.otherCharges && params.otherCharges > 0) {
      await tx.insert(schema.orderAdditionalCharges).values({
        id: `oac-${Date.now()}`,
        orderId,
        description: params.otherChargesDescription || "Biaya operasional tambahan",
        amount: params.otherCharges,
      });
    }

    await tx.insert(schema.orderStatusHistory).values({
      id: `osh-${Date.now()}`,
      orderId,
      actorId: params.technicianId,
      fromStatus: null,
      toStatus: "PENDING_CUSTOMER_APPROVAL",
      reason: "Order kustom dibuat oleh teknisi setelah kesepakatan WhatsApp.",
    });

    // Notify customer
    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: params.customerId,
      type: "ORDER_PENDING_APPROVAL",
      title: "Pesanan Servis Baru Menunggu Persetujuan",
      body: `Teknisi telah menerbitkan rincian biaya untuk perbaikan ${params.deviceName}. Silakan tinjau dan setujui.`,
      entityType: "order",
      entityId: orderId,
    });
  });

  return { orderId, orderNumber };
}

/**
 * 3. Customer approves custom order
 */
export async function acceptOrder(orderId: string, customerId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, orderId),
  });

  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.customerId !== customerId) throw new Error("Akses ditolak.");
  if (order.status !== "PENDING_CUSTOMER_APPROVAL") {
    throw new Error("Pesanan tidak dapat disetujui pada status saat ini.");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(schema.orders)
      .set({
        status: "AWAITING_PAYMENT",
        customerAcceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId));

    await tx.insert(schema.orderStatusHistory).values({
      id: `osh-${Date.now()}`,
      orderId,
      actorId: customerId,
      fromStatus: "PENDING_CUSTOMER_APPROVAL",
      toStatus: "AWAITING_PAYMENT",
      reason: "Pelanggan menyetujui rincian biaya pesanan.",
    });

    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: order.technicianId,
      type: "ORDER_ACCEPTED",
      title: "Pesanan Disetujui Pelanggan",
      body: `Pelanggan telah menyetujui pesanan ${order.orderNumber}. Menunggu pembayaran.`,
      entityType: "order",
      entityId: orderId,
    });
  });
}

/**
 * 4. Customer rejects custom order
 */
export async function rejectOrder(orderId: string, customerId: string, reason?: string) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, orderId),
  });

  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.customerId !== customerId) throw new Error("Akses ditolak.");
  if (order.status !== "PENDING_CUSTOMER_APPROVAL") {
    throw new Error("Pesanan tidak dapat ditolak pada status saat ini.");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(schema.orders)
      .set({
        status: "REJECTED",
        rejectionReason: reason || "Ditolak oleh pelanggan tanpa alasan khusus.",
        customerRejectedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId));

    await tx.insert(schema.orderStatusHistory).values({
      id: `osh-${Date.now()}`,
      orderId,
      actorId: customerId,
      fromStatus: "PENDING_CUSTOMER_APPROVAL",
      toStatus: "REJECTED",
      reason: reason || "Ditolak oleh pelanggan.",
    });

    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: order.technicianId,
      type: "ORDER_REJECTED",
      title: "Pesanan Ditolak Pelanggan",
      body: `Pelanggan menolak pesanan ${order.orderNumber}.`,
      entityType: "order",
      entityId: orderId,
    });
  });
}

/**
 * 5. Process Simulated Payment
 */
export async function processSimulatedPayment(params: {
  orderId: string;
  customerId: string;
  paymentMethod: "SIMULATED_QRIS" | "SIMULATED_BANK_TRANSFER" | "SIMULATED_EWALLET";
}) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, params.orderId),
  });

  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.customerId !== params.customerId) throw new Error("Akses ditolak.");
  if (order.status !== "AWAITING_PAYMENT") {
    throw new Error("Pesanan tidak dalam status siap bayar.");
  }

  const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const referenceNumber = `PAY-${order.orderNumber.replace("FX-", "")}-${Date.now().toString().slice(-4)}`;

  await db.transaction(async (tx) => {
    await tx.insert(schema.payments).values({
      id: paymentId,
      orderId: order.id,
      paymentMethod: params.paymentMethod,
      referenceNumber,
      amount: order.customerTotal,
      status: "PAID",
      paidAt: new Date(),
    });

    await tx
      .update(schema.orders)
      .set({
        status: "PAID",
        paymentPaidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, order.id));

    await tx.insert(schema.orderStatusHistory).values({
      id: `osh-${Date.now()}`,
      orderId: order.id,
      actorId: params.customerId,
      fromStatus: "AWAITING_PAYMENT",
      toStatus: "PAID",
      reason: `Pembayaran berhasil via ${params.paymentMethod}.`,
    });

    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: order.technicianId,
      type: "ORDER_PAID",
      title: "Pembayaran Diterima",
      body: `Pesanan ${order.orderNumber} telah dibayar. Anda dapat memulai pengerjaan.`,
      entityType: "order",
      entityId: order.id,
    });
  });

  return { paymentId, referenceNumber };
}

/**
 * 6. Update order status by technician (e.g. IN_PROGRESS, COMPLETED)
 */
export async function updateOrderStatusByTechnician(params: {
  orderId: string;
  technicianId: string;
  toStatus: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  reason?: string;
}) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, params.orderId),
  });

  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.technicianId !== params.technicianId) throw new Error("Akses ditolak.");

  if (!canTransitionOrder(order.status as OrderStatusType, params.toStatus)) {
    throw new Error(`Transisi status dari ${order.status} ke ${params.toStatus} tidak diperbolehkan.`);
  }

  await db.transaction(async (tx) => {
    const updateData: any = {
      status: params.toStatus,
      updatedAt: new Date(),
    };

    if (params.toStatus === "IN_PROGRESS") {
      updateData.startedAt = new Date();
    } else if (params.toStatus === "COMPLETED") {
      updateData.completedAt = new Date();
    } else if (params.toStatus === "CANCELLED") {
      updateData.cancelledAt = new Date();
    }

    await tx.update(schema.orders).set(updateData).where(eq(schema.orders.id, params.orderId));

    await tx.insert(schema.orderStatusHistory).values({
      id: `osh-${Date.now()}`,
      orderId: params.orderId,
      actorId: params.technicianId,
      fromStatus: order.status,
      toStatus: params.toStatus,
      reason: params.reason || `Status diperbarui menjadi ${params.toStatus}.`,
    });

    // Notify customer
    const notifTitle =
      params.toStatus === "IN_PROGRESS"
        ? "Teknisi Mulai Mengerjakan Servis"
        : params.toStatus === "COMPLETED"
        ? "Servis Telah Selesai! Berikan Ulasan Anda"
        : "Pesanan Telah Dibatalkan";

    const notifBody =
      params.toStatus === "COMPLETED"
        ? `Perbaikan ${order.deviceName} telah selesai. Silakan berikan ulasan dan rating untuk teknisi.`
        : `Status pesanan ${order.orderNumber} saat ini: ${params.toStatus}.`;

    await tx.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: order.customerId,
      type: `ORDER_${params.toStatus}`,
      title: notifTitle,
      body: notifBody,
      entityType: "order",
      entityId: order.id,
    });
  });
}

/**
 * 7. Get Order with Details for Customer (Omits commission & net payout)
 */
export async function getCustomerOrderWithDetails(orderId: string, customerId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, orderId),
    with: {
      customer: true,
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
      service: true,
      spareparts: true,
      additionalCharges: true,
      statusHistory: {
        orderBy: [desc(schema.orderStatusHistory.createdAt)],
      },
      payment: true,
      review: true,
    },
  });

  if (!order) return null;
  if (order.customerId !== customerId) throw new Error("Akses ditolak.");

  const { commissionRateSnapshot, commissionAmount, technicianNet, ...safeOrder } = order;
  return safeOrder;
}

/**
 * 7b. Get Order with Details for Technician & Admin (Includes full accounting & commission breakdown)
 */
export async function getTechnicianOrderWithDetails(orderId: string, technicianId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(schema.orders.id, orderId),
    with: {
      customer: true,
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
      service: true,
      spareparts: true,
      additionalCharges: true,
      statusHistory: {
        orderBy: [desc(schema.orderStatusHistory.createdAt)],
      },
      payment: true,
      review: true,
    },
  });

  if (!order) return null;
  if (order.technicianId !== technicianId) throw new Error("Akses ditolak.");

  return order;
}

/**
 * 8. Get Customer Orders
 */
export async function getCustomerOrders(customerId: string) {
  return await db.query.orders.findMany({
    where: eq(schema.orders.customerId, customerId),
    with: {
      technician: {
        with: {
          technicianProfile: true,
        },
      },
      category: true,
      service: true,
      payment: true,
      review: true,
    },
    orderBy: [desc(schema.orders.createdAt)],
  });
}

/**
 * 9. Get Technician Orders
 */
export async function getTechnicianOrders(technicianId: string) {
  return await db.query.orders.findMany({
    where: eq(schema.orders.technicianId, technicianId),
    with: {
      customer: true,
      category: true,
      service: true,
      payment: true,
    },
    orderBy: [desc(schema.orders.createdAt)],
  });
}
