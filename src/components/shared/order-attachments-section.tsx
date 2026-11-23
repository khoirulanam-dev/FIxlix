"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Camera, Plus, Loader2, Image as ImageIcon, ChevronDown } from "lucide-react";

interface AttachmentItem {
  id: string;
  storageKey: string;
  kind: string;
  createdAt: Date | string;
  uploadedBy: string;
}

interface OrderAttachmentsSectionProps {
  orderId: string;
  attachments?: AttachmentItem[];
  canUpload?: boolean;
}

const KIND_LABELS: Record<string, { label: string; color: string }> = {
  BEFORE: { label: "Kondisi Kerusakan Awal", color: "bg-amber-100 text-amber-800 border-amber-200" },
  PART: { label: "Foto Sparepart / Komponen", color: "bg-blue-100 text-blue-800 border-blue-200" },
  DURING: { label: "Proses Pengerjaan", color: "bg-purple-100 text-purple-800 border-purple-200" },
  AFTER: { label: "Bukti Servis Selesai", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  OTHER: { label: "Dokumentasi Tambahan", color: "bg-slate-100 text-slate-800 border-slate-200" },
};

export function OrderAttachmentsSection({
  orderId,
  attachments = [],
  canUpload = true,
}: OrderAttachmentsSectionProps) {
  const router = useRouter();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [kind, setKind] = useState<string>("BEFORE");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveAttachment = async () => {
    if (!imageUrl) {
      setError("Silakan pilih dan unggah foto terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/attachments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageKey: imageUrl,
          kind,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal menyimpan foto lampiran.");
      }

      setImageUrl("");
      setShowUploadForm(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Dokumentasi & Foto Perangkat
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Foto bukti fisik kondisi barang, penggantian sparepart, dan hasil reparasi teknisi
          </p>
        </div>

        {canUpload && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="rounded-xl text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 gap-1.5 shadow-2xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>{showUploadForm ? "Tutup Form Unggah" : "Unggah Foto Baru"}</span>
          </Button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Upload Form (Expandable) */}
        {showUploadForm && (
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Unggah Foto Lampiran Servis
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Kategori Dokumentasi Foto *
              </label>
              <div className="relative max-w-xs">
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BEFORE">Kondisi Kerusakan Awal</option>
                  <option value="PART">Foto Komponen / Sparepart</option>
                  <option value="DURING">Proses Reparasi</option>
                  <option value="AFTER">Bukti Servis Selesai</option>
                  <option value="OTHER">Dokumentasi Lainnya</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <ImageUpload
              label="Pilih File Foto"
              description="Pilih foto bukti dari kamera atau galeri perangkat Anda (JPG, PNG, WEBP maks 5 MB)."
              value={imageUrl}
              onChange={setImageUrl}
              onRemove={() => setImageUrl("")}
            />

            {error && (
              <p className="text-xs text-red-600 font-medium">{error}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                onClick={handleSaveAttachment}
                disabled={submitting || !imageUrl}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-9 px-4"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Lampiran Foto"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowUploadForm(false);
                  setImageUrl("");
                }}
                disabled={submitting}
                className="text-xs text-slate-500 hover:bg-slate-100 rounded-xl h-9"
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        {/* Attachments Grid */}
        {attachments && attachments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((item) => {
              const meta = KIND_LABELS[item.kind] || KIND_LABELS.OTHER;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50 group shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-900/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.storageKey}
                      alt={meta.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 bg-white space-y-1.5 border-t border-slate-100">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                    <p className="text-xs text-slate-500">
                      Diunggah: {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">
              Belum ada foto dokumentasi untuk pesanan ini
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Unggah foto kondisi awal perangkat atau hasil pengerjaan untuk transparansi perbaikan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
