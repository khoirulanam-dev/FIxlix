/**
 * Fixlix Core Domain - Commission & Price Calculation
 *
 * Locked Business Rules:
 * - Default commission rate is 25% (0.25).
 * - Commission is applied ONLY to labor/service fee (biaya jasa).
 * - Spare parts (sparepart) and other charges (biaya tambahan) are NEVER subject to commission.
 * - All monetary values are integer Rupiah.
 *
 * Formulas:
 * commission = Math.round(labor_fee * commission_rate)
 * customer_total = labor_fee + parts_total + other_charges
 * technician_net = labor_fee - commission + parts_total + other_charges
 */

export interface PricingInput {
  laborFee: number;
  partsTotal?: number;
  otherCharges?: number;
  commissionRate?: number; // e.g. 0.25 for 25%
}

export interface PricingBreakdown {
  laborFee: number;
  partsTotal: number;
  otherCharges: number;
  commissionRate: number;
  commissionAmount: number;
  customerTotal: number;
  technicianNet: number;
}

export const DEFAULT_COMMISSION_RATE = 0.25;

export function calculatePricing(input: PricingInput): PricingBreakdown {
  const laborFee = Math.max(0, Math.round(Number(input.laborFee) || 0));
  const partsTotal = Math.max(0, Math.round(Number(input.partsTotal) || 0));
  const otherCharges = Math.max(0, Math.round(Number(input.otherCharges) || 0));
  const commissionRate = input.commissionRate !== undefined && input.commissionRate >= 0
    ? input.commissionRate
    : DEFAULT_COMMISSION_RATE;

  // Commission is calculated only on labor fee
  const commissionAmount = Math.round(laborFee * commissionRate);

  // Total payable by customer
  const customerTotal = laborFee + partsTotal + otherCharges;

  // Technician net earnings
  const technicianNet = (laborFee - commissionAmount) + partsTotal + otherCharges;

  return {
    laborFee,
    partsTotal,
    otherCharges,
    commissionRate,
    commissionAmount,
    customerTotal,
    technicianNet,
  };
}

