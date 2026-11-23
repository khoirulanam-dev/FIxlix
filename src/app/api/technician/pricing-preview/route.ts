import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { calculatePricing } from "@/core/domain/commission";
import { getActiveCommissionRate } from "@/modules/orders/service";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "TECHNICIAN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Hanya teknisi yang dapat melihat kalkulasi preview." } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { laborFee, partsTotal, otherCharges } = body;

    const commissionRate = await getActiveCommissionRate();
    const breakdown = calculatePricing({
      laborFee: Number(laborFee) || 0,
      partsTotal: Number(partsTotal) || 0,
      otherCharges: Number(otherCharges) || 0,
      commissionRate,
    });

    return NextResponse.json(breakdown);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "CALCULATION_ERROR", message: err.message } },
      { status: 400 }
    );
  }
}

