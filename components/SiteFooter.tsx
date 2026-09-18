import Link from "next/link";
import VibeSkillLogo from "./VibeSkillLogo";

const links = [
  { label: "Jobs", href: "/jobs" },
  { label: "Courses", href: "/courses" },
  { label: "Interviews", href: "/interviews" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/15 py-8 sm:py-10">
      <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end">
        <div>
          <div className="mb-3">
            <VibeSkillLogo />
          </div>
          <p className="max-w-[260px] text-sm leading-relaxed text-muted">
            A better conversation with your future.
          </p>
        </div>
        <nav className="grid gap-3 text-sm" aria-label="Footer navigation">
          {links.map((link) => (
            <Link
              className="w-fit text-muted transition-colors hover:text-coral"
              href={link.href}
              key={link.href}
            >
              {link.label} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted sm:text-right">
          <p>Practice with purpose</p>
          <p className="mt-2">© 2026 VibeSkill</p>
        </div>
      </div>
    </footer>
  );
}
