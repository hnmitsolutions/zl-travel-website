import { NextResponse } from "next/server";
import { verifyAgentPin } from "@/lib/auth";
import { forwardAgentSubmission } from "@/lib/ghl";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      pin?: string;
      payload?: unknown;
    };

    if (!verifyAgentPin(body.pin || "")) {
      return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
    }

    if (!body.payload || typeof body.payload !== "object") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    await forwardAgentSubmission(body.payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/agent/submit]", error);
    return NextResponse.json(
      { error: "Unable to submit package right now." },
      { status: 502 },
    );
  }
}
