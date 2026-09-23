import { NextResponse } from "next/server";
import { verifyAgentPin } from "@/lib/auth";
import { uploadMedia } from "@/lib/ghl";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const pin = String(form.get("pin") || "");
    const file = form.get("file");

    if (!verifyAgentPin(pin)) {
      return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const maxBytes = 12 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "File must be 12MB or smaller." },
        { status: 400 },
      );
    }

    const uploaded = await uploadMedia(file);
    return NextResponse.json({ ok: true, ...uploaded });
  } catch (error) {
    console.error("[api/media/upload]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload file right now.",
      },
      { status: 502 },
    );
  }
}
