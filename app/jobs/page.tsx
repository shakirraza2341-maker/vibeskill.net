import JobsBoard from "../../components/JobsBoard";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export const dynamic = "force-dynamic";

const previewJobs = [
  {
    id: "preview-1",
    title: "Senior Product Designer",
    company: "VibeSkill",
    location: "New York, NY",
    employment_type: "Full-time",
    salary_min: 125000,
    salary_max: 165000,
    description1:
      "Lead the product design practice for a new kind of interview preparation. You will turn complex coaching moments into calm, clear experiences that help people do their best work.",
    description2:
      "You will collaborate with cross-functional teams to define and execute the design vision for our products.",
    category: "Design",
    country: "United States",
    remote: true,
    posted_at: "2026-09-04T09:00:00.000Z",
    skills: ["Product strategy", "Figma", "Design systems", "User research"],
  },
  {
    id: "preview-2",
    title: "Full-stack Engineer",
    company: "VibeSkill",
    location: "Remote",
    employment_type: "Full-time",
    salary_min: 140000,
    salary_max: 185000,
    description1:
      "Build the systems behind thoughtful practice. You will work across our Next.js product, AI features, and data layer with a small, senior team.",
    description2:
      "You will collaborate with cross-functional teams to define and execute the design vision for our products.",
    category: "Engineering",
    country: "United States",
    remote: true,
    posted_at: "2026-09-02T09:00:00.000Z",
    skills: ["TypeScript", "Next.js", "MongoDB", "APIs"],
  },
  {
    id: "preview-3",
    title: "Career Content Lead",
    company: "VibeSkill",
    location: "Austin, TX",
    employment_type: "Full-time",
    salary_min: 90000,
    salary_max: 120000,
    description1:
      "Make expert career advice feel useful, human, and actionable. You will shape the voice and learning content that powers our courses and interviews.",
    description2:
      "You will work with our content team to create engaging and informative materials for our users.",
    category: "Content",
    country: "United States",
    remote: false,
    posted_at: "2026-08-28T09:00:00.000Z",
    skills: ["Editorial strategy", "Career coaching", "Writing", "Research"],
  },
];

type Job = Omit<(typeof previewJobs)[number], "salary_min" | "salary_max"> & {
  salary_min?: number;
  salary_max?: number;
  country: string;
};

async function getJobs(): Promise<{ jobs: Job[]; isUsingFallback: boolean }> {
  try {
    const { listJobs } = await import("../../lib/jobs-repository");
    const data = await listJobs(true);
    if (!data.length) return { jobs: previewJobs, isUsingFallback: true };
    return {
      jobs: data.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: job.location,
        country: job.country,
        employment_type: "Full-time",
        salary_min: job.minimum_salary,
        salary_max: job.maximum_salary,
        description1: job.description1,
        description2: job.description2,
        category: job.category,
        remote: job.remote_available,
        posted_at: job.created_at,
        skills: job.skills,
      })),
      isUsingFallback: false,
    };
  } catch (error) {
    console.warn("Jobs could not be loaded from MongoDB:", error);
    return { jobs: previewJobs, isUsingFallback: true };
  }
}

export default async function JobsPage() {
  const { jobs, isUsingFallback } = await getJobs();
  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] max-[620px]:px-[6vw]">
      <SiteHeader />
      <main>
        <JobsBoard jobs={jobs} isUsingFallback={isUsingFallback} />
      </main>
      <SiteFooter />
    </div>
  );
}
