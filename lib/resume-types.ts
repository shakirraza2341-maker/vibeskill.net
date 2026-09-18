export type ResumeInput = {
  rawText?: string;
  targetRole?: string;
  targetCompany?: string;
  template?: ResumeTemplate;
  profile?: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    skills?: string;
    experience?: ResumeExperience[];
    education?: ResumeEducation[];
    projects?: ResumeProject[];
  };
};

export type ResumeTemplate =
  | "editorial"
  | "classic"
  | "compact"
  | "modern"
  | "minimal";

export type ResumeExperience = {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
};

export type ResumeEducation = {
  school: string;
  degree: string;
  dates: string;
};

export type ResumeProject = {
  name: string;
  detail: string;
};

export type ResumeAnalysis = {
  score: number;
  verdict: string;
  summary: string;
  strengths: string[];
  improvements: Array<{ title: string; detail: string; priority: "high" | "medium" | "low" }>;
  keywords: { found: string[]; missing: string[] };
};

export type GeneratedResume = {
  name: string;
  headline: string;
  contact: string;
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
};