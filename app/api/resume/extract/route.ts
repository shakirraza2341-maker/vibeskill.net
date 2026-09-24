import { NextResponse } from "next/server";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";
import { requireUser } from "../../../../lib/auth-guard";

export const runtime = "nodejs";

PDFParse.setWorker(
  pathToFileURL(
    path.join(
      process.cwd(),
      "node_modules",
      "pdf-parse",
      "dist",
      "pdf-parse",
      "esm",
      "pdf.worker.mjs",
    ),
  ).href,
);

async function extractPdfText(data: Uint8Array): Promise<string> {
  const parser = new PDFParse({ data });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

export async function POST(request: Request) {
  const { response: authResponse } = await requireUser();
  if (authResponse) return authResponse;

  const formData = await request.formData();
  const file = formData.get("file");
  if (
    !(file instanceof File) ||
    (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))
  ) {
    return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 });
  }

  try {
    const data = new Uint8Array(await file.arrayBuffer());
    const text = await extractPdfText(data);
    if (!text.trim()) {
      return NextResponse.json({ error: "This PDF does not contain readable text" }, { status: 422 });
    }
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Resume PDF extraction failed:", error);
    const message = error instanceof Error ? error.message : "Unable to read this PDF";
    return NextResponse.json({ error: `Unable to read this PDF: ${message}` }, { status: 422 });
  }
}