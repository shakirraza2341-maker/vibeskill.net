import { NextRequest, NextResponse } from "next/server";
import { deleteExpiredJobs } from "../../../../lib/jobs-repository";
import { requireAdmin } from "../../../../lib/auth-guard";

export const runtime = "nodejs";

async function cleanup(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.response) return guard.response;
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 20);
    const deletedJobs = await deleteExpiredJobs(cutoff);
    return NextResponse.json({
      message: `Successfully deleted ${deletedJobs.length} jobs older than 20 days`,
      deleted_count: deletedJobs.length,
      deleted_jobs: deletedJobs.map(({ id, title }) => ({ id, title })),
    });
  } catch (error) {
    console.error("Error cleaning up jobs:", error);
    return NextResponse.json({ error: "Failed to cleanup jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) { return cleanup(request); }
export async function GET(request: NextRequest) { return cleanup(request); }