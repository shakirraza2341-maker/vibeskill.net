"use client";

import { Job, formatSalary, formatDate } from "../../lib/jobs-utils";
import {
  Edit2,
  Trash2,
  RefreshCw,
  Zap,
  BriefcaseBusiness,
  MapPin,
  Users,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onCleanup: () => void;
  onFetchJobs: () => void;
  onToggleStatus: (job: Job) => void;
}

export default function JobList({
  jobs,
  isLoading,
  onEdit,
  onDelete,
  onCleanup,
  onFetchJobs,
  onToggleStatus,
}: JobListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, jobs.length]);

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-400 mt-4">Loading jobs...</p>
      </div>
    );
  }

  const calculateDaysOld = (createdAt: string): number => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isJobOld = (createdAt: string): boolean => {
    return isMounted && calculateDaysOld(createdAt) > 20;
  };

  const normalizeSkills = (skills: unknown): string[] => {
    if (Array.isArray(skills)) return skills.filter(Boolean).map(String);
    if (typeof skills !== "string" || !skills.trim()) return [];

    try {
      const parsed = JSON.parse(skills);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch {
      // Legacy records may use comma-separated text instead of JSON.
    }

    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const oldJobsCount = jobs.filter((job) => isJobOld(job.created_at)).length;

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0eb] text-[#e15a3d]">
          <BriefcaseBusiness size={24} />
        </div>
        <p className="mt-5 text-lg font-bold text-slate-900">
          No job listings yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Create your first role to start building a stronger candidate
          pipeline.
        </p>
      </div>
    );
  }

  const totalPositions = jobs.reduce(
    (sum, job) => sum + Number(job.required || 0),
    0,
  );
  const averageSalary =
    jobs.reduce(
      (sum, job) =>
        sum +
        (Number(job.minimum_salary || 0) + Number(job.maximum_salary || 0)) / 2,
      0,
    ) / jobs.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="admin-stat-card">
          <span className="admin-stat-icon bg-[#fff0eb] text-[#e15a3d]">
            <BriefcaseBusiness size={18} />
          </span>
          <p>Active listings</p>
          <strong>{jobs.length}</strong>
          <small>
            <ArrowUpRight size={13} /> Current inventory
          </small>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon bg-[#eaf7f4] text-[#18756a]">
            <Users size={18} />
          </span>
          <p>Open positions</p>

          <small>Across all listings</small>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon bg-[#eef2ff] text-[#5265bc]">
            <ArrowUpRight size={18} />
          </span>
          <p>Average salary</p>
          <strong>{formatSalary(averageSalary)}</strong>
          <small>Midpoint of ranges</small>
        </div>
        <div className="admin-stat-card">
          <span
            className={`admin-stat-icon ${oldJobsCount > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            <Zap size={18} />
          </span>
          <p>Needs attention</p>
          <strong>{oldJobsCount}</strong>
          <small>
            {oldJobsCount > 0 ? "Older than 20 days" : "Everything looks fresh"}
          </small>
        </div>
      </div>
      {/* Cleanup Section */}
      {oldJobsCount > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-amber-600">
              <Zap size={18} />
            </div>
            <div>
              <p className="font-semibold text-amber-900">
                Listings need review
              </p>
              <p className="mt-1 text-sm text-amber-800">
                {oldJobsCount} job{oldJobsCount !== 1 ? "s" : ""} older than 20
                days can be cleaned up
              </p>
            </div>
            <button
              onClick={onCleanup}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
            >
              <Zap size={18} />
              Clean Up Now
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">All listings</h2>
            <p className="mt-1 text-xs text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, jobs.length)} of {jobs.length}{" "}
              listings
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
            disabled={isLoading}
            onClick={onFetchJobs}
            type="button"
          >
            <RefreshCw className={isLoading ? "animate-spin" : ""} size={14} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-slate-100 bg-slate-50/80">
              <tr>
                {["Role", "Location", "Posted", "Status", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedJobs.map((job) => {
                const daysOld = calculateDaysOld(job.created_at);
                const isOld = daysOld > 20;

                return (
                  <tr
                    key={job.id}
                    className={`transition-colors hover:bg-slate-50 ${
                      isOld ? "bg-rose-50/40" : ""
                    }`}
                  >
                    <td className="max-w-[250px] px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {job.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {job.company_name || "Company not specified"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="text-xs text-slate-600">
                        <p className="flex items-center gap-1.5">
                          <MapPin
                            size={13}
                            className="shrink-0 text-slate-400"
                          />
                          <span className="max-w-[130px] truncate">
                            {job.city}, {job.country}
                          </span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {job.remote_available ? "Remote" : "On-site"}
                        </p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-400">
                      <div>
                        <p>{isMounted ? formatDate(job.created_at) : "—"}</p>
                        <p
                          className={isOld ? "font-semibold text-rose-500" : ""}
                        >
                          {isMounted
                            ? `${daysOld} day${daysOld !== 1 ? "s" : ""} ago`
                            : "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${job.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                        onClick={() => onToggleStatus(job)}
                        type="button"
                      >
                        {job.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(job)}
                          disabled={isLoading}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#e15a3d] disabled:opacity-50"
                          title="Edit job"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(job.id)}
                          disabled={isLoading}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                          title="Delete job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous page"
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              type="button"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(Math.max(0, currentPage - 2), currentPage + 1)
              .map((page) => (
                <button
                  key={page}
                  className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-xs font-semibold ${page === currentPage ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
            <button
              aria-label="Next page"
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              type="button"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
