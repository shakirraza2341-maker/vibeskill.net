"use client";

import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import JobForm from "../../../components/admin/JobForm";
import type { Job, JobFormData, ValidationErrors } from "../../../lib/jobs-utils";

type Company = { id: string; company_name: string };
type JobWithCompany = Job & { company_id?: string };
type View = { job: JobWithCompany | null; companyId: string } | null;

export default function ProfileJobsManager({
  initialCompanies,
  initialJobs,
  userId,
}: {
  initialCompanies: Company[];
  initialJobs: JobWithCompany[];
  userId: string;
}) {
  const [companies] = useState(initialCompanies);
  const [jobs, setJobs] = useState(initialJobs);
  const [view, setView] = useState<View>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  const pageCount = Math.max(1, Math.ceil(jobs.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleJobs = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function openCreate() {
    setFeedback("");
    setView({ job: null, companyId: companies[0]?.id ?? "" });
  }

  function openEdit(job: JobWithCompany) {
    setFeedback("");
    setView({ job, companyId: job.company_id ?? "" });
  }

  async function saveJob(data: JobFormData): Promise<ValidationErrors> {
    const selectedCompany = companies.find((company) => company.company_name === data.company_name);
    if (!view || !selectedCompany) return { company_name: "Select a registered company" };
    setBusy(true);
    setFeedback("");
    setHasError(false);
    try {
      const response = await fetch(
        view.job ? `/api/profile/jobs/${view.job.id}` : "/api/profile/jobs",
        {
          method: view.job ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, company_id: selectedCompany.id, userId }),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        setHasError(true);
        setFeedback(result.error ?? "Unable to save job.");
        return result.errors ?? {};
      }
      setJobs((current) =>
        view.job
          ? current.map((job) => (job.id === result.job.id ? result.job : job))
          : [result.job, ...current],
      );
      setPage(1);
      setView(null);
      setFeedback(view.job ? "Job updated." : "Job added.");
      return {};
    } catch {
      setHasError(true);
      setFeedback("Unable to save job.");
      return {};
    } finally {
      setBusy(false);
    }
  }

  async function deleteJob(job: JobWithCompany) {
    if (!window.confirm(`Delete ${job.title}?`)) return;
    setDeletingId(job.id);
    setFeedback("");
    setHasError(false);
    try {
      const response = await fetch(`/api/profile/jobs/${job.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to delete job.");
      setJobs((current) => current.filter((item) => item.id !== job.id));
      setFeedback("Job deleted.");
    } catch (error) {
      setHasError(true);
      setFeedback(error instanceof Error ? error.message : "Unable to delete job.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 text-ink sm:px-7 sm:py-11">
      <div className="mb-7 flex flex-col justify-between gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-coral">
            Profile workspace
          </p>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">Your jobs</h1>
          <p className="mt-2 text-sm text-muted">Jobs connected to your registered companies.</p>
        </div>
        {!view && companies.length > 0 && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-coral px-4 text-sm font-semibold text-paper transition hover:brightness-110"
          >
            <Plus aria-hidden="true" size={16} /> Add job
          </button>
        )}
      </div>

      {feedback && (
        <p
          role={hasError ? "alert" : "status"}
          className={`mb-4 border px-3 py-2 text-sm ${hasError ? "border-red-500/30 bg-red-500/5 text-red-700" : "border-teal/30 bg-teal/5 text-teal"}`}
        >
          {feedback}
        </p>
      )}

      {view ? (
        <section className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setView(null)}
              className="inline-flex items-center gap-2 border border-ink/15 px-3 py-2 text-xs text-muted hover:text-ink"
            >
              <X aria-hidden="true" size={14} /> Cancel
            </button>
          </div>
          <JobForm
            job={view.job}
            isLoading={busy}
            onSubmit={saveJob}
            onCancel={() => setView(null)}
            companies={companies}
            userId={userId}
          />
        </section>
      ) : companies.length === 0 ? (
        <section className="border border-ink/10 bg-cream px-6 py-12 text-center">
          <BriefcaseBusiness aria-hidden="true" className="mx-auto text-coral" size={24} />
          <h2 className="mt-4 font-display text-xl text-ink">Register a company first</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Add a company to your account before creating its job listings.
          </p>
          <Link href="/profile/companies" className="mt-5 inline-flex min-h-10 items-center bg-coral px-4 text-sm font-semibold text-paper">
            Manage companies
          </Link>
        </section>
      ) : jobs.length === 0 ? (
        <section className="border border-ink/10 bg-cream px-6 py-12 text-center">
          <BriefcaseBusiness aria-hidden="true" className="mx-auto text-coral" size={24} />
          <h2 className="mt-4 font-display text-xl text-ink">No jobs yet</h2>
          <p className="mt-2 text-sm text-muted">Add a job listing for one of your registered companies.</p>
        </section>
      ) : (
        <section aria-label="Your company jobs">
          <div className="mb-4 flex justify-end">
            <label className="flex items-center gap-2 text-xs text-muted">
              Rows per page
              <select
                value={pageSize}
                onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}
                className="h-10 border border-ink/15 bg-cream px-2 text-ink outline-none focus:border-teal"
              >
                {[5, 10, 20].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
          </div>
          <div className="overflow-hidden border border-ink/10 bg-cream">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                <thead className="border-b border-ink/10 bg-ink/[0.025] text-[10px] uppercase text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Job title</th>
                    <th className="px-4 py-3 font-semibold">Company</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {visibleJobs.map((job) => (
                    <tr key={job.id} className="align-top hover:bg-paper/60">
                      <td className="max-w-56 px-4 py-4 font-semibold text-ink">{job.title}</td>
                      <td className="px-4 py-4">{job.company_name}</td>
                      <td className="px-4 py-4">{job.category}</td>
                      <td className="px-4 py-4">{job.city}, {job.country}</td>
                      <td className="px-4 py-4">
                        <span className={job.is_active ? "text-teal" : "text-muted"}>{job.is_active ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => openEdit(job)} title="Edit job" aria-label={`Edit ${job.title}`} className="p-2 text-muted hover:text-coral">
                            <Pencil aria-hidden="true" size={15} />
                          </button>
                          <button type="button" onClick={() => deleteJob(job)} disabled={deletingId === job.id} title="Delete job" aria-label={`Delete ${job.title}`} className="p-2 text-muted hover:text-red-700 disabled:opacity-50">
                            <Trash2 aria-hidden="true" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-4 py-3 text-xs text-muted">
              <p>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, jobs.length)} of {jobs.length} jobs</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1} aria-label="Previous page" className="grid size-8 place-items-center border border-ink/15 disabled:opacity-40"><ChevronLeft aria-hidden="true" size={15} /></button>
                <span>Page {currentPage} of {pageCount}</span>
                <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount} aria-label="Next page" className="grid size-8 place-items-center border border-ink/15 disabled:opacity-40"><ChevronRight aria-hidden="true" size={15} /></button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}