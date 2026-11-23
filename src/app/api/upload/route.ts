import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Silakan masuk untuk mengunggah gambar." } },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: { code: "FILE_REQUIRED", message: "File gambar tidak ditemukan." } },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES[file.type]) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_FILE_TYPE",
            message: "Format file tidak didukung. Harap upload gambar JPG, PNG, atau WEBP.",
          },
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: {
            code: "FILE_TOO_LARGE",
            message: "Ukuran file terlalu besar. Maksimum ukuran gambar adalah 5 MB.",
          },
        },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TYPES[file.type] || "jpg";
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const filename = `img-${uniqueSuffix}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: {
          code: "UPLOAD_FAILED",
          message: error.message || "Gagal mengunggah gambar. Silakan coba kembali.",
        },
      },
      { status: 500 }
    );
  }
}
