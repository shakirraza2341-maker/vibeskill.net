import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth-guard";
import {
  findUserById,
  updateUserPassword,
} from "../../../../lib/users-repository";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const guard = await requireUser();
  if (guard.response) return guard.response;

  try {
    const body = await request.json();
    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Enter your current and new password." },
        { status: 400 },
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const user = await findUserById(guard.session!.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const currentPasswordMatches = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );
    if (!currentPasswordMatches) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );
    }

    if (await bcrypt.compare(newPassword, user.password_hash)) {
      return NextResponse.json(
        { error: "Choose a password you have not used before." },
        { status: 400 },
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    const updated = await updateUserPassword(
      guard.session!.user.id,
      user.password_hash,
      newPasswordHash,
    );
    if (!updated) {
      return NextResponse.json(
        { error: "Password changed during this request. Please try again." },
        { status: 409 },
      );
    }

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Unable to update your password." },
      { status: 500 },
    );
  }
}