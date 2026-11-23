import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateTechnicianVerification } from "@/modules/admin/service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Akses ditolak." } },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["VERIFIED", "REJECTED", "SUSPENDED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { error: { code: "INVALID_STATUS", message: "Status verifikasi tidak valid." } },
        { status: 400 }
      );
    }

    await updateTechnicianVerification({
      userId,
      status,
      adminId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: `Status verifikasi teknisi berhasil diubah ke ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: "UPDATE_FAILED", message: err.message || "Gagal memperbarui status teknisi." } },
      { status: 400 }
    );
  }
}

