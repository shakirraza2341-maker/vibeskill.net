"use client";

import {
  Building2,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  LockKeyhole,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Profile = {
  name: string;
  email: string;
  role: "admin" | "user" | "employer";
  created_at: string;
  company_name: string;
  company_website: string;
  company_telephone: string;
  company_address: string;
  company_ntn: string;
};

type CompanyDetails = Pick<
  Profile,
  | "company_name"
  | "company_website"
  | "company_telephone"
  | "company_address"
  | "company_ntn"
>;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function ProfileDashboard({ profile }: { profile: Profile }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);
  const [company, setCompany] = useState<CompanyDetails>(() => ({
    company_name: profile.company_name,
    company_website: profile.company_website,
    company_telephone: profile.company_telephone,
    company_address: profile.company_address,
    company_ntn: profile.company_ntn,
  }));
  const [companyForm, setCompanyForm] = useState<CompanyDetails>(company);
  const [editingCompany, setEditingCompany] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [companyFeedback, setCompanyFeedback] = useState("");
  const [companyError, setCompanyError] = useState(false);
  const hasCompany = Boolean(
    company.company_name ||
    company.company_website ||
    company.company_telephone ||
    company.company_address ||
    company.company_ntn,
  );

  function cancelCompanyEdit() {
    setCompanyForm(company);
    setEditingCompany(false);
    setCompanyFeedback("");
    setCompanyError(false);
  }

  async function saveCompany(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingCompany(true);
    setCompanyFeedback("");
    setCompanyError(false);

    try {
      const response = await fetch("/api/profile/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save company details.");
      }

      setCompany(data.company as CompanyDetails);
      setCompanyForm(data.company as CompanyDetails);
      setEditingCompany(false);
      setCompanyFeedback("Company details saved.");
    } catch (error) {
      setCompanyError(true);
      setCompanyFeedback(
        error instanceof Error
          ? error.message
          : "Unable to save company details.",
      );
    } finally {
      setSavingCompany(false);
    }
  }

  async function submitPasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setHasError(false);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setHasError(true);
      setFeedback("Your new password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update your password.");
      }

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFeedback("Password updated successfully.");
    } catch (error) {
      setHasError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to update your password.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-[900px] px-4 pb-12 pt-7 sm:px-7 sm:pt-9">
      <h1 className="mb-5 border-b border-white/10 pb-3 font-display text-3xl text-ink">
        My Profile
      </h1>

      <section className="mb-4 flex items-center gap-4 border border-white/10 bg-cream p-5 sm:px-7">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-teal/15 text-sm font-bold text-teal">
          {initials(profile.name)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-ink">
            {profile.name}
          </h2>
          <p className="mt-1 text-[11px] capitalize text-muted">
            {profile.role}
          </p>
          <p className="mt-1 truncate text-[11px] text-muted">
            {profile.email}
          </p>
        </div>
        <div>
          {profile.role?.trim().toLowerCase() === "admin" ? (
            <Link href="/admin">
              {" "}
              <button
                type="button"
                className="!inline-flex !min-h-10 !items-center !gap-2 !bg-coral !px-4 !py-2 !text-[12px] !font-semibold !text-paper hover:!brightness-110"
              >
                
                Go To Admin Page
              </button>
            </Link>
          ) : (
            ""
          )}
        </div>
      </section>

      <section className="mb-4 border border-white/10 bg-cream p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Building2 aria-hidden="true" className="text-coral" size={18} />
            <div>
              <h2 className="font-display text-xl text-ink">
                Company Information
              </h2>
              <p className="mt-1 text-[11px] text-muted">
                Add your business details to your profile.
              </p>
            </div>
          </div>
        </div>

        {editingCompany ? (
          <form onSubmit={saveCompany} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <CompanyInput
                label="Company name"
                required
                maxLength={150}
                value={companyForm.company_name}
                onChange={(value) =>
                  setCompanyForm((current) => ({
                    ...current,
                    company_name: value,
                  }))
                }
              />
              <CompanyInput
                label="Website"
                type="text"
                inputMode="url"
                placeholder="https://example.com"
                required
                maxLength={300}
                value={companyForm.company_website}
                onChange={(value) =>
                  setCompanyForm((current) => ({
                    ...current,
                    company_website: value,
                  }))
                }
              />
              <CompanyInput
                label="Telephone"
                type="tel"
                required
                maxLength={30}
                value={companyForm.company_telephone}
                onChange={(value) =>
                  setCompanyForm((current) => ({
                    ...current,
                    company_telephone: value,
                  }))
                }
              />
              <CompanyInput
                label="NTN number"
                required
                maxLength={50}
                value={companyForm.company_ntn}
                onChange={(value) =>
                  setCompanyForm((current) => ({
                    ...current,
                    company_ntn: value,
                  }))
                }
              />
              <label className="grid gap-2 text-[11px] font-medium text-muted sm:col-span-2">
                Company address
                <textarea
                  required
                  minLength={5}
                  maxLength={300}
                  rows={3}
                  value={companyForm.company_address}
                  onChange={(event) =>
                    setCompanyForm((current) => ({
                      ...current,
                      company_address: event.target.value,
                    }))
                  }
                  className="!w-full !resize-y !border !border-white/15 !bg-paper !px-3 !py-2.5 !text-[12px] !text-ink placeholder:!text-muted focus:!border-teal focus:!outline-none"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={savingCompany}
                className="!inline-flex !min-h-10 !items-center !gap-2 !bg-coral !px-4 !py-2 !text-[12px] !font-semibold !text-paper hover:!brightness-110 disabled:!opacity-60"
              >
                <Save aria-hidden="true" size={14} />
                {savingCompany ? "Saving..." : "Save company"}
              </button>
              <button
                type="button"
                disabled={savingCompany}
                onClick={cancelCompanyEdit}
                className="!inline-flex !min-h-10 !items-center !gap-2 !border !border-white/15 !bg-transparent !px-4 !py-2 !text-[12px] !font-medium !text-ink hover:!border-muted"
              >
                <X aria-hidden="true" size={14} />
                Cancel
              </button>
              {companyFeedback && (
                <p
                  role={companyError ? "alert" : "status"}
                  className={`text-[11px] ${companyError ? "text-red-400" : "text-teal"}`}
                >
                  {companyFeedback}
                </p>
              )}
            </div>
          </form>
        ) : hasCompany ? (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <p>
                Your company information is currently saved. If your company is
                verified by the admin then you can add jobs.
              </p>
            </dl>
            <div>
              {profile.role?.trim().toLowerCase() === "employer"
                ? "Verified"
                : "Submission Pending"}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-[12px] leading-5 text-muted">
              Add Your Company Information To Become An Employer.
            </p>
            <button
              type="button"
              onClick={() => {
                setCompanyFeedback("");
                setEditingCompany(true);
              }}
              className="!inline-flex !min-h-10 !items-center !gap-2 !bg-coral !px-4 !py-2 !text-[12px] !font-semibold !text-paper hover:!brightness-110"
            >
              <Plus aria-hidden="true" size={15} />
              Add company
            </button>
          </div>
        )}
      </section>

      <section className="border border-white/10 bg-cream p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
          <UserRound aria-hidden="true" className="text-coral" size={18} />
          <h2 className="font-display text-xl text-ink">
            Personal Information
          </h2>
        </div>

        <dl className="grid gap-x-8 gap-y-5 border-b border-white/10 pb-6 sm:grid-cols-2">
          <div>
            <dt className="mb-1 text-[10px] uppercase text-muted">Name</dt>
            <dd className="break-words text-[13px] text-ink">{profile.name}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[10px] uppercase text-muted">
              Email address
            </dt>
            <dd className="break-all text-[13px] text-ink">{profile.email}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[10px] uppercase text-muted">
              Account type
            </dt>
            <dd className="text-[13px] capitalize text-ink">{profile.role}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[10px] uppercase text-muted">
              Member since
            </dt>
            <dd className="text-[13px] text-ink">
              {formatDate(profile.created_at)}
            </dd>
          </div>
        </dl>

        <div className="pt-6">
          <div className="mb-5 flex items-center gap-3">
            <LockKeyhole aria-hidden="true" className="text-teal" size={17} />
            <div>
              <h3 className="text-[14px] font-semibold text-ink">
                Change Password
              </h3>
              <p className="mt-1 text-[11px] text-muted">
                Enter your current password and choose a new one.
              </p>
            </div>
          </div>

          <form
            onSubmit={submitPasswordChange}
            className="grid max-w-[560px] gap-4"
          >
            <PasswordField
              label="Current password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              visible={showPasswords}
              onChange={(value) =>
                setPasswords((current) => ({
                  ...current,
                  currentPassword: value,
                }))
              }
              onToggleVisibility={() => setShowPasswords((visible) => !visible)}
            />
            <PasswordField
              label="New password"
              autoComplete="new-password"
              value={passwords.newPassword}
              visible={showPasswords}
              minLength={8}
              onChange={(value) =>
                setPasswords((current) => ({
                  ...current,
                  newPassword: value,
                }))
              }
              onToggleVisibility={() => setShowPasswords((visible) => !visible)}
            />
            <PasswordField
              label="Confirm new password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              visible={showPasswords}
              minLength={8}
              onChange={(value) =>
                setPasswords((current) => ({
                  ...current,
                  confirmPassword: value,
                }))
              }
              onToggleVisibility={() => setShowPasswords((visible) => !visible)}
            />
            <p className="-mt-1 text-[10px] text-muted">
              Use at least 8 characters.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="!inline-flex !min-h-10 !items-center !gap-2 !bg-coral !px-4 !py-2 !text-[12px] !font-semibold !text-paper hover:!brightness-110 disabled:!cursor-not-allowed disabled:!opacity-60"
              >
                <KeyRound aria-hidden="true" size={15} />
                {saving ? "Updating..." : "Update password"}
              </button>
              {feedback && (
                <p
                  role={hasError ? "alert" : "status"}
                  className={`text-[11px] ${hasError ? "text-red-400" : "text-teal"}`}
                >
                  {feedback}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function PasswordField({
  label,
  autoComplete,
  value,
  visible,
  onChange,
  onToggleVisibility,
  minLength,
}: {
  label: string;
  autoComplete: "current-password" | "new-password";
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
  minLength?: number;
}) {
  return (
    <label className="grid gap-2 text-[11px] font-medium text-muted">
      {label}
      <span className="flex h-10 items-center border border-white/15 bg-paper focus-within:border-teal">
        <input
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 !border-0 !bg-transparent !px-3 !py-2 !text-[12px] !text-ink !outline-none"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          className="!grid !size-9 !shrink-0 !place-items-center !bg-transparent !p-0 !text-muted hover:!text-ink"
        >
          {visible ? (
            <EyeOff aria-hidden="true" size={15} />
          ) : (
            <Eye aria-hidden="true" size={15} />
          )}
        </button>
      </span>
    </label>
  );
}

function CompanyInput({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  required = false,
  minLength,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "tel";
  inputMode?: "url";
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <label className="grid gap-2 text-[11px] font-medium text-muted">
      {label}
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="!h-10 !w-full !border !border-white/15 !bg-paper !px-3 !py-2 !text-[12px] !text-ink placeholder:!text-muted focus:!border-teal focus:!outline-none"
      />
    </label>
  );
}

function CompanyValue({
  label,
  value,
  icon,
  href,
  className = "",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
  className?: string;
}) {
  if (!value.trim()) return null;

  const safeHref = href && /^https?:\/\//i.test(href) ? href : undefined;

  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="mb-1.5 text-[10px] uppercase text-muted">{label}</dt>
      <dd className="flex min-w-0 items-start gap-2 text-[12px] text-ink">
        <span className="mt-0.5 shrink-0 text-teal">{icon}</span>
        {safeHref ? (
          <a
            href={safeHref}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 break-all underline decoration-white/20 underline-offset-2 hover:text-teal"
          >
            {value}
          </a>
        ) : (
          <span className="min-w-0 break-words">{value}</span>
        )}
      </dd>
    </div>
  );
}
