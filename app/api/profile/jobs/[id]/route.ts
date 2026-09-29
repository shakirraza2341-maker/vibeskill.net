import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireEmployerRole } from "../../../../../lib/auth-guard";
import { listCompaniesForUser } from "../../../../../lib/companies-repository";
import { deleteJobForCompanies, updateJobForCompanies } from "../../../../../lib/jobs-repository";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

function validateJob(body: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  for (const field of ["title", "description1", "description2", "category", "country", "city", "location"] as const) {
    if (typeof body[field] !== "string" || !body[field].trim()) errors[field] = `${field} is required`;
  }
  if (!body.required || Number(body.required) < 1) errors.required = "Required positions must be at least 1";
  for (const field of ["minimum_salary", "maximum_salary"] as const) {
    const value = body[field];
    if (value !== undefined && value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) errors[field] = "Salary must be a valid non-negative number";
  }
  if (body.minimum_salary !== undefined && body.minimum_salary !== "" && body.maximum_salary !== undefined && body.maximum_salary !== "" && Number(body.maximum_salary) < Number(body.minimum_salary)) errors.maximum_salary = "Maximum salary must be greater than minimum";
  if (typeof body.remote_available !== "boolean") errors.remote_available = "Remote availability is required";
  if (!Array.isArray(body.skills) || body.skills.length === 0) errors.skills = "At least one skill is required";
  return errors;
}

export async function PUT(request: NextRequest, { params }: Context) {
  const guard = await requireEmployerRole();
  if (guard.response) return guard.response;
  try {
    const body = await request.json();
    const errors = validateJob(body);
    if (body.userId !== guard.session!.user.id) {
      errors.userId = "A valid session user ID is required";
    }
    const companies = await listCompaniesForUser(guard.session!.user.id);
    const company = companies.find(
      (item) => item.id === String(body.company_id ?? "") || item.company_name === String(body.company_name ?? ""),
    );
    if (!company) errors.company_id = "Choose a company registered to your account";
    if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

    const job = await updateJobForCompanies((await params).id, companies.map((item) => item.id), {
      company_id: new ObjectId(company!.id),
      user_id: new ObjectId(guard.session!.user.id),
      company_name: company!.company_name,
      title: String(body.title).trim(),
      description1: String(body.description1).trim(),
      description2: String(body.description2).trim(),
      category: String(body.category).trim(),
      required: String(body.required),
      minimum_salary: body.minimum_salary !== undefined && body.minimum_salary !== "" ? Number(body.minimum_salary) : undefined,
      maximum_salary: body.maximum_salary !== undefined && body.maximum_salary !== "" ? Number(body.maximum_salary) : undefined,
      country: String(body.country).trim(),
      city: String(body.city).trim(),
      location: String(body.location).trim(),
      remote_available: body.remote_available as boolean,
      skills: (body.skills as unknown[]).map((skill) => String(skill).trim()),
      apply_url: typeof body.apply_url === "string" && body.apply_url.trim() ? body.apply_url.trim() : undefined,
    });
    return job ? NextResponse.json({ job }) : NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating employer job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const guard = await requireEmployerRole();
  if (guard.response) return guard.response;
  try {
    const companies = await listCompaniesForUser(guard.session!.user.id);
    const deleted = await deleteJobForCompanies((await params).id, companies.map((company) => company.id));
    return deleted ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error deleting employer job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}