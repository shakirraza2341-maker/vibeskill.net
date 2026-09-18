import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function Home() {
  return (
    <div className="home-page min-h-screen bg-black">
      <SiteHeader />

      <main>
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="home-hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" /> The smarter way to move forward
            </p>
            <h1 id="hero-title">
              Find work that feels <em>like you.</em>
            </h1>
            <p className="hero-description">
              Discover roles worth showing up for, then build the confidence to
              make them yours.
            </p>
            <form className="job-search" action="/jobs" method="get">
              <label htmlFor="role-search">
                Search by role, skill, or company
              </label>
              <div className="job-search-fields">
                <div className="search-input-wrap">
                  <span aria-hidden="true">⌕</span>
                  <input
                    id="role-search"
                    name="q"
                    placeholder="e.g. Product designer"
                  />
                </div>
                <div className="search-input-wrap location-input">
                  <span aria-hidden="true">⌖</span>
                  <input name="location" placeholder="Anywhere" />
                </div>
                <button type="submit">
                  Search roles <span aria-hidden="true">↗</span>
                </button>
              </div>
            </form>
            <div className="hero-proof">
              <span className="proof-avatars" aria-hidden="true">
                <i>JD</i>
                <i>MK</i>
                <i>+</i>
              </span>
              <span>Join 12,000+ people preparing for their next move.</span>
            </div>
          </div>
          <div
            className="hero-panel"
            aria-label="A preview of the VibeSkill job search experience"
          >
            <div className="hero-panel-top">
              <span>CURATED FOR YOU</span>
              <span className="live-dot">LIVE</span>
            </div>
            <div className="hero-panel-content">
              <p className="panel-kicker">YOUR NEXT MOVE</p>
              <h2>
                Good work is
                <br />
                <em>out there.</em>
              </h2>
              <p>Roles matched to your ambition, not just your keywords.</p>
            </div>
            <div className="role-preview">
              <span className="company-mark">P</span>
              <div>
                <strong>Senior Product Designer</strong>
                <small>Porter · Remote · $145k–$175k</small>
              </div>
              <span className="arrow-link" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="hero-panel-note">
              01 / 04 <span>Hand-picked opportunities</span>
            </div>
          </div>
        </section>

        <section
          className="home-stats"
          aria-label="VibeSkill platform statistics"
        >
          <div>
            <strong>12k+</strong>
            <span>active candidates</span>
          </div>
          <div>
            <strong>840</strong>
            <span>open opportunities</span>
          </div>
          <div>
            <strong>4.9/5</strong>
            <span>practice room rating</span>
          </div>
          <div>
            <strong>86%</strong>
            <span>feel more prepared</span>
          </div>
        </section>

        <section className="featured-section" aria-labelledby="featured-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Opportunities</p>
              <h2 id="featured-title">
                Roles with <em>range.</em>
              </h2>
            </div>
            <Link className="inline-link" href="/jobs">
              Browse all roles <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="role-grid">
            {[
              [
                "Product designer",
                "Porter",
                "Remote · Full-time",
                "$145k–$175k",
                "P",
              ],
              [
                "Frontend engineer",
                "Morrow",
                "New York · Hybrid",
                "$130k–$160k",
                "M",
              ],
              [
                "Content strategist",
                "Good Kind",
                "London · Hybrid",
                "£68k–£82k",
                "G",
              ],
            ].map(([title, company, details, salary, mark], index) => (
              <Link className="role-card" href="/jobs" key={title}>
                <div className="role-card-top">
                  <span className="company-mark">{mark}</span>
                  <span className="role-number">0{index + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{company}</p>
                <div className="role-card-bottom">
                  <span>{details}</span>
                  <strong>{salary}</strong>
                </div>
                <span className="card-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="practice-banner below-fold"
          aria-labelledby="practice-title"
        >
          <div>
            <p className="eyebrow">02 / Your unfair advantage</p>
            <h2 id="practice-title">
              A better interview
              <br />
              <em>starts before it.</em>
            </h2>
            <p>
              Turn job descriptions into focused practice. Our AI interviewer
              helps you find the words, sharpen your story, and walk in ready.
            </p>
            <Link className="primary-action" href="/interviews">
              Practice for a role <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="practice-steps">
            <div>
              <span>01</span>
              <strong>Paste a job description</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Practice the real questions</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Show up as yourself</strong>
            </div>
          </div>
        </section>

        <section className="home-closing below-fold">
          <p className="eyebrow">Ready when you are</p>
          <h2>
            The next chapter
            <br />
            <em>has your name on it.</em>
          </h2>
          <Link className="round-action" href="/jobs" aria-label="Explore jobs">
            ↗
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
