import { NextResponse } from "next/server";
import { auth } from "../auth";

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

export async function requireEmployer() {
  const session = await auth();
  if (!session?.user?.id || !["admin", "employer"].includes(session.user.role)) {
    return { session: null, response: NextResponse.json({ error: "Approved employer access required" }, { status: 403 }) };
  }
  return { session, response: null };
}
