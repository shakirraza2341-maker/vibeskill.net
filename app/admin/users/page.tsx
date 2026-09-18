"use client";

import { useEffect, useState } from "react";
import AdminShell from "../../../components/admin/AdminShell";

type User = { id: string; name: string; email: string; role: "admin" | "user" | "employer"; employer_status: "none" | "pending" | "approved" | "rejected"; company_name?: string; created_at: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  async function load() {
    const response = await fetch("/api/admin/users");
    const data = await response.json();
    if (!response.ok) return setError(data.error ?? "Unable to load users");
    setUsers(data.users ?? []);
  }
  async function update(userId: string, field: "role" | "employer_status", value: string) {
    setSavingId(userId);
    const response = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, [field]: value }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Unable to update user");
    else setUsers((current) => current.map((user) => user.id === userId ? data.user : user));
    setSavingId("");
  }
  useEffect(() => { void load(); }, []);
  const visibleUsers = users.filter((user) => `${user.name} ${user.email} ${user.company_name ?? ""}`.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || user.role === filter || user.employer_status === filter));

  return <AdminShell title="Users" eyebrow="Account operations"><div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e15a3d]">Directory</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Users</h1><p className="mt-2 text-sm text-slate-500">Manage every account, role, and verification state.</p></div><div className="flex gap-2 text-xs font-bold"><span className="rounded-lg bg-white px-3 py-2 shadow-sm">{users.length} total</span><span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">{users.filter((user) => user.employer_status === "pending").length} pending</span></div></div>{error && <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700" role="alert">{error}</p>}<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row"><input className="min-h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#e15a3d]" onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or company" value={query} /><select className="rounded-lg border border-slate-200 px-3 text-sm" onChange={(event) => setFilter(event.target.value)} value={filter}><option value="all">All users</option><option value="admin">Admins</option><option value="employer">Employers</option><option value="pending">Pending applications</option><option value="rejected">Rejected</option></select></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Company</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Employer status</th><th className="px-5 py-4">Created</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleUsers.map((user) => <tr key={user.id}><td className="px-5 py-4"><strong>{user.name}</strong><span className="mt-1 block text-xs text-slate-500">{user.email}</span></td><td className="px-5 py-4 text-slate-600">{user.company_name || "-"}</td><td className="px-5 py-4"><select className="rounded-md border border-slate-200 px-2 py-2 text-xs font-bold" disabled={savingId === user.id} onChange={(event) => void update(user.id, "role", event.target.value)} value={user.role}><option value="user">User</option><option value="employer">Employer</option><option value="admin">Admin</option></select></td><td className="px-5 py-4"><select className="rounded-md border border-slate-200 px-2 py-2 text-xs font-bold" disabled={savingId === user.id} onChange={(event) => void update(user.id, "employer_status", event.target.value)} value={user.employer_status}><option value="none">None</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></td><td className="px-5 py-4 text-xs text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>{!visibleUsers.length && <p className="p-8 text-center text-sm text-slate-500">No users match these filters.</p>}</div></AdminShell>;
}
