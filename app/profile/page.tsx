"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", phone: "", bio: "", company_name: "", company_website: "" });
  const [status, setStatus] = useState("");
  useEffect(() => { fetch("/api/profile").then((response) => response.json()).then((data) => { if (data.user) setForm({ name: data.user.name ?? "", phone: data.user.phone ?? "", bio: data.user.bio ?? "", company_name: data.user.company_name ?? "", company_website: data.user.company_website ?? "" }); }); }, []);
  async function submit(event: React.FormEvent) { event.preventDefault(); setStatus("Saving..."); const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); setStatus(response.ok ? "Profile saved." : "Unable to save profile."); }
  return <main className="mx-auto min-h-screen max-w-2xl py-12"><a className="text-sm font-bold text-coral" href="/">← Home</a><h1 className="mt-8 font-display text-5xl">Your profile</h1><form className="mt-8 grid gap-5" onSubmit={submit}>{Object.entries(form).map(([key, value]) => <label className="grid gap-2 text-sm font-bold" key={key}>{key.replaceAll("_", " ")}<input className="border border-ink/20 bg-transparent px-3 py-3 font-normal" value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>)}<button className="w-fit bg-ink px-5 py-3 text-sm font-bold text-paper" type="submit">Save profile</button>{status && <p className="text-sm text-muted">{status}</p>}</form></main>;
}
