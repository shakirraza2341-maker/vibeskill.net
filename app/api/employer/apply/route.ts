import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth-guard";
import { findUserById, submitEmployerApplication } from "../../../../lib/users-repository";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const guard = await requireUser();
  if (guard.response) return guard.response;
  try {
    const current = await findUserById(guard.session!.user.id);
    if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (current.role === "admin" || current.role === "employer") {
      return NextResponse.json({ error: "Your account already has employer access" }, { status: 409 });
    }
    if (current.employer_status === "pending") {
      return NextResponse.json({ error: "Your application is already under review" }, { status: 409 });
    }
    const body = await request.json();
    const company_name = String(body.company_name ?? "").trim();
    const company_website = String(body.company_website ?? "").trim();
    const employer_reason = String(body.employer_reason ?? "").trim();
    if (company_name.length < 2 || company_name.length > 150) {
      return NextResponse.json({ error: "Company name must be 2-150 characters" }, { status: 400 });
    }
    if (employer_reason.length < 20 || employer_reason.length > 1500) {
      return NextResponse.json({ error: "Please provide 20-1500 characters explaining your hiring needs" }, { status: 400 });
    }
    const user = await submitEmployerApplication(guard.session!.user.id, {
      company_name,
      company_website: company_website || undefined,
      employer_reason,
    });
    return user ? NextResponse.json({ user }) : NextResponse.json({ error: "Unable to submit application" }, { status: 409 });
  } catch (error) {
    console.error("Error submitting employer application:", error);
    return NextResponse.json({ error: "Failed to submit employer application" }, { status: 500 });
  }
}
