import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateOrderStatusByTechnician } from "@/modules/orders/service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "TECHNICIAN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak." } },
        { status: 403 }
      );
    }

    const { id: orderId } = await params;
    const body = await req.json();
    const { status, reason } = body;

    if (!["IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: { code: "INVALID_STATUS", message: "Status tidak valid." } },
        { status: 400 }
      );
    }

    await updateOrderStatusByTechnician({
      orderId,
      technicianId: session.user.id,
      toStatus: status,
      reason,
    });

    return NextResponse.json({ success: true, message: `Status berhasil diubah ke ${status}` });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: err.message || "Gagal memperbarui status." } },
      { status: 400 }
    );
  }
}

