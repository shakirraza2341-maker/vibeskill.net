import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/auth-guard";
import { listUsers, reviewEmployerApplication, updateUserAdmin, type EmployerStatus, type UserRole } from "../../../../lib/users-repository";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if (guard.response) return guard.response;
  return NextResponse.json({ users: await listUsers() });
}

export async function PATCH(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.response) return guard.response;
  try {
    const body = await request.json();
    const userId = String(body.userId ?? "");
    const role = ["admin", "user", "employer"].includes(body.role) ? body.role as UserRole : undefined;
    const employerStatus = ["none", "pending", "approved", "rejected"].includes(body.employer_status) ? body.employer_status as EmployerStatus : undefined;
    const status = body.status === "approved" || body.status === "rejected" ? body.status : undefined;
    if (!role && !employerStatus && !status) return NextResponse.json({ error: "Invalid user update" }, { status: 400 });
    const user = status
      ? await reviewEmployerApplication(userId, status, guard.session!.user.id)
      : await updateUserAdmin(userId, { role, employer_status: employerStatus });
    return user ? NextResponse.json({ user }) : NextResponse.json({ error: "Pending application not found" }, { status: 404 });
  } catch (error) {
    console.error("Error reviewing employer application:", error);
    return NextResponse.json({ error: "Failed to review application" }, { status: 500 });
  }
}
