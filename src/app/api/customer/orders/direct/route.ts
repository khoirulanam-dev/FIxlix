import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createDirectOrder } from "@/modules/orders/service";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Silakan masuk terlebih dahulu." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { serviceId, deviceName, description, customerNotes } = body;

    if (!serviceId || !deviceName || !description) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Data pesanan tidak lengkap." } },
        { status: 400 }
      );
    }

    const result = await createDirectOrder({
      customerId: session.user.id,
      serviceId,
      deviceName,
      description,
      customerNotes,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "ORDER_CREATION_FAILED", message: err.message || "Gagal membuat pesanan." } },
      { status: 500 }
    );
  }
}

