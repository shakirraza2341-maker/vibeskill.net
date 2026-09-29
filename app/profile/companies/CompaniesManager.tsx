"use client";

import {
  ArrowUpDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  KeyRound,
  MapPin,
  Pencil,
  Plus,
  Search,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";

type Company = {
  id: string;
  company_name: string;
  company_website: string;
  company_telephone: string;
  company_address: string;
  company_ntn: string;
  created_at: string;
  updated_at: string;
};

type CompanyForm = Omit<
  Company,
  "id" | "created_at" | "updated_at"
>;
type SortKey = "company_name" | "updated_at";

const emptyForm: CompanyForm = {
  company_name: "",
  company_website: "",
  company_telephone: "",
  company_address: "",
  company_ntn: "",
};

const fieldClass =
  "mt-1.5 min-h-10 w-full border border-ink/15 bg-paper px-3 py-2 text-sm font-normal text-ink outline-none placeholder:text-muted focus:border-teal";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function CompaniesManager({
  initialCompanies,
}: {
  initialCompanies: Company[];
}) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("company_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CompanyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const sortedCompanies = companies
    .filter((company) =>
      [
        company.company_name,
        company.company_website,
        company.company_telephone,
        company.company_address,
        company.company_ntn,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    .sort((first, second) => {
      const comparison =
        sortKey === "company_name"
          ? first.company_name.localeCompare(second.company_name)
          : first.updated_at.localeCompare(second.updated_at);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  const pageCount = Math.max(1, Math.ceil(sortedCompanies.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleCompanies = sortedCompanies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function openNewCompany() {
    setEditingId(null);
    setForm(emptyForm);
    setFeedback("");
    setFormOpen(true);
  }

  function openEditCompany(company: Company) {
    setEditingId(company.id);
    setForm({
      company_name: company.company_name,
      company_website: company.company_website,
      company_telephone: company.company_telephone,
      company_address: company.company_address,
      company_ntn: company.company_ntn,
    });
    setFeedback("");
    setFormOpen(true);
  }

  async function saveCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback("");
    setHasError(false);

    try {
      const response = await fetch(
        editingId ? `/api/profile/company/${editingId}` : "/api/profile/company",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save company.");
      }

      const savedCompany = data.company as Company;
      setCompanies((current) =>
        editingId
          ? current.map((company) =>
              company.id === savedCompany.id ? savedCompany : company,
            )
          : [savedCompany, ...current],
      );
      setFormOpen(false);
      setFeedback(editingId ? "Company updated." : "Company added.");
      setHasError(false);
      setPage(1);
    } catch (error) {
      setHasError(true);
      setFeedback(
        error instanceof Error ? error.message : "Unable to save company.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCompany(company: Company) {
    if (!window.confirm(`Delete ${company.company_name}?`)) return;
    setDeletingId(company.id);
    setFeedback("");
    setHasError(false);

    try {
      const response = await fetch(`/api/profile/company/${company.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete company.");
      }
      setCompanies((current) =>
        current.filter((entry) => entry.id !== company.id),
      );
      setFeedback("Company deleted.");
    } catch (error) {
      setHasError(true);
      setFeedback(
        error instanceof Error ? error.message : "Unable to delete company.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-7 sm:py-11">
        <div className="mb-7 flex flex-col justify-between gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-coral">
              Profile workspace
            </p>
            <h1 className="font-display text-3xl text-ink sm:text-4xl">
              Your companies
            </h1>
            <p className="mt-2 text-sm text-muted">
              Manage the business details connected to your account.
            </p>
          </div>
          <button
            type="button"
            onClick={openNewCompany}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-coral px-4 text-sm font-semibold text-paper transition hover:brightness-110"
          >
            <Plus aria-hidden="true" size={16} />
            Add company
          </button>
        </div>

        <section aria-label="Company directory">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:max-w-sm">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={15}
              />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search companies"
                aria-label="Search companies"
                className="h-10 w-full border border-ink/15 bg-cream pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-teal"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-muted">
              Rows per page
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-10 border border-ink/15 bg-cream px-2 text-ink outline-none focus:border-teal"
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {feedback && !formOpen && (
            <p
              role={hasError ? "alert" : "status"}
              className={`mb-4 border px-3 py-2 text-sm ${
                hasError
                  ? "border-red-500/30 bg-red-500/5 text-red-700"
                  : "border-teal/30 bg-teal/5 text-teal"
              }`}
            >
              {feedback}
            </p>
          )}

          <div className="overflow-hidden border border-ink/10 bg-cream">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left text-xs">
                <thead className="border-b border-ink/10 bg-ink/[0.025] text-[10px] uppercase text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">
                      <button
                        type="button"
                        onClick={() => toggleSort("company_name")}
                        className="inline-flex items-center gap-1.5 hover:text-ink"
                        aria-label={`Sort by company name ${sortKey === "company_name" && sortDirection === "asc" ? "descending" : "ascending"}`}
                      >
                        Company <ArrowUpDown aria-hidden="true" size={12} />
                      </button>
                    </th>
                    <th className="px-4 py-3 font-semibold">Website</th>
                    <th className="px-4 py-3 font-semibold">Telephone</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">NTN</th>
                    <th className="px-4 py-3 font-semibold">
                      <button
                        type="button"
                        onClick={() => toggleSort("updated_at")}
                        className="inline-flex items-center gap-1.5 hover:text-ink"
                        aria-label={`Sort by last updated ${sortKey === "updated_at" && sortDirection === "asc" ? "descending" : "ascending"}`}
                      >
                        Updated <ArrowUpDown aria-hidden="true" size={12} />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {visibleCompanies.map((company) => (
                    <tr key={company.id} className="align-top hover:bg-paper/60">
                      <td className="max-w-48 px-4 py-4">
                        <div className="flex items-start gap-2.5">
                          <Building2
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-coral"
                            size={15}
                          />
                          <span className="break-words font-semibold text-ink">
                            {company.company_name}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-48 px-4 py-4">
                        <a
                          href={company.company_website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-start gap-2 break-all text-teal underline decoration-teal/30 underline-offset-2 hover:decoration-teal"
                        >
                          <Globe2
                            aria-hidden="true"
                            className="mt-0.5 shrink-0"
                            size={13}
                          />
                          {company.company_website}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted">
                        {company.company_telephone}
                      </td>
                      <td className="max-w-56 px-4 py-4 text-muted">
                        <span className="flex items-start gap-2">
                          <MapPin
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-teal"
                            size={13}
                          />
                          <span className="whitespace-normal break-words">
                            {company.company_address}
                          </span>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <KeyRound aria-hidden="true" size={13} />
                          {company.company_ntn}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted">
                        {formatDate(company.updated_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditCompany(company)}
                            title={`Edit ${company.company_name}`}
                            aria-label={`Edit ${company.company_name}`}
                            className="grid size-9 place-items-center text-muted hover:bg-teal/10 hover:text-teal"
                          >
                            <Pencil aria-hidden="true" size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteCompany(company)}
                            disabled={deletingId === company.id}
                            title={`Delete ${company.company_name}`}
                            aria-label={`Delete ${company.company_name}`}
                            className="grid size-9 place-items-center text-muted hover:bg-red-500/10 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 aria-hidden="true" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleCompanies.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <Building2
                          aria-hidden="true"
                          className="mx-auto mb-3 text-muted"
                          size={22}
                        />
                        <p className="text-sm font-semibold text-ink">
                          {normalizedQuery
                            ? "No companies match your search."
                            : "No companies yet."}
                        </p>
                        {!normalizedQuery && (
                          <p className="mt-1 text-xs text-muted">
                            Add your first company to get started.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between gap-3 border-t border-ink/10 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-[11px] text-muted">
                {sortedCompanies.length === 0
                  ? "0 companies"
                  : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, sortedCompanies.length)} of ${sortedCompanies.length} companies`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  className="grid size-9 place-items-center border border-ink/15 text-muted hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft aria-hidden="true" size={16} />
                </button>
                <span aria-live="polite" className="min-w-20 text-center text-xs text-ink">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={currentPage >= pageCount}
                  aria-label="Next page"
                  className="grid size-9 place-items-center border border-ink/15 text-muted hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {formOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/55 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setFormOpen(false);
            }
          }}
        >
          <section
            aria-labelledby="company-form-title"
            aria-modal="true"
            className="my-auto w-full max-w-2xl border border-ink/15 bg-paper p-5 shadow-[8px_8px_0_var(--color-teal)] sm:p-7"
            role="dialog"
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-coral">
                  Company details
                </p>
                <h2
                  id="company-form-title"
                  className="mt-1 font-display text-2xl text-ink"
                >
                  {editingId ? "Edit company" : "Add a company"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                disabled={saving}
                aria-label="Close company form"
                className="grid size-9 place-items-center text-muted hover:bg-ink/5 hover:text-ink disabled:opacity-50"
              >
                <X aria-hidden="true" size={17} />
              </button>
            </div>

            <form onSubmit={saveCompany} className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-ink">
                Company name
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={form.company_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      company_name: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-xs font-semibold text-ink">
                Website
                <input
                  required
                  type="url"
                  maxLength={300}
                  placeholder="https://example.com"
                  value={form.company_website}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      company_website: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-xs font-semibold text-ink">
                Telephone
                <input
                  required
                  type="tel"
                  minLength={7}
                  maxLength={30}
                  value={form.company_telephone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      company_telephone: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-xs font-semibold text-ink">
                NTN number
                <input
                  required
                  minLength={4}
                  maxLength={50}
                  value={form.company_ntn}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      company_ntn: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-xs font-semibold text-ink sm:col-span-2">
                Company address
                <textarea
                  required
                  minLength={5}
                  maxLength={300}
                  rows={3}
                  value={form.company_address}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      company_address: event.target.value,
                    }))
                  }
                  className={`${fieldClass} resize-y`}
                />
              </label>

              {feedback && formOpen && (
                <p
                  role={hasError ? "alert" : "status"}
                  className={`text-xs sm:col-span-2 ${hasError ? "text-red-700" : "text-teal"}`}
                >
                  {feedback}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-10 items-center gap-2 bg-coral px-4 text-xs font-semibold text-paper hover:brightness-110 disabled:opacity-60"
                >
                  <Save aria-hidden="true" size={14} />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Add company"}
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  disabled={saving}
                  className="min-h-10 border border-ink/15 px-4 text-xs font-semibold text-ink hover:border-ink/40 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}