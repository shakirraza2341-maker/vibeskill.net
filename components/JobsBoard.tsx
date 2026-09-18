"use client";

import { useEffect, useMemo, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  employment_type: string;
  salary_min?: number | null;
  salary_max?: number | null;
  description1: string;
  description2: string;
  category: string;
  remote: boolean;
  posted_at: string;
  skills: string[];
};

type JobsBoardProps = { jobs: Job[]; isUsingFallback: boolean };
const JOBS_PER_PAGE = 5;

const normalizeCountry = (country: string) => {
  const normalized = country.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    {
      us: "unitedstates",
      usa: "unitedstates",
      unitedstatesofamerica: "unitedstates",
      uk: "unitedkingdom",
      gb: "unitedkingdom",
    }[normalized] || normalized
  );
};

const formatSalary = (job: Job) => {
  if (!job.salary_min && !job.salary_max) return "Salary not disclosed";
  const format = (amount: number) => `$${Math.round(amount / 1000)}k`;
  if (job.salary_min && job.salary_max)
    return `${format(job.salary_min)} - ${format(job.salary_max)}`;
  return `${format(job.salary_min || job.salary_max || 0)}+`;
};

const relativeDate = (date: string, now: number | null) => {
  if (now === null) return "Recently posted";
  const days = Math.max(
    0,
    Math.floor((now - new Date(date).getTime()) / 86400000),
  );
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

export default function JobsBoard({ jobs, isUsingFallback }: JobsBoardProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All locations");
  const [type, setType] = useState("All job types");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(jobs[0]?.id || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [isLoadingCountry, setIsLoadingCountry] = useState(true);

  useEffect(() => {
    async function fetchUserCountry() {
      try {
        const res = await fetch("https://ipapi.co/country/", {
          headers: { Accept: "text/plain" },
        });
        if (!res.ok) throw new Error(`Country lookup failed: ${res.status}`);
        const countryCode = (await res.text()).trim();
        if (!/^[A-Za-z]{2}$/.test(countryCode)) {
          throw new Error("Country lookup returned an invalid country code");
        }

        const countryName = new Intl.DisplayNames(["en"], {
          type: "region",
        }).of(countryCode.toUpperCase());
        if (countryName) setUserCountry(countryName);
      } catch (error) {
        console.warn("Could not detect the user's country:", error);
        setUserCountry(null);
      } finally {
        setIsLoadingCountry(false);
      }
    }

    fetchUserCountry();
  }, []);

  const locations = useMemo(
    () => [
      "All locations",
      ...Array.from(new Set(jobs.map((job) => job.location))),
    ],
    [jobs],
  );
  const types = useMemo(
    () => [
      "All job types",
      ...Array.from(new Set(jobs.map((job) => job.employment_type))),
    ],
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return jobs.filter((job) => {
      const searchable =
        `${job.title} ${job.company} ${job.description1} ${job.category} ${job.skills.join(" ")}`.toLowerCase();

      const normalizedUserCountry = userCountry
        ? normalizeCountry(userCountry)
        : null;
      const matchesCountry =
        !normalizedUserCountry ||
        location !== "All locations" ||
        normalizeCountry(job.country) === normalizedUserCountry;

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (location === "All locations" || job.location === location) &&
        (type === "All job types" || job.employment_type === type) &&
        (!remoteOnly || job.remote) &&
        matchesCountry
      );
    });
  }, [jobs, location, query, remoteOnly, type, userCountry]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / JOBS_PER_PAGE),
  );
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [currentPage, filteredJobs]);

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [location, query, remoteOnly, type, userCountry]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginationItems = useMemo<(number | "ellipsis")[]>(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([
      1,
      totalPages,
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ]);
    const visiblePages = Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((first, second) => first - second);
    const items: (number | "ellipsis")[] = [];

    visiblePages.forEach((page, index) => {
      if (index > 0 && page - visiblePages[index - 1] > 1) {
        items.push("ellipsis");
      }
      items.push(page);
    });

    return items;
  }, [currentPage, totalPages]);

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedId) || filteredJobs[0];
  const visibleSelectedId = selectedJob?.id || "";

  return (
    <div className="pb-1">
      <div className="mt-8 grid grid-cols-[1.45fr_1fr_auto] gap-2 bg-cream p-2.5 shadow-[10px_10px_0_var(--color-teal)] max-[620px]:mt-6 max-[620px]:grid-cols-1 max-[620px]:gap-2 max-[620px]:p-2 max-[620px]:shadow-[7px_7px_0_var(--color-teal)]">
        <div className="flex min-h-12 items-center gap-2.5 border border-ink/15 bg-paper px-3.5">
          <span
            aria-hidden="true"
            className="text-[23px] leading-none text-coral"
          >
            ⌕
          </span>
          <label className="sr-only" htmlFor="job-query">
            Search jobs
          </label>
          <input
            id="job-query"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Job title, skills, or company"
            value={query}
            className="w-full bg-transparent py-3.5 text-[13px] text-ink outline-none placeholder:text-muted"
          />
        </div>
        <div className="flex min-h-12 items-center gap-2.5 border border-ink/15 bg-paper px-3.5">
          <span
            aria-hidden="true"
            className="text-[23px] leading-none text-coral"
          >
            ⌖
          </span>
          <label className="sr-only" htmlFor="job-location">
            Location
          </label>
          <select
            id="job-location"
            onChange={(event) => setLocation(event.target.value)}
            value={location}
            className="w-full cursor-pointer bg-transparent py-3.5 text-[13px] text-ink outline-none"
          >
            {locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-coral px-5 text-left text-xs font-bold text-paper max-[620px]:min-h-12"
          type="button"
        >
          Search jobs{" "}
          <span aria-hidden="true" className="ml-4 text-[17px]">
            ↗
          </span>
        </button>
      </div>
      <aside
        className="pt-14 pr-7 max-[900px]:pr-5 max-[620px]:border-b max-[620px]:border-ink/20 max-[620px]:pb-7 max-[620px]:pt-11"
        aria-label="Job filters"
      >
        <div className="mb-7 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.08em]">
          <span>Filter results</span>
          <button
            type="button"
            className="bg-transparent p-0 font-mono text-[10px] uppercase tracking-[.08em] text-coral"
            onClick={() => {
              setQuery("");
              setLocation("All locations");
              setType("All job types");
              setRemoteOnly(false);
            }}
          >
            Clear all
          </button>
        </div>

        {userCountry && (
          <div className="mb-4 font-mono text-xs text-coral">
            Showing roles for: <strong>{userCountry}</strong>
          </div>
        )}

        <label className="flex items-center gap-2 text-xs">
          <input
            checked={remoteOnly}
            onChange={(event) => setRemoteOnly(event.target.checked)}
            className="accent-coral"
            type="checkbox"
          />
          <span>Remote only</span>
        </label>
        <div className="mt-11 flex gap-2 text-xs leading-relaxed text-muted max-[620px]:hidden">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-coral" />
          New Roles Are Added Daily.
        </div>
      </aside>

      <div className="grid grid-cols-[minmax(180px,300px)_minmax(0,1fr)] items-start gap-0 pb-24 max-[900px]:grid-cols-[minmax(160px,260px)_minmax(0,1fr)] max-[620px]:block">
        <section
          className="border-r border-ink/15 pr-8 pt-14 max-[900px]:pr-6 max-[620px]:border-0 max-[620px]:pr-0 max-[620px]:pt-7"
          aria-label="Available jobs"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[.12em] text-coral">
                Open positions
              </span>
              <h2 className="mt-2 font-display text-[14px] font-medium leading-none tracking-[-.055em] max-[620px]:text-[25px]">
                {filteredJobs.length} roles found
              </h2>
            </div>
            <span className="pt-1.5 text-xs text-muted">Newest first</span>
          </div>
          <div className="mt-7 grid gap-2">
            {isLoadingCountry ? (
              <div className="p-4 text-xs text-muted">
                Detecting your region...
              </div>
            ) : filteredJobs.length ? (
              paginatedJobs.map((job) => (
                <button
                  aria-pressed={visibleSelectedId === job.id}
                  className={`group relative w-full border p-5 text-left text-ink transition-all hover:-translate-y-0.5 hover:border-coral max-[620px]:p-4 ${visibleSelectedId === job.id ? "border-coral bg-cream shadow-[5px_5px_0_var(--color-coral)]" : "border-ink/15 bg-transparent"}`}
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  type="button"
                >
                  <span className="flex justify-between font-mono text-[10px] uppercase tracking-[.08em] text-muted">
                    <span
                      className={
                        visibleSelectedId === job.id ? "text-coral" : ""
                      }
                    >
                      {job.company}
                    </span>
                    <span>{relativeDate(job.posted_at, currentTime)}</span>
                  </span>
                  <strong className="mt-4 block font-display text-[27px] font-medium leading-none tracking-[-.04em]">
                    {job.title}
                  </strong>
                  <span className="mt-3 block text-xs text-muted">
                    {job.location} <i className="not-italic">·</i>{" "}
                    {job.employment_type}
                  </span>
                  <span className="mt-5 block text-xs font-bold text-coral">
                    {formatSalary(job)}{" "}
                    <span className="ml-2 text-base" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div className="border border-ink/15 p-6 text-sm">
                <strong>No roles match those filters.</strong>
                <button
                  className="mt-2 block text-xs text-coral underline"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setLocation("All locations");
                    setType("All job types");
                    setRemoteOnly(false);
                    setUserCountry(null);
                  }}
                >
                  Reset search & view all countries
                </button>
              </div>
            )}
          </div>
          {filteredJobs.length > JOBS_PER_PAGE && (
            <nav
              className="mt-6 flex items-center justify-between gap-3 border-t border-ink/15 pt-4"
              aria-label="Job list pagination"
            >
              <button
                className="bg-transparent p-0 text-xs font-bold text-ink disabled:cursor-not-allowed disabled:text-muted"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                Previous
              </button>
              <div className="flex items-center gap-1" aria-label="Pages">
                {paginationItems.map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      className="grid size-7 place-items-center text-xs text-muted"
                      key={`ellipsis-${index}`}
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      aria-current={currentPage === item ? "page" : undefined}
                      className={`grid size-7 place-items-center text-xs ${currentPage === item ? "bg-coral font-bold text-paper" : "bg-transparent text-muted hover:text-ink"}`}
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
              <button
                className="bg-transparent p-0 text-xs font-bold text-ink disabled:cursor-not-allowed disabled:text-muted"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                type="button"
              >
                Next
              </button>
            </nav>
          )}
        </section>

        <article
          className="min-w-0 px-8 pt-14 max-[900px]:px-6 max-[620px]:mt-9 max-[620px]:border-t max-[620px]:px-0 max-[620px]:pt-9"
          aria-label="Job details"
        >
          {selectedJob ? (
            <>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[.12em] text-coral">
                    {selectedJob.category}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[.1em] text-muted">
                    Selected role
                  </span>
                </div>
                <span className="float-right grid size-12 place-items-center bg-ink font-mono text-xs text-paper">
                  VS
                </span>
                <h1 className="mt-5 max-w-2xl font-display text-[clamp(44px,5vw,76px)] font-medium leading-[.92] tracking-[-.055em]">
                  {selectedJob.title}
                </h1>
                <p className="mt-5 text-sm text-muted">
                  {selectedJob.company} <i className="not-italic">·</i>{" "}
                  {selectedJob.location}
                </p>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-6 border-y border-ink/15 py-5">
                <div className="grid gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[.08em] text-muted">
                    Compensation
                  </span>
                  <strong className="text-sm">
                    {formatSalary(selectedJob)}
                  </strong>
                </div>
                <div className="grid gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[.08em] text-muted">
                    Role type
                  </span>
                  <strong className="text-sm">
                    {selectedJob.employment_type}
                  </strong>
                </div>
              </div>
              <div className="mt-10 max-w-2xl text-[15px] leading-relaxed text-muted">
                <p>{selectedJob.description1}</p>
                <p className="mt-5">{selectedJob.description2}</p>
                <h2 className="mt-10 font-display text-3xl font-medium tracking-[-.04em] text-ink">
                  What you&apos;ll bring
                </h2>
                <ul className="mt-5 grid gap-3 text-sm text-ink">
                  {selectedJob.skills.map((skill) => (
                    <li
                      className="before:mr-3 before:text-coral before:content-['↗']"
                      key={skill}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="mt-10 bg-ink px-5 py-4 text-left text-[13px] font-bold text-paper"
                type="button"
              >
                Apply for this role{" "}
                <span aria-hidden="true" className="ml-8 text-lg">
                  ↗
                </span>
              </button>
            </>
          ) : (
            <div className="border border-ink/15 p-6 text-sm">
              <strong>Select a role to see the details.</strong>
            </div>
          )}
        </article>
      </div>
      {isUsingFallback && (
        <p className="mb-12 mt-[-55px] font-mono text-[9px] text-muted max-[620px]:mb-11 max-[620px]:mt-[-44px]">
          Preview roles shown. Connect MongoDB Atlas to load your live openings.
        </p>
      )}
    </div>
  );
}
