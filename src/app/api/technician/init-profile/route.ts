import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Silakan login terlebih dahulu." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { displayName, whatsappPhone, serviceAreaText, bio } = body;

    // Pastikan user memiliki role TECHNICIAN
    await db
      .update(schema.users)
      .set({ role: "TECHNICIAN" })
      .where(eq(schema.users.id, session.user.id));

    const cleanWa = (whatsappPhone || (session.user as any).phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62");
    const name = displayName || session.user.name || "Teknisi";
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = `${baseSlug || "teknisi"}-${nanoid(6)}`;

    await db
      .insert(schema.technicianProfiles)
      .values({
        userId: session.user.id,
        slug,
        displayName: name,
        whatsappPhone: cleanWa || "628000000000",
        bio: bio?.trim() || "Teknisi mitra Fixlix siap membantu reparasi peralatan elektronik Anda.",
        serviceAreaText: serviceAreaText?.trim() || "Jabodetabek",
        verificationStatus: "VERIFIED",
      })
      .onConflictDoUpdate({
        target: schema.technicianProfiles.userId,
        set: {
          displayName: name,
          whatsappPhone: cleanWa || "628000000000",
          serviceAreaText: serviceAreaText?.trim() || "Jabodetabek",
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true, slug });
  } catch (err: any) {
    console.error("Init technician profile error:", err);
    return NextResponse.json(
      { error: { code: "INIT_FAILED", message: err.message || "Gagal menginisialisasi profil teknisi." } },
      { status: 500 }
    );
  }
}

