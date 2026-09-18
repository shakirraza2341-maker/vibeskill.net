import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth-guard";
import type { ResumeInput } from "../../../../lib/resume-types";

function cleanJson(text: string) { return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim(); }

export async function POST(request: Request) {
  const { response: authResponse } = await requireUser();
  if (authResponse) return authResponse;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  const isFileUpload = request.headers.get("content-type")?.includes("multipart/form-data");
  let body: ResumeInput | undefined;
  let file: File | null = null;
  if (isFileUpload) {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");
    if (!(uploadedFile instanceof File)) return NextResponse.json({ error: "Please choose a resume file" }, { status: 400 });
    file = uploadedFile;
  } else {
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  }
  const hasResumeText = Boolean(body?.rawText?.trim());
  if (!file && ((!hasResumeText && !body?.targetRole?.trim()) || (!hasResumeText && !body?.profile?.name?.trim()))) return NextResponse.json({ error: "A target role and resume content are required" }, { status: 400 });
  const prompt = file
    ? [
        "You are an ATS resume reviewer. Analyze the attached resume file.",
        "Return only valid JSON with score (integer 0-100), verdict, summary, strengths (array of strings), improvements (array of objects with title, detail, priority high|medium|low), and keywords (found and missing arrays).",
        "Be specific, truthful, and never invent candidate experience.",
      ].join("\n")
    : hasResumeText
    ? [
        "You are an ATS resume reviewer. Analyze the resume content below.",
        "Return only valid JSON with score (integer 0-100), verdict, summary, strengths (array of strings), improvements (array of objects with title, detail, priority high|medium|low), and keywords (found and missing arrays).",
        "Be specific, truthful, and never invent candidate experience. Resume content:",
        body!.rawText!.trim(),
      ].join("\n")
    : [
        "You are an ATS resume reviewer. Analyze the candidate resume against the target role.",
        `Target role: ${body!.targetRole}. Target company: ${body!.targetCompany || "not specified"}.`,
        "Return only valid JSON with score (integer 0-100), verdict, summary, strengths (array of strings), improvements (array of objects with title, detail, priority high|medium|low), and keywords (found and missing arrays).",
        "Be specific, truthful, and never invent candidate experience. Resume content:",
        JSON.stringify(body!.profile),
      ].join("\n");
  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const parts = file
      ? [{ text: prompt }, { inline_data: { mime_type: file.type || "application/pdf", data: Buffer.from(await file.arrayBuffer()).toString("base64") } }]
      : [{ text: prompt }];
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } }) });
    if (!response.ok) return NextResponse.json({ error: "Gemini could not review this resume" }, { status: 502 });
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") throw new Error("No analysis returned");
    const analysis = JSON.parse(cleanJson(text));
    if (typeof analysis.score !== "number" || !Array.isArray(analysis.improvements)) throw new Error("Invalid analysis");
    return NextResponse.json({ analysis });
  } catch (error) { console.error("Resume analysis failed:", error); return NextResponse.json({ error: "Unable to analyze this resume right now" }, { status: 502 }); }
}