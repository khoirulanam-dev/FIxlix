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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth-client";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
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
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex">
      {/* 1. Desktop Fixed Sidebar (CoolAdmin Style) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 z-50 bg-white border-r border-slate-200/90 shadow-sm">
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 leading-none">
                Fixlix
              </div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                Servis Elektronik
              </div>
            </div>
          </Link>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleBadgeColor}`}>
            {roleLabel}
          </span>
        </div>

        {/* User Mini Profile in Sidebar */}
        <div className="p-4 mx-4 mt-4 mb-2 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
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
              <span>Halaman Depan Publik</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar Akun</span>
          </Button>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="text-xl font-black text-slate-900">Fixlix</div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 mx-4 mt-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{roleLabel}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
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
                      const Icon = item.icon;
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
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Fixlix Workspace
              </span>
              <span className="text-base font-extrabold text-slate-900 leading-tight">
                {roleLabel} Panel
              </span>
            </div>
          </div>

          {/* Right Area: Actions, User Card */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="text-xs font-medium text-slate-600 gap-1.5 rounded-xl border-slate-200">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Web Publik</span>
              </Button>
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            {/* User Capsule */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-xs">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-snug">{user.name}</div>
                <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">{roleLabel}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
