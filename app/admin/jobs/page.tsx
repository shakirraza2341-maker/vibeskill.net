"use client";

import { useState } from "react";
import {
  Job,
  JobFormData,
  ValidationErrors,
  validateJobForm,
} from "../../../lib/jobs-utils";
import JobForm from "../../../components/admin/JobForm";
import JobList from "../../../components/admin/JobList";
import AdminShell from "../../../components/admin/AdminShell";
import { Plus, X } from "lucide-react";

type View = "list" | "create" | "edit";

export default function AdminJobsPage() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch jobs on component mount
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      showMessage("error", "Failed to load jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job submission
  const handleSubmitJob = async (formData: JobFormData) => {
    const errors = validateJobForm(formData);
    if (Object.keys(errors).length > 0) {
      showMessage("error", "Please fix validation errors");
      return errors;
    }

    setIsLoading(true);
    try {
      const url = selectedJob ? `/api/jobs/${selectedJob.id}` : "/api/jobs";
      const method = selectedJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(
          "error",
          data.error || `Failed to ${selectedJob ? "update" : "create"} job`,
        );
        return data.errors || {};
      }

      showMessage(
        "success",
        `Job ${selectedJob ? "updated" : "created"} successfully`,
      );
      setSelectedJob(null);
      setCurrentView("list");
      await fetchJobs();
      return {};
    } catch (error) {
      showMessage(
        "error",
        `Failed to ${selectedJob ? "update" : "create"} job`,
      );
      console.error("Error:", error);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });

      if (!res.ok) {
        showMessage("error", "Failed to delete job");
        return;
      }

      showMessage("success", "Job deleted successfully");
      await fetchJobs();
    } catch (error) {
      showMessage("error", "Failed to delete job");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cleanup of old jobs
  const handleCleanup = async () => {
    if (!confirm("This will delete all jobs older than 20 days. Continue?"))
      return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/jobs/cleanup", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.error || "Failed to cleanup jobs");
        return;
      }

      showMessage(
        "success",
        `${data.deleted_count} jobs older than 20 days have been deleted`,
      );
      await fetchJobs();
    } catch (error) {
      showMessage("error", "Failed to cleanup jobs");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setCurrentView("edit");
  };

  const handleCreateNew = () => {
    setSelectedJob(null);
    setCurrentView("create");
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setCurrentView("list");
    fetchJobs();
  };

  const handleToggleStatus = async (job: Job) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !job.is_active }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      await fetchJobs();
    } catch {
      showMessage("error", "Failed to update job status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminShell title="Jobs" eyebrow="Job operations">
      <div>
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e15a3d]">
              Talent operations
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Job listings
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Create, review, and maintain the roles your candidates see across
              the VibeSkill network.
            </p>
          </div>
          {currentView === "list" && (
            <button
              className="admin-primary-button"
              onClick={handleCreateNew}
              type="button"
            >
              <Plus size={17} /> New job listing
            </button>
          )}
        </div>

        {message && (
          <div
            className={`mb-6 flex items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}
            role="alert"
          >
            <p>
              <strong className="mr-2">
                {message.type === "success" ? "Success" : "Action failed"}
              </strong>
              {message.text}
            </p>
            <button
              onClick={() => setMessage(null)}
              type="button"
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {currentView === "list" ? (
          <JobList
            jobs={jobs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteJob}
            onCleanup={handleCleanup}
            onFetchJobs={fetchJobs}
              onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="max-w-4xl">
            <JobForm
              job={selectedJob}
              isLoading={isLoading}
              onSubmit={handleSubmitJob}
              onCancel={handleBackToList}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
