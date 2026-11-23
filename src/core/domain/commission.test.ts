import { describe, it, expect } from "vitest";
import { calculatePricing, DEFAULT_COMMISSION_RATE } from "./commission";

describe("Commission & Pricing Calculation", () => {
  it("calculates 25% default commission on labor only", () => {
    const result = calculatePricing({
      laborFee: 100000,
      partsTotal: 50000,
      otherCharges: 10000,
    });

    expect(result.commissionRate).toBe(0.25);
    expect(result.commissionAmount).toBe(25000);
    // customer_total = 100k + 50k + 10k = 160k
    expect(result.customerTotal).toBe(160000);
    // technician_net = 100k - 25k + 50k + 10k = 135k
    expect(result.technicianNet).toBe(135000);
  });

  it("excludes spare parts and other charges from commission", () => {
    const result = calculatePricing({
      laborFee: 200000,
      partsTotal: 150000,
      otherCharges: 20000,
      commissionRate: 0.25,
    });

    // Commission is 25% of 200k = 50k
    expect(result.commissionAmount).toBe(50000);
    expect(result.customerTotal).toBe(370000);
    // 200k - 50k + 150k + 20k = 320k
    expect(result.technicianNet).toBe(320000);
  });

  it("handles zero parts and other charges correctly (direct service)", () => {
    const result = calculatePricing({
      laborFee: 75000,
    });

    expect(result.commissionAmount).toBe(Math.round(75000 * 0.25));
    expect(result.customerTotal).toBe(75000);
    expect(result.technicianNet).toBe(75000 - Math.round(75000 * 0.25));
  });

  it("handles custom commission rate (e.g. 20%)", () => {
    const result = calculatePricing({
      laborFee: 100000,
      partsTotal: 0,
      otherCharges: 0,
      commissionRate: 0.20,
    });

    expect(result.commissionAmount).toBe(20000);
    expect(result.customerTotal).toBe(100000);
    expect(result.technicianNet).toBe(80000);
  });

  it("rounds properly to integer Rupiah without floating point drift", () => {
    const result = calculatePricing({
      laborFee: 133333,
      partsTotal: 25555,
      otherCharges: 1111,
      commissionRate: 0.25,
    });

    expect(Number.isInteger(result.commissionAmount)).toBe(true);
    expect(Number.isInteger(result.customerTotal)).toBe(true);
    expect(Number.isInteger(result.technicianNet)).toBe(true);
    expect(result.commissionAmount).toBe(Math.round(133333 * 0.25));
  });
});

