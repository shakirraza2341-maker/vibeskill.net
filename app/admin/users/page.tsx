"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import AdminShell from "../../../components/admin/AdminShell";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "employer";
  employer_status: "none" | "pending" | "approved" | "rejected";
  company_name?: string;
  created_at: string;
};

const pageSizeOptions = [10, 25, 50];

const roleStyles: Record<User["role"], string> = {
  admin: "bg-violet-50 text-violet-700 ring-violet-200",
  employer: "bg-sky-50 text-sky-700 ring-sky-200",
  user: "bg-slate-100 text-slate-600 ring-slate-200",
};

const statusStyles: Record<User["employer_status"], string> = {
  none: "bg-slate-100 text-slate-500 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        if (!response.ok) {
          setError(data.error ?? "Unable to load users");
          return;
        }
        setUsers(data.users ?? []);
      } catch {
        setError("Unable to load users. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();
  }, []);

  async function update(
    userId: string,
    field: "role" | "employer_status",
    value: string,
  ) {
    setSavingId(userId);
    setError("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, [field]: value }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to update user");
      } else {
        setUsers((current) =>
          current.map((user) => (user.id === userId ? data.user : user)),
        );
      }
    } catch {
      setError("Unable to update user. Check your connection and try again.");
    } finally {
      setSavingId("");
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesQuery = `${user.name} ${user.email} ${user.company_name ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesFilter =
      filter === "all" ||
      user.role === filter ||
      user.employer_status === filter;
    return matchesQuery && matchesFilter;
  });
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstItem = filteredUsers.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastItem = Math.min(currentPage * pageSize, filteredUsers.length);
  const pageUsers = filteredUsers.slice(firstItem - 1, lastItem);
  const pendingCount = users.filter(
    (user) => user.employer_status === "pending",
  ).length;
  const employerCount = users.filter((user) => user.role === "employer").length;

  function changeQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function changeFilter(value: string) {
    setFilter(value);
    setPage(1);
  }

  function changePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  return (
    <AdminShell title="Users" eyebrow="Account operations">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#e15a3d]">
              Directory / Access management
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Users
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage account access, employer verification, and organization
              details.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex min-w-36 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600">
                <Users size={17} aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-lg leading-5 text-slate-900">
                  {users.length}
                </strong>
                <span className="text-[11px] font-medium text-slate-500">
                  Total accounts
                </span>
              </span>
            </div>
            <div className="flex min-w-36 items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
              <span className="grid size-9 place-items-center rounded-lg bg-amber-100 text-amber-700">
                <ShieldCheck size={17} aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-lg leading-5 text-amber-900">
                  {pendingCount}
                </strong>
                <span className="text-[11px] font-medium text-amber-800">
                  Pending reviews
                </span>
              </span>
            </div>
            <div className="flex min-w-36 items-center gap-3 rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3">
              <span className="grid size-9 place-items-center rounded-lg bg-sky-100 text-sky-700">
                <Building2 size={17} aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-lg leading-5 text-sky-900">
                  {employerCount}
                </strong>
                <span className="text-[11px] font-medium text-sky-800">
                  Employers
                </span>
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p
            className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <section
          aria-label="User directory"
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">All accounts</h2>
              <p className="mt-1 text-xs text-slate-500">
                Search and update account permissions.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block min-w-0 sm:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                  aria-hidden="true"
                />
                <span className="sr-only">Search users</span>
                <input
                  className="h-10 w-full border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#e15a3d] focus:outline-none focus:ring-2 focus:ring-[#e15a3d]/15"
                  onChange={(event) => changeQuery(event.target.value)}
                  placeholder="Name, email, or company"
                  type="search"
                  value={query}
                />
              </label>
              <label>
                <span className="sr-only">Filter users</span>
                <select
                  className="h-10 w-full min-w-44 border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#e15a3d] focus:outline-none focus:ring-2 focus:ring-[#e15a3d]/15 sm:w-auto"
                  onChange={(event) => changeFilter(event.target.value)}
                  value={filter}
                >
                  <option value="all">All accounts</option>
                  <option value="admin">Admins</option>
                  <option value="employer">Employers</option>
                  <option value="pending">Pending applications</option>
                  <option value="rejected">Rejected applications</option>
                </select>
              </label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Employer status</th>
                  <th className="px-5 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      className="px-5 py-16 text-center text-slate-500"
                      colSpan={5}
                    >
                      <LoaderCircle
                        className="mx-auto mb-3 animate-spin text-[#e15a3d]"
                        size={22}
                      />
                      <span className="text-sm">Loading accounts...</span>
                    </td>
                  </tr>
                ) : pageUsers.length ? (
                  pageUsers.map((user) => (
                    <tr
                      className="transition-colors hover:bg-slate-50/70"
                      key={user.id}
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-56 items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eaf4f1] text-xs font-bold uppercase text-[#18756a]">
                            {user.name.trim().charAt(0) || "?"}
                          </span>
                          <span className="min-w-0">
                            <strong className="block truncate font-semibold text-slate-900">
                              {user.name || "Unnamed user"}
                            </strong>
                            <span className="mt-0.5 block truncate text-xs text-slate-500">
                              {user.email}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="max-w-52 truncate px-5 py-4 text-slate-600">
                        {user.company_name || (
                          <span className="text-slate-400">No company</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${roleStyles[user.role]}`}
                          >
                            {user.role}
                          </span>
                          <label>
                            <span className="sr-only">
                              Change role for {user.name}
                            </span>
                            <select
                              aria-label={`Change role for ${user.name}`}
                              className="h-8 border-slate-200 bg-white px-2 text-xs text-slate-600 disabled:cursor-wait disabled:opacity-50"
                              disabled={savingId === user.id}
                              onChange={(event) =>
                                void update(user.id, "role", event.target.value)
                              }
                              value={user.role}
                            >
                              <option value="user">User</option>
                              <option value="employer">Employer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </label>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${statusStyles[user.employer_status]}`}
                          >
                            {user.employer_status}
                          </span>
                          <label>
                            <span className="sr-only">
                              Change employer status for {user.name}
                            </span>
                            <select
                              aria-label={`Change employer status for ${user.name}`}
                              className="h-8 border-slate-200 bg-white px-2 text-xs text-slate-600 disabled:cursor-wait disabled:opacity-50"
                              disabled={savingId === user.id}
                              onChange={(event) =>
                                void update(
                                  user.id,
                                  "employer_status",
                                  event.target.value,
                                )
                              }
                              value={user.employer_status}
                            >
                              <option value="none">None</option>
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </label>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={14} aria-hidden="true" />
                          {new Date(user.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-16 text-center" colSpan={5}>
                      <Users
                        className="mx-auto mb-3 text-slate-300"
                        size={26}
                        aria-hidden="true"
                      />
                      <p className="font-semibold text-slate-700">
                        No users found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try another search term or change the selected filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-4 border-t border-slate-200 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-slate-500" aria-live="polite">
              {loading
                ? "Loading accounts"
                : `Showing ${firstItem}–${lastItem} of ${filteredUsers.length} accounts`}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                Rows
                <select
                  className="h-8 border-slate-200 bg-white px-2 text-xs text-slate-700"
                  onChange={(event) =>
                    changePageSize(Number(event.target.value))
                  }
                  value={pageSize}
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-xs font-medium text-slate-600">
                Page {currentPage} of {pageCount}
              </span>
              <nav
                className="flex items-center gap-1"
                aria-label="User table pagination"
              >
                <button
                  aria-label="First page"
                  className="grid size-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === 1 || loading}
                  onClick={() => setPage(1)}
                  type="button"
                >
                  <ChevronsLeft size={15} />
                </button>
                <button
                  aria-label="Previous page"
                  className="grid size-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === 1 || loading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  aria-label="Next page"
                  className="grid size-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === pageCount || loading}
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                  type="button"
                >
                  <ChevronRight size={15} />
                </button>
                <button
                  aria-label="Last page"
                  className="grid size-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={currentPage === pageCount || loading}
                  onClick={() => setPage(pageCount)}
                  type="button"
                >
                  <ChevronsRight size={15} />
                </button>
              </nav>
            </div>
          </footer>
        </section>
      </div>
    </AdminShell>
  );
}
