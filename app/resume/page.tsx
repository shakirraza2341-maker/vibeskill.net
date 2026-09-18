"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import VibeSkillLogo from "../../components/VibeSkillLogo";
import type {
  GeneratedResume,
  ResumeAnalysis,
  ResumeEducation,
  ResumeExperience,
  ResumeInput,
  ResumeProject,
  ResumeTemplate,
} from "../../lib/resume-types";

type SourceMode = "existing" | "guided";
type GuidedProfile = NonNullable<ResumeInput["profile"]>;
const templates: Array<{
  id: ResumeTemplate;
  name: string;
  description: string;
}> = [
  {
    id: "classic",
    name: "Classic ATS",
    description: "Straightforward hierarchy for every applicant system.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Quiet typography and generous scanning space.",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense structure for experienced candidates.",
  },
  {
    id: "modern",
    name: "Modern ATS",
    description: "Crisp sections with restrained visual emphasis.",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Confident hierarchy while remaining machine-readable.",
  },
];
const newExperience = (): ResumeExperience => ({
  role: "",
  company: "",
  dates: "",
  bullets: [""],
});
const newEducation = (): ResumeEducation => ({
  school: "",
  degree: "",
  dates: "",
});
const newProject = (): ResumeProject => ({ name: "", detail: "" });
const emptyProfile: GuidedProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  experience: [newExperience()],
  education: [newEducation()],
  projects: [newProject()],
};

export default function ResumePage() {
  const [sourceMode, setSourceMode] = useState<SourceMode>("existing");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [profile, setProfile] = useState<GuidedProfile>(emptyProfile);
  const [rawText, setRawText] = useState("");
  const [template, setTemplate] = useState<ResumeTemplate>("classic");
  const [step, setStep] = useState(0);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resume, setResume] = useState<GeneratedResume | null>(null);
  const [loading, setLoading] = useState<"analyze" | "generate" | "">("");
  const [readingFile, setReadingFile] = useState(false);
  const [error, setError] = useState("");

  function updateProfile(field: keyof GuidedProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }
  function updateList<K extends "experience" | "education" | "projects", T>(
    field: K,
    index: number,
    value: T,
  ) {
    setProfile((current) => ({
      ...current,
      [field]: (current[field] ?? []).map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }
  function removeList(
    field: "experience" | "education" | "projects",
    index: number,
  ) {
    setProfile((current) => ({
      ...current,
      [field]: (current[field] ?? []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }
  function addList<T>(
    field: "experience" | "education" | "projects",
    value: T,
  ) {
    setProfile((current) => ({
      ...current,
      [field]: [...(current[field] ?? []), value],
    }));
  }
  function updateExperience(
    index: number,
    field: keyof ResumeExperience,
    value: string | string[],
  ) {
    updateList("experience", index, {
      ...profile.experience![index],
      [field]: value,
    });
  }
  function updateBullet(index: number, bulletIndex: number, value: string) {
    updateExperience(
      index,
      "bullets",
      profile.experience![index].bullets.map((bullet, current) =>
        current === bulletIndex ? value : bullet,
      ),
    );
  }
  function switchMode(mode: SourceMode) {
    setSourceMode(mode);
    setRawText("");
    setAnalysis(null);
    setError("");
    setStep(0);
  }
  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    const isText = file.type === "text/plain" || /\.(txt|md)$/i.test(file.name);
    if (!isPdf && !isText) {
      setError("Choose a PDF, TXT, or Markdown resume file.");
      return;
    }
    setReadingFile(true);
    setError("");
    try {
      if (isText) setRawText(await file.text());
      else {
        const data = new FormData();
        data.append("file", file);
        const response = await fetch("/api/resume/extract", {
          method: "POST",
          body: data,
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Unable to read this PDF");
        setRawText(result.text);
      }
    } catch (requestError) {
      setRawText("");
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to read this resume file",
      );
    } finally {
      setReadingFile(false);
    }
  }
  function buildInput(): ResumeInput {
    return sourceMode === "existing"
      ? { rawText: rawText.trim(), template }
      : {
          targetRole: targetRole.trim(),
          targetCompany: targetCompany.trim() || undefined,
          template,
          profile,
        };
  }
  function validateGuided() {
    if (!targetRole.trim() || !profile.name.trim() || !profile.email.trim())
      return "Add your target role, name, and email first.";
    if (
      !(profile.experience ?? []).some(
        (item) => item.role.trim() && item.company.trim(),
      )
    )
      return "Add at least one experience entry.";
    return "";
  }
  async function analyze(event: FormEvent) {
    event.preventDefault();
    const validation =
      sourceMode === "existing"
        ? !rawText.trim()
          ? "Please choose a readable resume file first."
          : ""
        : validateGuided();
    if (readingFile) {
      setError("Please wait while your resume file is being read.");
      return;
    }
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setLoading("analyze");
    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildInput()),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to analyze your resume");
      setAnalysis(result.analysis);
      setResume(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to analyze your resume",
      );
    } finally {
      setLoading("");
    }
  }
  async function generate() {
    setError("");
    setResume(null);
    setLoading("generate");
    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildInput()),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to build your resume");
      setResume(result.resume);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to build your resume",
      );
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="resume-page">
      <header className="site-header">
        <VibeSkillLogo />
        <nav className="site-nav" aria-label="Resume navigation">
          <span className="nav-current">Resume lab</span>
          <Link className="nav-cta" href="/">
            Back home <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>
      <main>
        <section className="resume-hero">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot" /> Gemini-powered career tool
            </p>
            <h1>
              Make your resume
              <br />
              <em>read better.</em>
            </h1>
          </div>
          <p>
            Build a structured, ATS-friendly resume one clear step at a time,
            then export a polished PDF.
          </p>
        </section>
        <section className="resume-workspace">
          <div className="resume-steps">
            <span className={!analysis ? "active" : "complete"}>
              01 <strong>Build your story</strong>
            </span>
            <span className={analysis ? "active" : ""}>
              02 <strong>Read the signal</strong>
            </span>
            <span className={resume ? "active" : ""}>
              03 <strong>Shape the final</strong>
            </span>
          </div>
          <form className="resume-form" onSubmit={analyze}>
            <div className="resume-form-heading">
              <div>
                <p className="eyebrow">01 / Input</p>
                <h2>
                  Start with what
                  <br />
                  <em>you have.</em>
                </h2>
              </div>
              <p className="resume-note">
                Your resume is sent to Gemini only when you submit. This
                workspace does not save it.
              </p>
            </div>
            <div
              className="resume-mode-switch"
              role="tablist"
              aria-label="Resume source"
            >
              <button
                type="button"
                className={sourceMode === "existing" ? "selected" : ""}
                onClick={() => switchMode("existing")}
              >
                I have a resume
              </button>
              <button
                type="button"
                className={sourceMode === "guided" ? "selected" : ""}
                onClick={() => switchMode("guided")}
              >
                Build one from scratch
              </button>
            </div>
            {sourceMode === "existing" ? (
              <label className="resume-file-picker">
                Resume file
                <input
                  required
                  type="file"
                  accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                  onChange={readFile}
                />
                <span>
                  {readingFile
                    ? "Reading your file..."
                    : "Choose one PDF or text file"}
                </span>
                {rawText ? (
                  <small>File loaded and ready to review.</small>
                ) : null}
              </label>
            ) : (
              <GuidedForm
                step={step}
                setStep={setStep}
                profile={profile}
                template={template}
                setTemplate={setTemplate}
                targetRole={targetRole}
                targetCompany={targetCompany}
                setTargetRole={setTargetRole}
                setTargetCompany={setTargetCompany}
                updateProfile={updateProfile}
                updateList={updateList}
                updateExperience={updateExperience}
                updateBullet={updateBullet}
                addList={addList}
                removeList={removeList}
                onGenerate={generate}
                onExport={() => window.print()}
                isGenerating={loading === "generate"}
                hasResume={Boolean(resume)}
              />
            )}
            <button
              className="resume-primary-button"
              disabled={loading !== "" || readingFile}
              type="submit"
            >
              {readingFile
                ? "Reading your file..."
                : loading === "analyze"
                  ? "Reading your resume..."
                  : sourceMode === "guided"
                    ? "Check and improve my resume"
                    : "Check my ATS score"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
          {error ? (
            <p className="resume-error" role="alert">
              {error}
            </p>
          ) : null}
          {analysis ? (
            <AnalysisPanel
              analysis={analysis}
              onGenerate={generate}
              isGenerating={loading === "generate"}
            />
          ) : null}
          {resume ? (
            <ResumePreview
              resume={resume}
              template={template}
              setTemplate={setTemplate}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}

function GuidedForm({
  step,
  setStep,
  profile,
  template,
  setTemplate,
  targetRole,
  targetCompany,
  setTargetRole,
  setTargetCompany,
  updateProfile,
  updateList,
  updateExperience,
  updateBullet,
  addList,
  removeList,
  onGenerate,
  onExport,
  isGenerating,
  hasResume,
}: {
  step: number;
  setStep: (value: number) => void;
  profile: GuidedProfile;
  template: ResumeTemplate;
  setTemplate: (value: ResumeTemplate) => void;
  targetRole: string;
  targetCompany: string;
  setTargetRole: (value: string) => void;
  setTargetCompany: (value: string) => void;
  updateProfile: (field: keyof GuidedProfile, value: string) => void;
  updateList: <K extends "experience" | "education" | "projects", T>(
    field: K,
    index: number,
    value: T,
  ) => void;
  updateExperience: (
    index: number,
    field: keyof ResumeExperience,
    value: string | string[],
  ) => void;
  updateBullet: (index: number, bulletIndex: number, value: string) => void;
  addList: <T>(
    field: "experience" | "education" | "projects",
    value: T,
  ) => void;
  removeList: (
    field: "experience" | "education" | "projects",
    index: number,
  ) => void;
  onGenerate: () => void;
  onExport: () => void;
  isGenerating: boolean;
  hasResume: boolean;
}) {
  const labels = ["Personal", "Summary", "Experience", "Education", "Skills"];
  return (
    <div className="guided-builder">
      <div className="guided-progress" aria-label="Resume builder steps">
        {labels.map((label, index) => (
          <button
            type="button"
            key={label}
            className={
              step === index ? "active" : index < step ? "complete" : ""
            }
            onClick={() => setStep(index)}
          >
            <span>0{index + 1}</span>
            {label}
          </button>
        ))}
      </div>
      {step === 0 ? (
        <div className="builder-step">
          <p className="eyebrow">Step 01</p>
          <h3>Personal information</h3>
          <div className="resume-target-grid">
            <label>
              Target role
              <input
                required
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="e.g. Product designer"
              />
            </label>
            <label>
              Target company <span>(optional)</span>
              <input
                value={targetCompany}
                onChange={(event) => setTargetCompany(event.target.value)}
              />
            </label>
            <label>
              Full name
              <input
                required
                value={profile.name}
                onChange={(event) => updateProfile("name", event.target.value)}
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={profile.email}
                onChange={(event) => updateProfile("email", event.target.value)}
              />
            </label>
            <label>
              Phone <span>(optional)</span>
              <input
                value={profile.phone}
                onChange={(event) => updateProfile("phone", event.target.value)}
              />
            </label>
            <label>
              Location <span>(optional)</span>
              <input
                value={profile.location}
                onChange={(event) =>
                  updateProfile("location", event.target.value)
                }
              />
            </label>
          </div>
        </div>
      ) : null}
      {step === 1 ? (
        <div className="builder-step">
          <p className="eyebrow">Step 02</p>
          <h3>Professional summary</h3>
          <label>
            Summary
            <textarea
              value={profile.summary}
              onChange={(event) => updateProfile("summary", event.target.value)}
              placeholder="A concise introduction focused on your strengths and direction."
            />
          </label>
        </div>
      ) : null}
      {step === 2 ? (
        <div className="builder-step">
          <p className="eyebrow">Step 03</p>
          <h3>Experience</h3>
          {(profile.experience ?? []).map((item, index) => (
            <div className="repeatable-entry" key={index}>
              <div className="entry-heading">
                <strong>Role {index + 1}</strong>
                {profile.experience!.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeList("experience", index)}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="resume-target-grid">
                <label>
                  Job title
                  <input
                    value={item.role}
                    onChange={(event) =>
                      updateExperience(index, "role", event.target.value)
                    }
                  />
                </label>
                <label>
                  Company
                  <input
                    value={item.company}
                    onChange={(event) =>
                      updateExperience(index, "company", event.target.value)
                    }
                  />
                </label>
                <label>
                  Dates
                  <input
                    value={item.dates}
                    onChange={(event) =>
                      updateExperience(index, "dates", event.target.value)
                    }
                  />
                </label>
              </div>
              <label>
                Achievements
                {item.bullets.map((bullet, bulletIndex) => (
                  <input
                    key={bulletIndex}
                    value={bullet}
                    onChange={(event) =>
                      updateBullet(index, bulletIndex, event.target.value)
                    }
                    placeholder="What did you achieve?"
                  />
                ))}
                <button
                  className="inline-add"
                  type="button"
                  onClick={() =>
                    updateExperience(index, "bullets", [...item.bullets, ""])
                  }
                >
                  + Add achievement
                </button>
              </label>
            </div>
          ))}
          <button
            className="inline-add"
            type="button"
            onClick={() => addList("experience", newExperience())}
          >
            + Add another role
          </button>
        </div>
      ) : null}
      {step === 3 ? (
        <div className="builder-step">
          <p className="eyebrow">Step 04</p>
          <h3>Education and studies</h3>
          {(profile.education ?? []).map((item, index) => (
            <div className="repeatable-entry" key={index}>
              <div className="entry-heading">
                <strong>Study {index + 1}</strong>
                {profile.education!.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeList("education", index)}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="resume-target-grid">
                <label>
                  School or university
                  <input
                    value={item.school}
                    onChange={(event) =>
                      updateList("education", index, {
                        ...item,
                        school: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Degree or field
                  <input
                    value={item.degree}
                    onChange={(event) =>
                      updateList("education", index, {
                        ...item,
                        degree: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Dates
                  <input
                    value={item.dates}
                    onChange={(event) =>
                      updateList("education", index, {
                        ...item,
                        dates: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            className="inline-add"
            type="button"
            onClick={() => addList("education", newEducation())}
          >
            + Add another study
          </button>
        </div>
      ) : null}
      {step === 4 ? (
        <div className="builder-step">
          <p className="eyebrow">Step 05</p>
          <h3>Skills and projects</h3>
          <label>
            Skills
            <textarea
              value={profile.skills}
              onChange={(event) => updateProfile("skills", event.target.value)}
              placeholder="Figma, research, prototyping, accessibility..."
            />
          </label>
          {(profile.projects ?? []).map((item, index) => (
            <div className="repeatable-entry" key={index}>
              <div className="entry-heading">
                <strong>Project {index + 1}</strong>
                {profile.projects!.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeList("projects", index)}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <label>
                Project name
                <input
                  value={item.name}
                  onChange={(event) =>
                    updateList("projects", index, {
                      ...item,
                      name: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Details
                <textarea
                  value={item.detail}
                  onChange={(event) =>
                    updateList("projects", index, {
                      ...item,
                      detail: event.target.value,
                    })
                  }
                />
              </label>
            </div>
          ))}
          <button
            className="inline-add"
            type="button"
            onClick={() => addList("projects", newProject())}
          >
            + Add another project
          </button>
          <div className="template-picker builder-template-picker">
            <span>Choose your final resume template</span>
            {templates.map((item) => (
              <button
                type="button"
                key={item.id}
                className={template === item.id ? "selected" : ""}
                onClick={() => setTemplate(item.id)}
              >
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="builder-navigation">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        {step < labels.length - 1 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Continue →
          </button>
        ) : (
          <div className="builder-action-row">
            <button
              className="resume-primary-button"
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate resume"}
              <span aria-hidden="true">↗</span>
            </button>
            {hasResume ? (
              <button
                className="resume-print-button"
                type="button"
                onClick={onExport}
                disabled={isGenerating}
              >
                Export PDF <span aria-hidden="true">↓</span>
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalysisPanel({
  analysis,
  onGenerate,
  isGenerating,
}: {
  analysis: ResumeAnalysis;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <section className="resume-analysis">
      <div className="resume-analysis-heading">
        <div>
          <p className="eyebrow">02 / The signal</p>
          <h2>
            Your score is <em>{analysis.score}</em>
            <small>/ 100</small>
          </h2>
        </div>
        <button
          className="resume-primary-button"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Writing your version..." : "Improve my resume"}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="resume-analysis-grid">
        <div>
          <p className="resume-verdict">{analysis.verdict}</p>
          <p className="resume-muted">{analysis.summary}</p>
        </div>
        <div>
          <p className="resume-label">What is working</p>
          <ul>
            {analysis.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="resume-label">Priorities</p>
          <ul>
            {analysis.improvements.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span className={`priority-${item.priority}`}>
                  {item.priority}
                </span>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
function ResumePreview({
  resume,
  template,
  setTemplate,
}: {
  resume: GeneratedResume;
  template: ResumeTemplate;
  setTemplate: (value: ResumeTemplate) => void;
}) {
  return (
    <section className="resume-output">
      <div className="resume-output-heading">
        <div>
          <p className="eyebrow">03 / Your finished draft</p>
          <h2>
            Make it <em>yours.</em>
          </h2>
        </div>
        <button className="resume-print-button" onClick={() => window.print()}>
          Print / save PDF <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="template-picker">
        <span>Choose an ATS template</span>
        {templates.map((item) => (
          <button
            type="button"
            key={item.id}
            className={template === item.id ? "selected" : ""}
            onClick={() => setTemplate(item.id)}
          >
            <strong>{item.name}</strong>
            <small>{item.description}</small>
          </button>
        ))}
      </div>
      <article className={`resume-paper resume-template-${template}`}>
        <header>
          <h3>{resume.name}</h3>
          <p>{resume.headline}</p>
          <span>{resume.contact}</span>
        </header>
        <ResumeSection title="Profile">
          <p>{resume.summary}</p>
        </ResumeSection>
        <ResumeSection title="Skills">
          <div className="resume-skill-list">
            {resume.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </ResumeSection>
        <ResumeSection title="Experience">
          {resume.experience.map((item, index) => (
            <div className="resume-paper-item" key={`${item.role}-${index}`}>
              <div>
                <strong>{item.role}</strong>
                <span>
                  {item.company} · {item.dates}
                </span>
              </div>
              <ul>
                {item.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </ResumeSection>
        {resume.education.length ? (
          <ResumeSection title="Education">
            {resume.education.map((item, index) => (
              <div className="resume-paper-item" key={index}>
                <strong>{item.degree}</strong>
                <span>
                  {item.school} · {item.dates}
                </span>
              </div>
            ))}
          </ResumeSection>
        ) : null}
        {resume.projects.length ? (
          <ResumeSection title="Projects">
            {resume.projects.map((item, index) => (
              <div className="resume-paper-item" key={index}>
                <strong>{item.name}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </ResumeSection>
        ) : null}
      </article>
    </section>
  );
}
function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="resume-paper-section">
      <h4>{title}</h4>
      <div>{children}</div>
    </section>
  );
}
