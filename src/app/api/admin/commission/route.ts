import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updatePlatformCommissionRate } from "@/modules/admin/service";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak. Memerlukan hak akses Admin." } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { rate, reason } = body;

    if (rate === undefined || isNaN(Number(rate))) {
      return NextResponse.json(
        { error: { code: "INVALID_RATE", message: "Persentase komisi tidak valid." } },
        { status: 400 }
      );
    }

    await updatePlatformCommissionRate({
      newRate: Number(rate),
      changedBy: session.user.id,
      reason,
    });

    return NextResponse.json({
      success: true,
      message: `Persentase komisi berhasil diperbarui menjadi ${(Number(rate) * 100).toFixed(0)}%.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: err.message || "Gagal memperbarui komisi." } },
      { status: 400 }
    );
  }
}

