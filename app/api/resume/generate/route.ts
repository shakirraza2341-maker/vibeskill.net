import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/auth-guard";
import type { ResumeInput } from "../../../../lib/resume-types";

function cleanJson(text: string) {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

function getGeminiModels() {
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const normalizedModel = configuredModel && /^gemini-3\.6-flash$/i.test(configuredModel)
    ? "gemini-2.5-flash"
    : configuredModel || "gemini-2.5-flash";
  return [...new Set([normalizedModel, "gemini-2.5-flash"])];
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
  if (!file && ((!hasResumeText && !body?.targetRole?.trim()) || (!hasResumeText && (!body?.profile?.name?.trim() || !body?.profile?.email?.trim())))) return NextResponse.json({ error: "A target role and resume content are required" }, { status: 400 });
  const prompt = file
    ? [
        "You are an expert resume writer. Create an ATS-friendly resume using only the attached resume file. Preserve factual details while improving structure and clarity.",
        `The candidate selected the ${body?.template || "classic"} resume template. Keep the content concise and structured for that layout.`,
        "Rewrite for clarity and impact, quantify only when evidence exists, and never invent employers, dates, metrics, or qualifications.",
        "Return only valid JSON with name, headline, contact, summary, skills (array), experience (array of role, company, dates, bullets array), education (array of school, degree, dates), and projects (array of name, detail).",
      ].join("\n")
    : hasResumeText
    ? [
        "You are an expert resume writer. Create an ATS-friendly resume using only the resume content below. Preserve its factual details while improving structure and clarity.",
        `The candidate selected the ${body?.template || "classic"} resume template. Keep the content concise and structured for that layout.`,
        "Rewrite for clarity and impact, quantify only when evidence exists, and never invent employers, dates, metrics, or qualifications.",
        "Return only valid JSON with name, headline, contact, summary, skills (array), experience (array of role, company, dates, bullets array), education (array of school, degree, dates), and projects (array of name, detail).",
        "Existing resume text:",
        body!.rawText!.trim(),
      ].join("\n")
    : [
        "You are an expert resume writer. Create an ATS-friendly resume using only the candidate information below.",
        `Target role: ${body!.targetRole}. Target company: ${body!.targetCompany || "not specified"}.`,
        `The candidate selected the ${body!.template || "classic"} resume template. Keep the content concise and structured for that layout.`,
        "Rewrite for clarity and impact, quantify only when evidence exists, and never invent employers, dates, metrics, or qualifications.",
        "Return only valid JSON with name, headline, contact, summary, skills (array), experience (array of role, company, dates, bullets array), education (array of school, degree, dates), and projects (array of name, detail).",
        JSON.stringify(body!.profile),
      ].join("\n");
  try {
    const models = getGeminiModels();
    const parts = file
      ? [{ text: prompt }, { inlineData: { mimeType: file.type || "application/pdf", data: Buffer.from(await file.arrayBuffer()).toString("base64") } }]
      : [{ text: prompt }];
    let lastError = "Gemini could not build this resume";
    for (const model of models) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
        }),
      });
      const details = await response.text();
      if (!response.ok) {
        lastError = getGeminiIssueMessage(details, `Gemini ${response.status} (${model})`);
        console.error("Gemini resume generation failed:", lastError, details);
        continue;
      }
      try {
        const result = JSON.parse(details);
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text !== "string") throw new Error("Gemini returned no resume content");
        const resume = JSON.parse(cleanJson(text));
        if (typeof resume.name !== "string" || !resume.name.trim() || !Array.isArray(resume.skills)) {
          throw new Error("Gemini returned an invalid resume");
        }
        return NextResponse.json({ resume });
      } catch (parseError) {
        lastError = `Gemini returned invalid content (${model})`;
        console.error("Gemini resume generation response was invalid:", parseError, details);
      }
    }
    throw new Error(lastError);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to build this resume right now";
    console.error("Resume generation failed:", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}