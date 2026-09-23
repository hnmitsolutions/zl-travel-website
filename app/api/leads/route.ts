import { NextResponse } from "next/server";
import { forwardLead } from "@/lib/ghl";

export const runtime = "nodejs";

type LeadBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  destination?: string;
  travel_dates?: string;
  tripType?: string;
  message?: string;
  source?: string;
  lead_source?: string;
  special_ref?: string;
  special_title?: string;
  tags?: string[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  page_url?: string;
  submitted_at?: string;
};

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadBody;

    if (!isNonEmptyString(body.firstName) || !isNonEmptyString(body.email)) {
      return NextResponse.json(
        { error: "First name and email are required." },
        { status: 400 },
      );
    }

    const payload = {
      firstName: body.firstName!.trim(),
      lastName: (body.lastName || "").trim(),
      email: body.email!.trim(),
      phone: (body.phone || "").trim(),
      destination: (body.destination || "").trim(),
      travel_dates: (body.travel_dates || "").trim(),
      tripType: (body.tripType || "").trim(),
      message: (body.message || "").trim(),
      source: (body.source || "website-form").trim(),
      lead_source: (body.lead_source || "Website Contact Form").trim(),
      special_ref: (body.special_ref || "").trim(),
      special_title: (body.special_title || "").trim(),
      tags: Array.isArray(body.tags) ? body.tags : ["lead-captured"],
      utm_source: (body.utm_source || "").trim(),
      utm_medium: (body.utm_medium || "").trim(),
      utm_campaign: (body.utm_campaign || "").trim(),
      submitted_at: body.submitted_at || new Date().toISOString(),
      page_url: (body.page_url || "").trim(),
    };

    await forwardLead(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/leads]", error);
    return NextResponse.json(
      { error: "Unable to submit lead right now." },
      { status: 502 },
    );
  }
}
