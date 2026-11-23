import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "TECHNICIAN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak." } },
        { status: 401 }
      );
    }

    const techUser = await db.query.users.findFirst({
      where: eq(schema.users.id, session.user.id),
      with: {
        technicianProfile: true,
      },
    });

    if (!techUser) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Profil tidak ditemukan." } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: techUser,
      profile: techUser.technicianProfile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "FETCH_FAILED", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "TECHNICIAN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { displayName, bio, whatsappPhone, serviceAreaText, profileImageKey } = body;

    if (!displayName?.trim() || !bio?.trim() || !whatsappPhone?.trim()) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Nama, deskripsi/bio, dan nomor WhatsApp wajib diisi." } },
        { status: 400 }
      );
    }

    // Clean whatsapp phone: format to 628...
    const cleanWa = whatsappPhone.replace(/[^0-9]/g, "").replace(/^0/, "62");

    // Update technician profile
    await db
      .update(schema.technicianProfiles)
      .set({
        displayName: displayName.trim(),
        bio: bio.trim(),
        whatsappPhone: cleanWa,
        serviceAreaText: serviceAreaText?.trim() || null,
        profileImageKey: profileImageKey || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.technicianProfiles.userId, session.user.id));

    // Also sync user avatar & phone
    await db
      .update(schema.users)
      .set({
        name: displayName.trim(),
        phone: cleanWa,
        image: profileImageKey || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Update technician profile error:", err);
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: err.message || "Gagal memperbarui profil." } },
      { status: 500 }
    );
  }
}

