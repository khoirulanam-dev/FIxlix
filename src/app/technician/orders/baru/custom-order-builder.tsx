"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { calculatePricing } from "@/core/domain/commission";
import { Plus, Trash2, Loader2, Sparkles, AlertCircle, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUpload } from "@/components/ui/image-upload";
import { CustomSelect } from "@/components/ui/custom-select";

interface CustomerOption {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ServiceOption {
  id: string;
  title: string;
  categoryId: string;
  laborBasePrice: number;
}

interface CustomOrderBuilderProps {
  customers: CustomerOption[];
  categories: CategoryOption[];
  services: ServiceOption[];
  defaultCommissionRate: number;
}

interface SparepartItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export function CustomOrderBuilder({
  customers,
  categories,
  services,
  defaultCommissionRate,
}: CustomOrderBuilderProps) {
  const router = useRouter();

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || "");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [description, setDescription] = useState("");
  const [technicianNotes, setTechnicianNotes] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  // Monetary inputs
  const [laborFee, setLaborFee] = useState<number>(100000);
  const [spareparts, setSpareparts] = useState<SparepartItem[]>([]);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [otherChargesDescription, setOtherChargesDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter services by selected category
  const filteredServices = useMemo(() => {
    return services.filter((s) => s.categoryId === selectedCategoryId);
  }, [services, selectedCategoryId]);

  // Handle service change
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    if (serviceId) {
      const s = services.find((x) => x.id === serviceId);
      if (s) {
        setLaborFee(s.laborBasePrice);
      }
    }
  };

  // Add sparepart item
  const addSparepart = () => {
    setSpareparts([...spareparts, { name: "", quantity: 1, unitPrice: 0 }]);
  };

  // Update sparepart item
  const updateSparepart = (index: number, field: keyof SparepartItem, val: any) => {
    const updated = [...spareparts];
    updated[index] = { ...updated[index], [field]: val };
    setSpareparts(updated);
  };

  // Remove sparepart item
  const removeSparepart = (index: number) => {
    setSpareparts(spareparts.filter((_, i) => i !== index));
  };

  // Calculate spareparts total
  const partsTotal = useMemo(() => {
    return spareparts.reduce((sum, sp) => sum + (sp.quantity * (sp.unitPrice || 0)), 0);
  }, [spareparts]);

  // LIVE PRICING & COMMISSION PREVIEW
  const pricing = useMemo(() => {
    return calculatePricing({
      laborFee,
      partsTotal,
      otherCharges,
      commissionRate: defaultCommissionRate,
    });
  }, [laborFee, partsTotal, otherCharges, defaultCommissionRate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCustomerId) {
      setError("Silakan pilih pelanggan yang dituju.");
      return;
    }
    if (!deviceName.trim()) {
      setError("Silakan isi nama perangkat yang diservis.");
      return;
    }
    if (!description.trim()) {
      setError("Silakan isi deskripsi perbaikan dan kesepakatan.");
      return;
    }
    if (laborFee < 0) {
      setError("Biaya jasa tidak boleh bernilai negatif.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/technician/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          categoryId: selectedCategoryId,
          serviceId: selectedServiceId || undefined,
          deviceName,
          description,
          laborFee,
          spareparts: spareparts.filter((sp) => sp.name.trim() !== ""),
          otherCharges,
          otherChargesDescription: otherCharges > 0 ? otherChargesDescription : undefined,
          technicianNotes,
          attachmentUrl: attachmentUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal membuat custom order.");
      }

      router.push(`/technician/orders/${data.orderId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 1. Customer & Category Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          1. Data Pelanggan & Kategori Elektronik
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            id="customer"
            label="Pilih Pelanggan Terdaftar"
            required
            searchable
            value={selectedCustomerId}
            onChange={setSelectedCustomerId}
            options={customers.map((c) => ({
              value: c.id,
              label: c.name,
              description: `${c.email}${c.phone ? ` • ${c.phone}` : ""}`,
            }))}
          />

          <CustomSelect
            id="category"
            label="Kategori Peralatan"
            required
            value={selectedCategoryId}
            onChange={(val) => {
              setSelectedCategoryId(val);
              setSelectedServiceId("");
            }}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </div>

        {/* Optional service reference */}
        {filteredServices.length > 0 && (
          <CustomSelect
            id="service"
            label="Rujukan Layanan Katalog Anda (Opsional)"
            value={selectedServiceId}
            onChange={handleServiceChange}
            placeholder="-- Tanpa Rujukan Katalog (Custom Penuh) --"
            options={[
              { value: "", label: "-- Tanpa Rujukan Katalog (Custom Penuh) --" },
              ...filteredServices.map((s) => ({
                value: s.id,
                label: s.title,
                description: `Jasa dasar: ${formatRupiah(s.laborBasePrice)}`,
              })),
            ]}
          />
        )}

        <div className="space-y-1.5">
          <Label htmlFor="deviceName">Nama & Tipe Lengkap Perangkat *</Label>
          <Input
            id="deviceName"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Contoh: AC Daikin 1 PK FTKC25 / TV LED Samsung 43 Inch UA43T6500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Deskripsi Kerusakan & Kesepakatan WhatsApp *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan rangkuman hasil konsultasi WhatsApp, masalah pada alat, dan rencana pengerjaan..."
            rows={3}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Catatan Tambahan untuk Pelanggan (Opsional)</Label>
          <Input
            id="notes"
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            placeholder="Contoh: Estimasi waktu 2 jam, garansi servis 30 hari"
          />
        </div>

        <ImageUpload
          label="Foto Kondisi Perangkat / Kerusakan (Opsional)"
          description="Unggah foto fisik kondisi alat dari konsultasi WhatsApp. Format JPG, PNG, WEBP maks 5 MB."
          value={attachmentUrl}
          onChange={setAttachmentUrl}
          onRemove={() => setAttachmentUrl("")}
        />
      </div>

      {/* 2. Itemized Costs (Labor, Parts, Other Charges) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          2. Rincian Biaya (Jasa, Sparepart, Biaya Tambahan)
        </h3>

        {/* Labor fee */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center">
            <Label htmlFor="laborFee" className="font-bold text-slate-900">
              Biaya Jasa Pengerjaan Teknisi (Labor Fee) *
            </Label>
            <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
              Dikenakan Komisi Platform 25%
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tentukan nominal upah kerja Anda sendiri tanpa batasan preset.
          </p>
          <div className="relative mt-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
              Rp
            </span>
            <Input
              id="laborFee"
              type="number"
              min={0}
              step={5000}
              value={laborFee}
              onChange={(e) => setLaborFee(Number(e.target.value) || 0)}
              className="pl-12 font-bold text-slate-900 text-base"
              required
            />
          </div>
        </div>

        {/* Spareparts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Daftar Komponen Sparepart (Opsional)
              </h4>
              <p className="text-xs text-emerald-700 font-medium">
                *Sparepart 0% komisi platform (100% diteruskan ke teknisi)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSparepart}
              className="gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Item</span>
            </Button>
          </div>

          {spareparts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
              Tidak ada penggantian sparepart. Klik "Tambah Item" jika ada penggantian komponen.
            </div>
          ) : (
            <div className="space-y-2">
              {spareparts.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="col-span-5">
                    <Input
                      placeholder="Nama sparepart (misal: Kapasitor 45uF)"
                      value={item.name}
                      onChange={(e) => updateSparepart(idx, "name", e.target.value)}
                      className="text-xs h-9 bg-white"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateSparepart(idx, "quantity", Number(e.target.value) || 1)}
                      className="text-xs h-9 bg-white text-center"
                      required
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="Harga satuan (Rp)"
                      value={item.unitPrice}
                      onChange={(e) => updateSparepart(idx, "unitPrice", Number(e.target.value) || 0)}
                      className="text-xs h-9 bg-white"
                      required
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeSparepart(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other charges */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              Biaya Tambahan Operasional (Opsional)
            </h4>
            <p className="text-xs text-emerald-700 font-medium">
              *Biaya tambahan 0% komisi platform (misal: transport luar area)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="otherCharges">Nominal (Rp)</Label>
              <Input
                id="otherCharges"
                type="number"
                min={0}
                step={1000}
                value={otherCharges}
                onChange={(e) => setOtherCharges(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="otherDesc">Keterangan Biaya Tambahan</Label>
              <Input
                id="otherDesc"
                value={otherChargesDescription}
                onChange={(e) => setOtherChargesDescription(e.target.value)}
                placeholder="Contoh: Ongkos transport ke lokasi luar jangkauan"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. REALTIME ACCOUNTING & COMMISSION PREVIEW */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-white text-base">
            Live Preview Perhitungan Akuntansi & Komisi
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          {/* Customer Perspective */}
          <div className="space-y-3 rounded-2xl bg-slate-800/80 p-5 border border-slate-700">
            <div className="font-bold text-slate-300 text-xs uppercase tracking-wider">
              Tampilan Tagihan Pelanggan (Customer View)
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Biaya Jasa:</span>
                <span className="font-mono">{formatRupiah(pricing.laborFee)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Sparepart:</span>
                <span className="font-mono">{formatRupiah(pricing.partsTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Biaya Tambahan:</span>
                <span className="font-mono">{formatRupiah(pricing.otherCharges)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-bold text-white text-sm">
                <span>Total Dibayar Pelanggan:</span>
                <span className="font-mono text-emerald-400 text-base">{formatRupiah(pricing.customerTotal)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic">
              *Pelanggan hanya melihat total ini dan rincian item, tidak pernah melihat komisi platform.
            </p>
          </div>

          {/* Technician Perspective */}
          <div className="space-y-3 rounded-2xl bg-slate-800/80 p-5 border border-emerald-500/30">
            <div className="font-bold text-emerald-400 text-xs uppercase tracking-wider">
              Rincian Pendapatan Anda (Technician Net)
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Biaya Jasa Dasar:</span>
                <span className="font-mono">{formatRupiah(pricing.laborFee)}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Komisi Platform ({(pricing.commissionRate * 100).toFixed(0)}%):</span>
                <span className="font-mono">- {formatRupiah(pricing.commissionAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sparepart (100% Anda):</span>
                <span className="font-mono">+ {formatRupiah(pricing.partsTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Biaya Tambahan (100% Anda):</span>
                <span className="font-mono">+ {formatRupiah(pricing.otherCharges)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-bold text-white text-sm">
                <span>Estimasi Bersih Anda:</span>
                <span className="font-mono text-emerald-300 text-lg">{formatRupiah(pricing.technicianNet)}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-12 text-base shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Menerbitkan Custom Order...
            </>
          ) : (
            "Kirim Order ke Akun Pelanggan"
          )}
        </Button>
      </div>
    </form>
  );
}

