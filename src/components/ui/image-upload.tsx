"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, ImagePlus, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  description?: string;
  aspectRatio?: "square" | "video" | "auto";
  disabled?: boolean;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Foto",
  description = "Format JPG, PNG, atau WEBP. Maksimal ukuran file 5 MB.",
  aspectRatio = "video",
  disabled = false,
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError(null);

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file melebihi batas 5 MB.");
      return;
    }

    // Validate type
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Format file tidak didukung. Harap upload gambar JPG, PNG, atau WEBP.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal mengunggah gambar.");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // reset input so the same file can be re-uploaded if replaced
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    if (disabled || uploading) return;
    onChange("");
    if (onRemove) onRemove();
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square max-w-[240px]"
      : aspectRatio === "video"
      ? "aspect-video w-full max-w-xl"
      : "min-h-[180px] w-full";

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {value && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Foto Terunggah
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        disabled={disabled || uploading}
      />

      {value ? (
        /* Preview Card */
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 shadow-xs max-w-xl">
          <div className={`${aspectClass} relative overflow-hidden bg-slate-900/5`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview Unggahan"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Overlay */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 truncate font-mono max-w-[220px] sm:max-w-xs">
              {value}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="text-xs h-8 px-3 rounded-xl border-slate-300 hover:bg-slate-50"
              >
                Ganti Foto
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="text-xs h-8 px-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Hapus
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Placeholder */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !uploading) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !uploading) fileInputRef.current?.click();
          }}
          className={`relative ${aspectClass} rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none ${
            isDragOver
              ? "border-emerald-500 bg-emerald-50/60 shadow-sm"
              : "border-slate-300 hover:border-emerald-500/80 hover:bg-slate-50/80 bg-slate-50/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {uploading ? (
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Mengunggah gambar...</p>
                <p className="text-xs text-slate-500 mt-0.5">Menyimpan berkas ke penyimpanan server</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <ImagePlus className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  <span className="text-emerald-700 hover:underline">Klik untuk memilih foto</span> atau seret file ke sini
                </p>
                <p className="text-xs text-slate-400 mt-1">{description}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold border-slate-300 bg-white shadow-2xs hover:bg-slate-50 pointer-events-none"
              >
                Pilih Berkas Foto
              </Button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
