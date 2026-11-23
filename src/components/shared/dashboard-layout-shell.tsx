"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  Menu,
  X,
  Home,
  LogOut,
  Bell,
  ChevronRight,
  User as UserIcon,
  LucideIcon,
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  FolderKanban,
  DollarSign,
  Star,
  ShieldCheck,
  Percent,
  CreditCard,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth-client";

export type NavIconName =
  | "LayoutDashboard"
  | "ShoppingBag"
  | "PlusCircle"
  | "FolderKanban"
  | "DollarSign"
  | "Star"
  | "ShieldCheck"
  | "Percent"
  | "CreditCard"
  | "Users"
  | "Wrench";

const ICON_MAP: Record<NavIconName, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  FolderKanban,
  DollarSign,
  Star,
  ShieldCheck,
  Percent,
  CreditCard,
  Users,
  Wrench,
};

export interface NavItem {
  label: string;
  href: string;
  iconName: NavIconName;
  badge?: string | number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface DashboardLayoutShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
  roleLabel: string;
  roleBadgeColor?: string;
  navSections: NavSection[];
  children: React.ReactNode;
}

export function DashboardLayoutShell({
  user,
  roleLabel,
  roleBadgeColor = "bg-emerald-100 text-emerald-800",
  navSections,
  children,
}: DashboardLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/customer" || href === "/technician" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex flex-col antialiased">
      {/* 1. Desktop Fixed Sidebar - Classic CoolAdmin Style */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 z-50 bg-white border-r border-slate-200/90 shadow-sm">
        {/* CoolAdmin Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 bg-white">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Fixlix
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 text-white uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight block">
                Electronic Repair Portal
              </span>
            </div>
          </Link>
        </div>

        {/* User Mini Profile Badge (CoolAdmin Sidebar Profile Capsule) */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-200 border-2 border-white shadow-xs overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-1 space-y-5">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-emerald-600 text-white shadow-sm font-bold shadow-emerald-600/20"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-500"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2">
              <Home className="w-4 h-4 text-slate-400" />
              <span>Lihat Halaman Publik</span>
              <ExternalLink className="w-3 h-3 ml-auto text-slate-300" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Keluar Akun (Sign Out)</span>
          </Button>
        </div>
      </aside>

      {/* 2. Mobile Off-Canvas Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="h-18 flex items-center justify-between px-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-slate-900">Fixlix</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-600 text-xs">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${roleBadgeColor}`}>
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  {section.title && (
                    <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {section.title}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            active
                              ? "bg-emerald-600 text-white font-bold"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-500"}`} />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 space-y-2">
              <Link href="/" onClick={() => setSidebarOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-slate-600 gap-2">
                  <Home className="w-4 h-4" />
                  <span>Ke Beranda</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSidebarOpen(false);
                  handleSignOut();
                }}
                className="w-full justify-start text-xs text-red-600 gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Container (Pushed right by lg:pl-72) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* CoolAdmin Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-18 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 tracking-tight">
                Fixlix Workspace
              </div>
              <div className="text-[11px] text-slate-400">
                Sistem Servis Elektronik Rumah Tangga Terintegrasi
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* User Profile Pill Capsule */}
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">{user.role?.toLowerCase() || roleLabel.toLowerCase()}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Keluar Akun"
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl w-8 h-8"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* 4. Page Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
