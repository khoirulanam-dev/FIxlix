import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, image } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Nama lengkap wajib diisi." } },
        { status: 400 }
      );
    }

    await db
      .update(schema.users)
      .set({
        name: name.trim(),
        phone: phone?.trim() || null,
        image: image || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Update customer profile error:", err);
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: err.message || "Gagal memperbarui profil." } },
      { status: 500 }
    );
  }
}

