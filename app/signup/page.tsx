"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to create your account.");
        return;
      }
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/profile",
      });
      if (!result?.ok) {
        setError("Account created. Please sign in to continue.");
        return;
      }
      window.location.assign(result.url ?? "/profile");
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md border border-ink/15 bg-paper p-8 shadow-[12px_12px_0_var(--color-mint)] sm:p-10">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-coral">
          VibeSkill workspace
        </p>
        <h1 className="font-display text-4xl tracking-[-0.04em]">
          Create your account
        </h1>
        <p className="mt-3 text-sm text-muted">
          Set up your workspace access in a few seconds.
        </p>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold">
            Full name
            <input
              className="border border-ink/20 bg-transparent px-3 py-3 font-normal outline-none focus:border-coral"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <input
              className="border border-ink/20 bg-transparent px-3 py-3 font-normal outline-none focus:border-coral"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Password
            <input
              className="border border-ink/20 bg-transparent px-3 py-3 font-normal outline-none focus:border-coral"
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <span className="text-xs font-normal text-muted">
              Use at least 8 characters.
            </span>
          </label>
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            className="bg-ink px-4 py-3 text-sm font-bold text-paper transition-colors hover:bg-coral disabled:opacity-60"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-7 text-sm text-muted">
          Already have an account?{" "}
          <Link
            className="font-bold text-ink underline decoration-coral underline-offset-4"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
