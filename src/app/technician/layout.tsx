import React from "react";
import { requireRole } from "@/lib/auth/session";
import { DashboardLayoutShell, NavSection } from "@/components/shared/dashboard-layout-shell";

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["TECHNICIAN", "ADMIN"]);

  const navSections: NavSection[] = [
    {
      title: "Operasional Servis",
      items: [
        {
          label: "Dashboard Teknisi",
          href: "/technician",
          iconName: "LayoutDashboard",
        },
        {
          label: "Kelola Pesanan",
          href: "/technician/orders",
          iconName: "ShoppingBag",
        },
        {
          label: "Katalog Layanan",
          href: "/technician/layanan",
          iconName: "FolderKanban",
        },
      ],
    },
    {
      title: "Akuntansi & Reputasi",
      items: [
        {
          label: "Pendapatan & Komisi",
          href: "/technician/pendapatan",
          iconName: "DollarSign",
        },
        {
          label: "Ulasan Pelanggan",
          href: "/technician/reviews",
          iconName: "Star",
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
        role: "TECHNICIAN",
      }}
      roleLabel="Teknisi"
      roleBadgeColor="bg-emerald-100 text-emerald-800 border border-emerald-200"
      navSections={navSections}
    >
      {children}
    </DashboardLayoutShell>
  );
}
