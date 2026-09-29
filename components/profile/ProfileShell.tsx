"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", href: "/profile", icon: LayoutDashboard },
  { label: "Companies", href: "/profile/companies", icon: BriefcaseBusiness },
  { label: "Jobs", href: "/profile/jobs", icon: FileText },
  { label: "Interviews", href: "/interviews", icon: UserRound },
  { label: "Courses", href: "/courses", icon: BookOpen },
];

function isActive(pathname: string, href: string) {
  return href === "/profile"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function ProfileShell({
  children,
  name,
  email,
  dateLabel,
}: {
  children: React.ReactNode;
  name: string;
  email: string;
  dateLabel: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-[208px] shrink-0 flex-col border-r border-white/10 bg-cream px-4 py-5 sm:flex">
          <Link
            href="/"
            aria-label="VibeSkill home"
            className="inline-flex w-fit"
          >
            <Image
              src="/images/logo.svg"
              alt="VibeSkill"
              width={150}
              height={38}
              priority
            />
          </Link>
          <nav aria-label="Main navigation" className="mt-10 grid gap-1">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-3 px-3 text-[12px] transition-colors ${
                    active
                      ? "bg-coral/15 font-semibold text-coral"
                      : "text-muted hover:bg-paper/60 hover:text-ink"
                  }`}
                >
                  <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-white/10 pt-4">
            <p className="truncate text-[12px] font-semibold">{name}</p>
            <p className="mt-1 truncate text-[10px] text-muted">{email}</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-14 items-center justify-between gap-3 border-b border-white/10 bg-cream px-4 sm:px-7">
            <div className="sm:hidden">
              <Link
                href="/"
                aria-label="VibeSkill home"
                className="inline-flex"
              >
                <Image
                  src="/images/logo.svg"
                  alt="VibeSkill"
                  width={120}
                  height={31}
                  priority
                />
              </Link>
            </div>
            <p className="hidden text-[11px] text-muted sm:block">My account</p>
            <p className="ml-auto text-right text-[10px] text-muted">
              {dateLabel}
            </p>
          </header>

          <nav
            aria-label="Mobile navigation"
            className="flex gap-1 overflow-x-auto border-b border-white/10 bg-cream px-3 py-2 sm:hidden"
          >
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 px-3 py-2 text-[10px] ${
                    active
                      ? "bg-coral/15 font-semibold text-coral"
                      : "text-muted"
                  }`}
                >
                  <Icon aria-hidden="true" size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {children}
        </div>
      </div>
    </div>
  );
}
