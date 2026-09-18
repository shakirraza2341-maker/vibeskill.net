import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { requireUser } from "../../../../lib/auth-guard";

export const runtime = "nodejs";

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
    const parser = new PDFParse({ data: Buffer.from(await file.arrayBuffer()) });
    const result = await parser.getText();
    await parser.destroy();
    if (!result.text.trim()) {
      return NextResponse.json({ error: "This PDF does not contain readable text" }, { status: 422 });
    }
    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("Resume PDF extraction failed:", error);
    return NextResponse.json({ error: "Unable to read this PDF" }, { status: 422 });
  }
}