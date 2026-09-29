import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../../../lib/auth-guard";
import {
  deleteCompanyForUser,
  updateCompanyForUser,
} from "../../../../../lib/companies-repository";
import { validateCompanyDetails } from "../../../../../lib/company-validation";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  const guard = await requireUser();
  if (guard.response) return guard.response;

  try {
    const details = validateCompanyDetails(await request.json());
    if (typeof details === "string") {
      return NextResponse.json({ error: details }, { status: 400 });
    }
    const { id } = await params;
    const company = await updateCompanyForUser(
      guard.session!.user.id,
      id,
      details,
    );
    return company
      ? NextResponse.json({ company })
      : NextResponse.json({ error: "Company not found." }, { status: 404 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    console.error("Error updating company:", error);
    return NextResponse.json({ error: "Unable to update company." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const guard = await requireUser();
  if (guard.response) return guard.response;
  const { id } = await params;
  const deleted = await deleteCompanyForUser(guard.session!.user.id, id);
  return deleted
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Company not found." }, { status: 404 });
}