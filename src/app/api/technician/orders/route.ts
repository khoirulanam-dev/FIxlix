import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createCustomOrder, updateOrderStatusByTechnician } from "@/modules/orders/service";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "TECHNICIAN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak." } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      customerId,
      categoryId,
      serviceId,
      deviceName,
      description,
      laborFee,
      spareparts,
      otherCharges,
      otherChargesDescription,
      technicianNotes,
    } = body;

    if (!customerId || !categoryId || !deviceName || !description || laborFee === undefined) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Data pesanan tidak lengkap." } },
        { status: 400 }
      );
    }

    const result = await createCustomOrder({
      technicianId: session.user.id,
      customerId,
      categoryId,
      serviceId,
      deviceName,
      description,
      laborFee: Number(laborFee),
      spareparts: spareparts || [],
      otherCharges: Number(otherCharges) || 0,
      otherChargesDescription,
      technicianNotes,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "ORDER_CREATION_FAILED", message: err.message || "Gagal membuat order kustom." } },
      { status: 400 }
    );
  }
}

