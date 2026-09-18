"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  FolderGit2,
  User,
  PlusCircle,
  LogOut,
  ShieldCheck,
  ArrowUpRight,
  Award,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {}
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Certificates", href: "/admin/certificates", icon: Award },
    { label: "New Project", href: "/admin/projects/new", icon: PlusCircle },
    { label: "Profile & Stack", href: "/admin/profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand + Nav Items */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            <div className="size-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
              <ShieldCheck className="size-4 shrink-0" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold font-heading leading-tight">Admin Console</span>
              <span className="text-[10px] text-zinc-400 font-mono">Portfolio CMS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Clean View Showcase + Theme + Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Exactly ONE clean, beautifully placed link to public showcase */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98] transition-all"
            title="View live public portfolio"
          >
            <span>View Showcase</span>
            <ArrowUpRight className="size-3.5 shrink-0 text-zinc-400" />
          </Link>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav sub-bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="size-3 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
