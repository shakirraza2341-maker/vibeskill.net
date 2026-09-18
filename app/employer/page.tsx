"use client";

import { useState } from "react";
import JobForm from "../../components/admin/JobForm";
import type { JobFormData, ValidationErrors } from "../../lib/jobs-utils";
import { validateJobForm } from "../../lib/jobs-utils";

export default function EmployerJobsPage() {
  const [message, setMessage] = useState("");

  async function submitJob(data: JobFormData): Promise<ValidationErrors> {
    const errors = validateJobForm(data);
    if (Object.keys(errors).length) return errors;

    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? "Unable to publish this job.");
      return result.errors ?? {};
    }

    setMessage("Job submitted and published successfully.");
    return {};
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <a className="text-sm font-bold text-[#e15a3d]" href="/profile">
          &larr; Profile
        </a>
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e15a3d]">
            Employer workspace
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Publish a job
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Approved employers can publish roles for candidates in the VibeSkill
            network.
          </p>
        </div>
        {message && (
          <p
            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
            role="status"
          >
            {message}
          </p>
        )}
        <div className="mt-8 max-w-4xl">
          <JobForm
            job={null}
            isLoading={false}
            onSubmit={submitJob}
            onCancel={() => undefined}
          />
        </div>
      </div>
    </main>
  );
}
