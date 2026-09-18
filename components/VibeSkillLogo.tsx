import Link from "next/link";

type VibeSkillLogoProps = {
  compact?: boolean;
};

export default function VibeSkillLogo({ compact = false }: VibeSkillLogoProps) {
  return (
    <Link
      href="/"
      aria-label="VibeSkill home"
      className="group inline-flex items-center gap-3 rounded-xl decoration-transparent outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-coral"
    >
      {/* Dynamic Animated Logo Mark */}
      <div className="relative flex items-center justify-center">
        {/* Glowing Background Blur */}
        <div className="absolute -inset-1 rounded-2xl bg-coral/50 opacity-70 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:blur-lg" />

        {/* Main Icon Container */}
        <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl transition-transform duration-300 group-hover:scale-105">
          {/* Subtle Inner Mesh Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-coral/25 via-transparent to-teal/20" />

          {/* Animated Vibe Waves & Spark Emblem */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="z-10 size-6 text-white"
          >
            <defs>
              <linearGradient
                id="vibeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ff6b4a" />
                <stop offset="100%" stopColor="#8bd3c7" />
              </linearGradient>
            </defs>

            {/* Abstract "V" Vibe Wave */}
            <path
              d="M4 7L10.5 17.5C11.3 18.8 12.7 18.8 13.5 17.5L20 7"
              stroke="url(#vibeGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-300 group-hover:stroke-white"
            />

            {/* Spark Center Skill Pulse */}
            <path
              d="M12 3V6M12 18V21M3 12H6M18 12H21"
              stroke="url(#vibeGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="origin-center opacity-40 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
            />
          </svg>
        </div>
      </div>

      {/* Wordmark Section */}
      {!compact && (
        <span className="flex items-center text-xl font-extrabold tracking-tight text-ink">
          Vibe
          <span className="text-coral transition-all duration-300 group-hover:brightness-125">
            Skill
          </span>
          <span className="ml-1 inline-block size-1.5 rounded-full bg-teal" />
        </span>
      )}
    </Link>
  );
}
