"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/employers", label: "Employers", icon: Building2 },
  { href: "/admin/jobs", label: "Job listings", icon: BriefcaseBusiness },
];

export default function AdminShell({
  children,
  title,
  eyebrow = "Administration",
}: {
  children: ReactNode;
  title: string;
  eyebrow?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-shell min-h-screen w-screen bg-[#f5f7fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-y-auto bg-[#101828] text-slate-300">
        <div className="border-b border-white/10 px-7 py-6">
          <p className="text-sm font-bold tracking-wide text-white">
            VibeSkill
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Admin console
          </p>
        </div>
        <nav className="px-4 py-7" aria-label="Admin navigation">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          <div className="space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/admin" && pathname.startsWith(`${href}/`));
              return (
                <a
                  className={`admin-nav-item ${active ? "admin-nav-item-active" : ""}`}
                  href={href}
                  key={href}
                >
                  <Icon size={17} />
                  {label}
                </a>
              );
            })}
          </div>
          <p className="px-3 pb-3 pt-9 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            System
          </p>
          <div className="space-y-1">
            <a className="admin-nav-item" href="/admin">
              <ShieldCheck size={17} /> Access control
            </a>
          </div>
        </nav>
        <div className="mt-auto m-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold text-white">Admin workspace</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Review users, employers, and published roles.
          </p>
        </div>
      </aside>
      <div className="min-h-screen w-full pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-semibold text-slate-400">
              Workspace / {title}
            </p>
            <p className="text-sm font-bold text-slate-800">{eyebrow}</p>
          </div>
          <button
            className="flex items-center gap-3"
            onClick={() => signOut({ callbackUrl: "/login" })}
            type="button"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dff5ef] text-xs font-bold text-[#18756a]">
              AD
            </span>
            <span className="hidden text-left sm:block">
              <strong className="block text-xs text-slate-800">
                Admin account
              </strong>
              <small className="block text-[11px] text-slate-400">
                Workspace owner
              </small>
            </span>
            <ChevronDown className="hidden text-slate-400 sm:block" size={15} />
            <LogOut className="text-slate-400 sm:hidden" size={16} />
          </button>
        </header>
        <main className="w-full px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
