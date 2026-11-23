"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ChevronDown,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/customer" || href === "/technician" || href === "/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
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
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block">
                Fixlix
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-tight block">
                Electronic Repair Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
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
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
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
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden touch-none">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[84vw] max-w-[320px] h-[100dvh] max-h-[100dvh] bg-white shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-left duration-200 border-r border-slate-200 overflow-hidden overscroll-contain">
            {/* Top Area: Header + User Profile + Navigation */}
            <div className="flex flex-col shrink-0">
              {/* Drawer Brand Header */}
              <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-slate-900 block leading-tight">Fixlix</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Portal Servis</span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card - Placed at TOP to utilize the upper space naturally */}
              <div className="p-4 border-b border-slate-150 bg-slate-50/80">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 truncate leading-snug">{user.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    <div className="mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${roleBadgeColor}`}>
                        {roleLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <div className="px-4 py-4 space-y-4">
                {navSections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    {section.title && (
                      <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {section.title}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                              active
                                ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-500"}`} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge !== undefined && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  active ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
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

                {/* Quick Link to Home */}
                <div className="pt-2 border-t border-slate-100">
                  <Link href="/" onClick={() => setSidebarOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-3 rounded-xl font-medium px-3.5 py-2.5 h-auto">
                      <Home className="w-4.5 h-4.5 text-slate-400" />
                      <span>Lihat Halaman Publik</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Section: Sign Out Button strictly anchored at bottom */}
            <div className="p-4 border-t border-slate-150 bg-slate-50/80 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSidebarOpen(false);
                  handleSignOut();
                }}
                className="w-full justify-start text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 gap-3 rounded-xl px-3.5 py-3 h-auto"
              >
                <LogOut className="w-4.5 h-4.5 text-red-500" />
                <span>Keluar Akun (Sign Out)</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Container (Pushed right by lg:pl-72) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* CoolAdmin Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
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
              <div className="text-xs text-slate-400">
                Sistem Servis Elektronik Rumah Tangga Terintegrasi
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* User Profile Dropdown Capsule */}
            <div className="relative pl-3 sm:pl-4 border-l border-slate-200" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs">
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
                  <div className="text-xs text-slate-500 capitalize font-medium">
                    {user.role?.toLowerCase() || roleLabel.toLowerCase()}
                  </div>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180 text-slate-700" : ""
                  }`}
                />
              </button>

              {/* Floating Profile Dropdown Menu */}
              {userMenuOpen && (
                <>
                  {/* Backdrop overlay for mobile to prevent accidental taps underneath and provide visual separation */}
                  <div
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] sm:hidden"
                    onClick={() => setUserMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl bg-white shadow-2xl shadow-slate-900/25 border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User details header */}
                    <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/90 rounded-t-2xl -mt-2 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-emerald-800 text-sm shadow-2xs">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900 truncate">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        <div className="mt-1">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block ${roleBadgeColor}`}>
                            {roleLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1 text-xs font-medium text-slate-700 bg-white">
                      <Link
                        href="/"
                        onClick={() => setUserMenuOpen(false)}
                        className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                            <Home className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">Halaman Publik Utama</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </Link>

                      {user.role === "CUSTOMER" && (
                        <>
                          <Link
                            href="/customer/profil"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">Profil & Foto Saya</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          </Link>
                          <Link
                            href="/customer/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">Pesanan Servis Saya</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          </Link>
                        </>
                      )}

                      {user.role === "TECHNICIAN" && (
                        <>
                          <Link
                            href="/technician/profil"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">Profil & Foto Saya</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          </Link>
                          <Link
                            href="/technician/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">Kelola Pesanan</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          </Link>
                        </>
                      )}

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">Semua Pesanan</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </Link>
                      )}
                    </div>

                    {/* Logout Action */}
                    <div className="pt-2 mt-1 border-t border-slate-100 px-2 bg-white rounded-b-2xl">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-red-100/60 text-red-600 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span>Keluar Akun (Sign Out)</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-red-300 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 4. Page Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
