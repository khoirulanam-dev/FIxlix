import React from "react";
import { requireRole } from "@/lib/auth/session";
import { DashboardLayoutShell, NavSection } from "@/components/shared/dashboard-layout-shell";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole(["CUSTOMER", "ADMIN"]);

  const navSections: NavSection[] = [
    {
      title: "Menu Pelanggan",
      items: [
        {
          label: "Dashboard Ringkasan",
          href: "/customer",
          iconName: "LayoutDashboard",
        },
        {
          label: "Pesanan Servis Saya",
          href: "/customer/orders",
          iconName: "ShoppingBag",
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
        role: "CUSTOMER",
      }}
      roleLabel="Pelanggan"
      roleBadgeColor="bg-emerald-100 text-emerald-800 border border-emerald-200"
      navSections={navSections}
    >
      {children}
    </DashboardLayoutShell>
  );
}
