import React from "react";
import { requireRole } from "@/lib/auth/session";
import { DashboardLayoutShell, NavSection } from "@/components/shared/dashboard-layout-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["ADMIN"]);

  const navSections: NavSection[] = [
    {
      title: "Manajemen Eksekutif",
      items: [
        {
          label: "Overview & Laporan",
          href: "/admin",
          iconName: "LayoutDashboard",
        },
        {
          label: "Kelola & Verifikasi Teknisi",
          href: "/admin/teknisi",
          iconName: "ShieldCheck",
        },
        {
          label: "Semua Pesanan",
          href: "/admin/orders",
          iconName: "ShoppingBag",
        },
      ],
    },
    {
      title: "Akuntansi & Finansial",
      items: [
        {
          label: "Pengaturan Komisi Platform",
          href: "/admin/komisi",
          iconName: "Percent",
        },
        {
          label: "Transaksi & Rekonsiliasi",
          href: "/admin/pembayaran",
          iconName: "CreditCard",
        },
      ],
    },
  ];

  return (
    <DashboardLayoutShell
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: "ADMIN",
      }}
      roleLabel="Administrator"
      roleBadgeColor="bg-purple-100 text-purple-800 border border-purple-200"
      navSections={navSections}
    >
      {children}
    </DashboardLayoutShell>
  );
}
