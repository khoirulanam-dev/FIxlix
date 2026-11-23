import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak." } },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;
    const body = await req.json();
    const { storageKey, mimeType = "image/jpeg", sizeBytes = 0, kind = "OTHER" } = body;

    if (!storageKey) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "File gambar lampiran wajib diunggah." } },
        { status: 400 }
      );
    }

    const order = await db.query.orders.findFirst({
      where: eq(schema.orders.id, orderId),
    });

    if (!order) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Pesanan tidak ditemukan." } },
        { status: 404 }
      );
    }

    const isCustomer = order.customerId === session.user.id;
    const isTechnician = order.technicianId === session.user.id;
    const isAdmin = (session.user as any).role === "ADMIN";

    if (!isCustomer && !isTechnician && !isAdmin) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Anda tidak memiliki akses ke pesanan ini." } },
        { status: 403 }
      );
    }

    const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    await db.insert(schema.orderAttachments).values({
      id: attachmentId,
      orderId,
      uploadedBy: session.user.id,
      storageKey,
      mimeType,
      sizeBytes: Number(sizeBytes) || 0,
      kind: ["BEFORE", "PART", "DURING", "AFTER", "OTHER"].includes(kind) ? kind : "OTHER",
    });

    return NextResponse.json({ success: true, attachmentId });
  } catch (err: any) {
    console.error("Attachment error:", err);
    return NextResponse.json(
      { error: { code: "UPLOAD_FAILED", message: err.message || "Gagal menyimpan lampiran." } },
      { status: 500 }
    );
  }
}
