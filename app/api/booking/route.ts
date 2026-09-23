import { NextResponse } from "next/server";
import { forwardBooking } from "@/lib/ghl";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    await forwardBooking(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/booking]", error);
    return NextResponse.json(
      { error: "Unable to book appointment right now." },
      { status: 502 },
    );
  }
}
