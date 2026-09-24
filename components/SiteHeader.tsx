import Link from "next/link";
import VibeSkillLogo from "./VibeSkillLogo";

const links = [
  { label: "Jobs", href: "/jobs" },
  { label: "Resume lab", href: "/resume" },
  { label: "Courses", href: "/courses" },
  { label: "Interviews", href: "/interviews" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
      <div className="flex h-13 justify-between sm:h-20">
        <VibeSkillLogo />

        <nav
          className="hidden items-center gap-8 text-[12px] font-medium sm:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              className="relative py-2 text-muted transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-coral after:transition-transform hover:text-ink hover:after:scale-x-100"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="border border-white/30 px-4 py-2.5 transition-colors hover:bg-ink hover:text-paper"
            href="/interviews"
          >
            Start practicing{" "}
            <span className="ml-2 text-base" aria-hidden="true">
              ↗
            </span>
          </Link>
        </nav>

        <details className="group sm:hidden">
          <summary className="inline-flex list-none items-center gap-2 border border-white/30 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.08em] marker:hidden">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
            <span
              className="text-base leading-none group-open:hidden"
              aria-hidden="true"
            >
              +
            </span>
            <span
              className="hidden text-base leading-none group-open:inline"
              aria-hidden="true"
            >
              ×
            </span>
          </summary>
          <nav
            id="mobile-navigation"
            className="absolute inset-x-0 top-full border-b border-white/15 bg-paper px-5 py-5 shadow-[0_14px_30px_rgba(0,0,0,.35)] sm:hidden"
            aria-label="Mobile navigation"
          >
            <div className="grid gap-1">
              {links.map((link, index) => (
                <Link
                  className="flex items-center justify-between border-b border-ink/10 py-4 font-display text-2xl tracking-[-0.04em]"
                  href={link.href}
                  key={link.href}
                >
                  <span>{link.label}</span>
                  <span
                    className="font-sans text-lg text-coral"
                    aria-hidden="true"
                  >
                    0{index + 1} ↗
                  </span>
                </Link>
              ))}
            </div>
            <Link
              className="mt-5 flex items-center justify-between bg-ink px-4 py-3 text-[12px] font-bold text-paper"
              href="/interviews"
            >
              Start practicing{" "}
              <span className="text-base" aria-hidden="true">
                ↗
              </span>
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
