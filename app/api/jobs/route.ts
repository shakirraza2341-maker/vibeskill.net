import { NextRequest, NextResponse } from "next/server";
import { createJob, listJobs } from "../../../lib/jobs-repository";
import { requireAdmin, requireEmployer } from "../../../lib/auth-guard";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if (guard.response) return guard.response;
  try {
    return NextResponse.json({ jobs: await listJobs() });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireEmployer();
  if (guard.response) return guard.response;
  try {
    const body = await request.json();
    const {
      company_name, title, description1, description2, category, required, minimum_salary,
      maximum_salary, country, city, location, remote_available, skills, apply_url,
    } = body;
    const errors: Record<string, string> = {};
    if (!company_name?.trim()) errors.company_name = "Company name is required";
    if (!category?.trim()) errors.category = "Category is required";
    if (!title?.trim()) errors.title = "Title is required";
    if (!description1?.trim()) errors.description1 = "Description is required";
    if (!description2?.trim()) errors.description2 = "Additional description is required";
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

    const job = await createJob({
      company_name: company_name.trim(), 
      title: title.trim(), 
      description1: description1.trim(),
      description2: description2.trim(),
      category: category.trim(), required: String(required),
      ...(minimum_salary !== undefined && minimum_salary !== "" ? { minimum_salary: Number(minimum_salary) } : {}),
      ...(maximum_salary !== undefined && maximum_salary !== "" ? { maximum_salary: Number(maximum_salary) } : {}),
      country: country.trim(), city: city.trim(),
      location: location.trim(), remote_available, skills: skills.map((skill: unknown) => String(skill).trim()),
      ...(apply_url?.trim() ? { apply_url: apply_url.trim() } : {}), is_active: true,
    });
    return NextResponse.json({ message: "Job created successfully", job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}