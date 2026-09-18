import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { MongoServerError } from "mongodb";
import { createUser, findUserByEmail } from "../../../../lib/users-repository";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (name.length < 2) return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    if (await findUserByEmail(email)) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

    const user = await createUser({ name, email, password_hash: await bcrypt.hash(password, 12), role: "user" });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000)
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
