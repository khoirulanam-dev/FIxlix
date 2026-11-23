import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Hanya Admin yang dapat menambahkan akun teknisi." } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, password, serviceAreaText, bio } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Nama, email, dan kata sandi wajib diisi." } },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: { code: "INVALID_PASSWORD", message: "Kata sandi minimal 8 karakter." } },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase().trim()));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: { code: "EMAIL_EXISTS", message: "Email ini sudah terdaftar di sistem." } },
        { status: 400 }
      );
    }

    const userId = `usr-tech-${nanoid(8)}`;
    const cleanWa = (phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62");
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = `${baseSlug || "teknisi"}-${nanoid(6)}`;

    // 1. Simpan Pengguna (role TECHNICIAN)
    await db.insert(schema.users).values({
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      emailVerified: true,
      phone: cleanWa || null,
      role: "TECHNICIAN",
      status: "ACTIVE",
    });

    // 2. Hash Password dan simpan ke Accounts
    const hashedPassword = await hashPassword(password);
    await db.insert(schema.accounts).values({
      id: `acc-${userId}`,
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
    });

    // 3. Buat Profil Teknisi (Status langsung VERIFIED oleh Admin)
    await db.insert(schema.technicianProfiles).values({
      userId,
      slug,
      displayName: name.trim(),
      whatsappPhone: cleanWa || "628000000000",
      bio: bio?.trim() || `Teknisi profesional siap melayani perbaikan peralatan elektronik dengan diagnosa jujur & transparan.`,
      serviceAreaText: serviceAreaText?.trim() || "Jabodetabek",
      verificationStatus: "VERIFIED",
    });

    return NextResponse.json({
      success: true,
      message: "Akun teknisi baru berhasil dibuat dan diverifikasi.",
      data: { id: userId, name, email, slug },
    });
  } catch (err: any) {
    console.error("Admin create technician error:", err);
    return NextResponse.json(
      { error: { code: "CREATE_FAILED", message: err.message || "Gagal membuat akun teknisi." } },
      { status: 500 }
    );
  }
}

