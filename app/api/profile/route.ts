import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../lib/auth-guard";
import { findUserById, updateUserProfile } from "../../../lib/users-repository";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireUser();
  if (guard.response) return guard.response;
  const user = await findUserById(guard.session!.user.id);
  return user
    ? NextResponse.json({ user: { ...user, password_hash: undefined } })
    : NextResponse.json({ error: "User not found" }, { status: 404 });
}

export async function PUT(request: NextRequest) {
  const guard = await requireUser();
  if (guard.response) return guard.response;
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const bio = String(body.bio ?? "").trim();
    const company_name = String(body.company_name ?? "").trim();
    const company_website = String(body.company_website ?? "").trim();
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Name must be 2-100 characters" }, { status: 400 });
    }
    if (bio.length > 1000 || company_name.length > 150 || company_website.length > 300) {
      return NextResponse.json({ error: "One or more fields are too long" }, { status: 400 });
    }
    const user = await updateUserProfile(guard.session!.user.id, {
      name,
      phone: phone || undefined,
      bio: bio || undefined,
      company_name: company_name || undefined,
      company_website: company_website || undefined,
    });
    return user ? NextResponse.json({ user }) : NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
