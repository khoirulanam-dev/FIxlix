import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

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
    const { categoryId, title, description, laborBasePrice, imageKey } = body;

    if (!categoryId || !title || !description || laborBasePrice === undefined) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Data tidak lengkap." } },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const serviceId = `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    await db.insert(schema.technicianServices).values({
      id: serviceId,
      technicianId: session.user.id,
      categoryId,
      slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
      title,
      description,
      laborBasePrice: Number(laborBasePrice),
      imageKey: imageKey || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
      isActive: true,
    });

    return NextResponse.json({ success: true, serviceId });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: err.message || "Gagal membuat layanan." } },
      { status: 400 }
    );
  }
}

