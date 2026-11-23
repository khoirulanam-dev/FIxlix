/**
 * Fixlix Core Domain - Order State Machine & Validation
 *
 * Canonical States:
 * - PENDING_CUSTOMER_APPROVAL: Technician created custom order, waiting customer approval
 * - REJECTED: Customer rejected the custom order
 * - AWAITING_PAYMENT: Customer approved custom order or ordered direct service; ready for checkout
 * - PAID: Customer completed simulated payment
 * - IN_PROGRESS: Technician started working on the device
 * - COMPLETED: Service finished; customer is eligible to review
 * - CANCELLED: Order cancelled before completion
 * - PAYMENT_FAILED: Simulated payment failure
 */

export const OrderStatus = {
  PENDING_CUSTOMER_APPROVAL: "PENDING_CUSTOMER_APPROVAL",
  REJECTED: "REJECTED",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  PAID: "PAID",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_LABELS: Record<OrderStatusType, string> = {
  PENDING_CUSTOMER_APPROVAL: "Menunggu Persetujuan Pelanggan",
  REJECTED: "Ditolak Pelanggan",
  AWAITING_PAYMENT: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  IN_PROGRESS: "Dalam Pengerjaan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  PAYMENT_FAILED: "Pembayaran Gagal",
};

export const ORDER_STATUS_VARIANTS: Record<OrderStatusType, "default" | "secondary" | "destructive" | "warning" | "success"> = {
  PENDING_CUSTOMER_APPROVAL: "warning",
  REJECTED: "destructive",
  AWAITING_PAYMENT: "warning",
  PAID: "default",
  IN_PROGRESS: "secondary",
  COMPLETED: "success",
  CANCELLED: "destructive",
  PAYMENT_FAILED: "destructive",
};

export function getOrderStatusLabel(status: string): string {
  return (ORDER_STATUS_LABELS as Record<string, string>)[status] || status;
}

export function getOrderStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "warning" | "success" {
  return (ORDER_STATUS_VARIANTS as Record<string, any>)[status] || "default";
}

/**
 * Valid transitions by actor role
 */
export const ALLOWED_TRANSITIONS: Record<OrderStatusType, OrderStatusType[]> = {
  PENDING_CUSTOMER_APPROVAL: ["AWAITING_PAYMENT", "REJECTED", "CANCELLED"],
  REJECTED: [], // Terminal or requires new revision
  AWAITING_PAYMENT: ["PAID", "PAYMENT_FAILED", "CANCELLED"],
  PAID: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [], // Terminal
  CANCELLED: [], // Terminal
  PAYMENT_FAILED: ["AWAITING_PAYMENT", "CANCELLED"],
};

export function canTransitionOrder(from: OrderStatusType, to: OrderStatusType): boolean {
  const allowed = ALLOWED_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}
