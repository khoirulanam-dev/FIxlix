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
          label: "Buat Custom Order",
          href: "/technician/orders/baru",
          iconName: "PlusCircle",
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
      roleBadgeColor="bg-blue-100 text-blue-800 border border-blue-200"
      navSections={navSections}
    >
      {children}
    </DashboardLayoutShell>
  );
}
