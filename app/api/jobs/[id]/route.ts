import { NextRequest, NextResponse } from "next/server";
import { deleteJob, findJob, updateJob } from "../../../../lib/jobs-repository";
import { requireAdmin } from "../../../../lib/auth-guard";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const job = await findJob((await params).id);
    return job ? NextResponse.json({ job }) : NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  const guard = await requireAdmin();
  if (guard.response) return guard.response;
  try {
    const id = (await params).id;
    const body = await request.json();
    const { company_name, title, description1, description2, category, required, minimum_salary, maximum_salary, country, city, location, remote_available, skills, apply_url, is_active } = body;
    const errors: Record<string, string> = {};
    if (!company_name?.trim()) errors.company_name = "Company name is required";
    if (!title?.trim()) errors.title = "Title is required";
    if (!description1?.trim()) errors.description1 = "Description is required";
    if (!description2?.trim()) errors.description2 = "Description 2 is required";
    if (!category?.trim()) errors.category = "Category is required";
    if (!required || Number(required) < 1) errors.required = "Required positions must be at least 1";
    if (minimum_salary !== undefined && minimum_salary !== "" && (!Number.isFinite(Number(minimum_salary)) || Number(minimum_salary) < 0)) errors.minimum_salary = "Minimum salary must be a valid number";
    if (maximum_salary !== undefined && maximum_salary !== "" && (!Number.isFinite(Number(maximum_salary)) || Number(maximum_salary) < 0)) errors.maximum_salary = "Maximum salary must be a valid number";
    if (minimum_salary !== undefined && minimum_salary !== "" && maximum_salary !== undefined && maximum_salary !== "" && Number(maximum_salary) < Number(minimum_salary)) errors.maximum_salary = "Maximum salary must be greater than minimum";
    if (!country?.trim()) errors.country = "Country is required";
    if (!city?.trim()) errors.city = "City is required";
    if (!location?.trim()) errors.location = "Location is required";
    if (typeof remote_available !== "boolean") errors.remote_available = "Remote availability is required";
    if (!Array.isArray(skills) || skills.length === 0) errors.skills = "At least one skill is required";
    if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });
    const job = await updateJob(id, {
      company_name: company_name.trim(), title: title.trim(), description1: description1.trim(), category: category.trim(), required: String(required),
      minimum_salary: minimum_salary !== undefined && minimum_salary !== "" ? Number(minimum_salary) : undefined,
      maximum_salary: maximum_salary !== undefined && maximum_salary !== "" ? Number(maximum_salary) : undefined,
      country: country.trim(), city: city.trim(), location: location.trim(),
      remote_available, skills: skills.map((skill: unknown) => String(skill).trim()),
      apply_url: apply_url?.trim() || undefined,
      ...(typeof is_active === "boolean" ? { is_active } : {}),
    });
    return job ? NextResponse.json({ message: "Job updated successfully", job }) : NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const guard = await requireAdmin();
  if (guard.response) return guard.response;
  try {
    const deleted = await deleteJob((await params).id);
    return deleted ? NextResponse.json({ message: "Job deleted successfully" }) : NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const guard = await requireAdmin();
  if (guard.response) return guard.response;
  try {
    const body = await request.json();
    if (typeof body.is_active !== "boolean") {
      return NextResponse.json({ error: "is_active must be a boolean" }, { status: 400 });
    }
    const job = await updateJob((await params).id, { is_active: body.is_active });
    return job ? NextResponse.json({ job }) : NextResponse.json({ error: "Job not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json({ error: "Failed to update job status" }, { status: 500 });
  }
}