import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth-guard";
import {
  createCompanyForUser,
  listCompaniesForUser,
  saveCompanyForUser,
} from "../../../../lib/companies-repository";
import { validateCompanyDetails } from "../../../../lib/company-validation";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireUser();
  if (guard.response) return guard.response;
  const companies = await listCompaniesForUser(guard.session!.user.id);
  return NextResponse.json({ companies });
}

export async function POST(request: NextRequest) {
  const guard = await requireUser();
  if (guard.response) return guard.response;

  try {
    const details = validateCompanyDetails(await request.json());
    if (typeof details === "string") {
      return NextResponse.json({ error: details }, { status: 400 });
    }
    const company = await createCompanyForUser(guard.session!.user.id, details);
    if (!company) {
      return NextResponse.json({ error: "Unable to add company." }, { status: 400 });
    }
    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }
    console.error("Error saving company profile:", error);
    return NextResponse.json(
      { error: "Unable to add company." },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const guard = await requireUser();
  if (guard.response) return guard.response;
  try {
    const details = validateCompanyDetails(await request.json());
    if (typeof details === "string") {
      return NextResponse.json({ error: details }, { status: 400 });
    }
    const company = await saveCompanyForUser(guard.session!.user.id, details);
    return company
      ? NextResponse.json({
          company: {
            company_name: company.company_name,
            company_website: company.company_website,
            company_telephone: company.company_telephone,
            company_address: company.company_address,
            company_ntn: company.company_ntn,
          },
        })
      : NextResponse.json({ error: "Unable to save company details." }, { status: 400 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    console.error("Error saving company profile:", error);
    return NextResponse.json({ error: "Unable to save company details." }, { status: 500 });
  }
}