import Link from "next/link";
import { listUsers } from "../../lib/users-repository";
import AdminShell from "../../components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const users = await listUsers();
  const pending = users.filter((user) => user.employer_status === "pending").length;
  const employers = users.filter((user) => user.role === "employer").length;

  return (
    <AdminShell title="Overview" eyebrow="Control center">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e15a3d]">Administration</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Control center</h1>
            <p className="mt-2 text-sm text-slate-500">Review access, employer verification, and job operations.</p>
          </div>
          <Link className="admin-primary-button w-fit" href="/admin/jobs">Manage jobs <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[["Total users", users.length], ["Approved employers", employers], ["Pending reviews", pending]].map(([label, value]) => (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={label as string}>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
              <strong className="mt-3 block text-4xl">{value}</strong>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#e15a3d]" href="/admin/users">
            <strong className="text-lg">Users and verification</strong>
            <p className="mt-2 text-sm text-slate-500">Review employer applications and manage account access.</p>
          </Link>
          <Link className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#e15a3d]" href="/admin/jobs">
            <strong className="text-lg">Job listings</strong>
            <p className="mt-2 text-sm text-slate-500">Create, edit, remove, and clean up roles.</p>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
