"use client";

import { useState } from "react";

export default function EmployerApplyPage() {
  const [form, setForm] = useState({
    company_name: "",
    company_website: "",
    employer_reason: "",
  });
  const [status, setStatus] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Submitting...");
    const response = await fetch("/api/employer/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setStatus(
      response.ok
        ? "Application submitted for admin review."
        : (data.error ?? "Unable to submit application."),
    );
  }
  return (
    <main className="mx-auto min-h-screen max-w-2xl py-12">
      <a className="text-sm font-bold text-coral" href="/">
        ← Home
      </a>
      <h1 className="mt-8 font-display text-5xl">Apply as an employer</h1>
      <p className="mt-3 text-muted">
        Employer access requires review before you can publish jobs.
      </p>
      <form className="mt-8 grid gap-5" onSubmit={submit}>
        <label className="grid gap-2 text-sm font-bold">
          Company name
          <input
            className="border border-ink/20 bg-transparent px-3 py-3 font-normal"
            required
            value={form.company_name}
            onChange={(event) =>
              setForm({ ...form, company_name: event.target.value })
            }
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Company website
          <input
            className="border border-ink/20 bg-transparent px-3 py-3 font-normal"
            value={form.company_website}
            onChange={(event) =>
              setForm({ ...form, company_website: event.target.value })
            }
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Why are you hiring?
          <textarea
            className="min-h-40 border border-ink/20 bg-transparent px-3 py-3 font-normal"
            required
            value={form.employer_reason}
            onChange={(event) =>
              setForm({ ...form, employer_reason: event.target.value })
            }
          />
        </label>
        <button
          className="w-fit bg-ink px-5 py-3 text-sm font-bold text-paper"
          type="submit"
        >
          Submit for verification
        </button>
        {status && <p className="text-sm text-muted">{status}</p>}
      </form>
    </main>
  );
}
