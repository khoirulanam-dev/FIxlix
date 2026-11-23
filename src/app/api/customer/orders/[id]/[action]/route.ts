import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { acceptOrder, rejectOrder, processSimulatedPayment } from "@/modules/orders/service";
import { createReview } from "@/modules/reviews/service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Silakan masuk terlebih dahulu." } },
        { status: 401 }
      );
    }

    const { id: orderId, action } = await params;
    const body = await req.json().catch(() => ({}));

    if (action === "accept") {
      await acceptOrder(orderId, session.user.id);
      return NextResponse.json({ success: true, message: "Pesanan berhasil disetujui." });
    }

    if (action === "reject") {
      await rejectOrder(orderId, session.user.id, body.reason);
      return NextResponse.json({ success: true, message: "Pesanan berhasil ditolak." });
    }

    if (action === "pay") {
      const { paymentMethod } = body;
      if (!paymentMethod) {
        return NextResponse.json(
          { error: { code: "INVALID_METHOD", message: "Pilih metode pembayaran." } },
          { status: 400 }
        );
      }
      const result = await processSimulatedPayment({
        orderId,
        customerId: session.user.id,
        paymentMethod,
      });
      return NextResponse.json({ success: true, ...result });
    }

    if (action === "review") {
      const { rating, comment } = body;
      const result = await createReview({
        orderId,
        customerId: session.user.id,
        rating: Number(rating),
        comment,
      });
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Aksi tidak ditemukan." } },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "ACTION_FAILED", message: err.message || "Gagal memproses aksi." } },
      { status: 400 }
    );
  }
}

