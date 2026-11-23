import { describe, it, expect } from "vitest";
import { canTransitionOrder, OrderStatus } from "./order";

describe("Order State Machine", () => {
  it("allows pending customer approval to transition to awaiting payment or rejected", () => {
    expect(canTransitionOrder(OrderStatus.PENDING_CUSTOMER_APPROVAL, OrderStatus.AWAITING_PAYMENT)).toBe(true);
    expect(canTransitionOrder(OrderStatus.PENDING_CUSTOMER_APPROVAL, OrderStatus.REJECTED)).toBe(true);
    expect(canTransitionOrder(OrderStatus.PENDING_CUSTOMER_APPROVAL, OrderStatus.CANCELLED)).toBe(true);
    // Invalid jump
    expect(canTransitionOrder(OrderStatus.PENDING_CUSTOMER_APPROVAL, OrderStatus.COMPLETED)).toBe(false);
  });

  it("allows awaiting payment to transition to paid", () => {
    expect(canTransitionOrder(OrderStatus.AWAITING_PAYMENT, OrderStatus.PAID)).toBe(true);
    expect(canTransitionOrder(OrderStatus.AWAITING_PAYMENT, OrderStatus.PAYMENT_FAILED)).toBe(true);
  });

  it("allows paid to transition to in progress", () => {
    expect(canTransitionOrder(OrderStatus.PAID, OrderStatus.IN_PROGRESS)).toBe(true);
  });

  it("allows in progress to transition to completed", () => {
    expect(canTransitionOrder(OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED)).toBe(true);
  });

  it("does not allow transition from completed", () => {
    expect(canTransitionOrder(OrderStatus.COMPLETED, OrderStatus.IN_PROGRESS)).toBe(false);
    expect(canTransitionOrder(OrderStatus.COMPLETED, OrderStatus.CANCELLED)).toBe(false);
  });
});

