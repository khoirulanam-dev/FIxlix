import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getAdminMetrics } from "@/modules/admin/service";
import { formatDate } from "@/lib/utils";
import { Percent, History, ShieldAlert, ChevronRight } from "lucide-react";
import { CommissionForm } from "./commission-form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default async function AdminCommissionPage() {
  await requireRole(["ADMIN"]);
  const metrics = await getAdminMetrics();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/admin" className="hover:text-emerald-600 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-medium">Pengaturan Komisi</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Komisi Platform & Snapshot Historis
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Konfigurasi besaran komisi marketplace. Komisi hanya dikenakan pada biaya jasa (labor fee), dan tidak mempengaruhi pesanan lama (immutable snapshot).
        </p>
      </div>

      {/* Current Setting & Update Form */}
      <CommissionForm currentRate={metrics.currentCommissionRate} />

      {/* Immutable Snapshot Notice */}
      <Alert variant="warning">
        <AlertTitle className="text-amber-950">Prinsip Integritas Akuntansi Transaksi</AlertTitle>
        <AlertDescription className="text-amber-900 leading-relaxed">
          Setiap order menyimpan snapshot persentase komisi (<code className="bg-amber-100/90 px-1.5 py-0.5 rounded font-mono text-xs">commission_rate_snapshot</code>) saat pesanan dibuat. Perubahan persentase komisi di atas hanya akan berlaku untuk pesanan baru di masa mendatang, sehingga data akuntansi dan histori keuangan masa lalu tetap valid dan tidak berubah.
        </AlertDescription>
      </Alert>

      {/* Versioned History Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900">
            Riwayat Pembaruan Tarif Komisi (Audit Trail)
          </h2>
        </div>

        {metrics.commissionHistory.length === 0 ? (
          <div className="text-xs text-slate-500 p-6">
            Tarif komisi masih menggunakan nilai default awal 25% (0.2500).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-4">Tanggal Efektif</th>
                  <th className="py-3 px-4 font-mono">Persentase</th>
                  <th className="py-3 px-4">Alasan Pembaruan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {metrics.commissionHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-800">{formatDate(h.effectiveAt)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {(Number(h.rate) * 100).toFixed(0)}% ({h.rate})
                    </td>
                    <td className="py-3 px-4 text-slate-600">{h.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
