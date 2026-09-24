import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth-guard";
import type { ResumeInput } from "../../../../lib/resume-types";

export const runtime = "nodejs";

function cleanJson(text: string) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
}

function getGeminiModels() {
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const normalizedModel = configuredModel && /^gemini-3\.6-flash$/i.test(configuredModel)
    ? "gemini-3.6-flash"
    : configuredModel || "gemini-3.6-flash";
  return [...new Set([normalizedModel, "gemini-3.6-flash"])];
}

function getGeminiIssueMessage(details: string, fallback: string) {
  try {
    const errorBody = JSON.parse(details);
    const message = typeof errorBody?.error?.message === "string" ? errorBody.error.message : "";
    if (message.toLowerCase().includes("api key")) {
      return "Gemini API key is invalid or expired. Update GEMINI_API_KEY in your environment and restart the app.";
    }
    if (message) return message;
  } catch {
    // Response may not be JSON.
  }
  if (details.toLowerCase().includes("api key")) {
    return "Gemini API key is invalid or expired. Update GEMINI_API_KEY in your environment and restart the app.";
  }
  return fallback;
}

function normalizeAnalysis(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Invalid analysis");
  const analysis = value as Record<string, unknown>;
  if (typeof analysis.score !== "number") throw new Error("Invalid analysis score");
  return {
    score: Math.max(0, Math.min(100, Math.round(analysis.score))),
    verdict: typeof analysis.verdict === "string" ? analysis.verdict : "Needs review",
    summary: typeof analysis.summary === "string" ? analysis.summary : "Review the improvements below.",
    strengths: Array.isArray(analysis.strengths) ? analysis.strengths.filter((item): item is string => typeof item === "string") : [],
    improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
    keywords: analysis.keywords && typeof analysis.keywords === "object"
      ? analysis.keywords
      : { found: [], missing: [] },
  };
}

async function postResumeAnalysis(request: Request) {
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
  const resumeText = body?.rawText?.trim().replace(/\u0000/g, "").slice(0, 120000);
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
        resumeText,
      ].join("\n")
    : [
        "You are an ATS resume reviewer. Analyze the candidate resume against the target role.",
        `Target role: ${body!.targetRole}. Target company: ${body!.targetCompany || "not specified"}.`,
        "Return only valid JSON with score (integer 0-100), verdict, summary, strengths (array of strings), improvements (array of objects with title, detail, priority high|medium|low), and keywords (found and missing arrays).",
        "Be specific, truthful, and never invent candidate experience. Resume content:",
        JSON.stringify(body!.profile),
      ].join("\n");
  try {
    const models = getGeminiModels();
    const parts = file
      ? [{ text: prompt }, { inlineData: { mimeType: file.type || "application/pdf", data: Buffer.from(await file.arrayBuffer()).toString("base64") } }]
      : [{ text: prompt }];
    let lastError = "Gemini could not review this resume";
    for (const model of models) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 2048 },
        }),
      });
      const details = await response.text();
      if (!response.ok) {
        lastError = getGeminiIssueMessage(details, `Gemini ${response.status} (${model})`);
        console.error("Gemini resume analysis failed:", lastError, details);
        continue;
      }
      try {
        const result = JSON.parse(details);
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text !== "string") {
          lastError = `Gemini returned no analysis (${model})`;
          continue;
        }
        try {
          return NextResponse.json({ analysis: normalizeAnalysis(JSON.parse(cleanJson(text))) });
        } catch (parseError) {
          lastError = `Gemini returned invalid analysis (${model})`;
          console.error("Gemini resume analysis response was invalid:", parseError, text);
        }
      } catch (parseError) {
        lastError = `Gemini returned a non-JSON response (${model})`;
        console.error("Gemini resume analysis had non-JSON payload:", parseError, details);
      }
    }
    throw new Error(lastError);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze this resume right now. Please try again.";
    console.error("Resume analysis failed:", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    return await postResumeAnalysis(request);
  } catch (error) {
    console.error("Resume analysis request failed:", error);
    const message = error instanceof Error ? error.message : "Unable to analyze this resume right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}