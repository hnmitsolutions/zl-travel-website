import { NextResponse } from "next/server";
import { verifyAgentPin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pin?: string };
    const ok = verifyAgentPin(body.pin || "");
    if (!ok) {
      return NextResponse.json({ error: "Incorrect PIN." }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/agent/auth]", error);
    return NextResponse.json({ error: "Auth failed." }, { status: 500 });
  }
}
