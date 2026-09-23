"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import BookingModal, { type LeadPayload } from "./BookingModal";

export default function LeadForm({ source = "homepage-form" }: { source?: "homepage-form" | "contact-page-form" }) {
  const search = useSearchParams();
  const [lead, setLead] = useState<LeadPayload | null>(null);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (!values.first_name?.trim() || !values.email?.trim() || !values.phone?.trim()) {
      setMessage("Please fill in your first name, email, and phone.");
      return;
    }
    setSending(true);
    setMessage("");
    const specialRef = search.get("special") || search.get("special_ref") || "";
    const specialTitle = search.get("special_title") || "";
    const payload: LeadPayload = {
      firstName: values.first_name.trim(),
      lastName: values.last_name?.trim() || "",
      email: values.email.trim(),
      phone: `${values.phone_country || "+1"} ${values.phone.trim()}`,
      destination: values.destination || "",
      travel_dates: values.travel_dates || "",
      message: values.message || (specialTitle ? `I'm interested in this special: ${specialTitle}` : ""),
      source,
      lead_source: "Website Contact Form",
      special_ref: specialRef,
      special_title: specialTitle,
      tags: ["lead-captured", source === "homepage-form" ? "homepage-form" : "contact-form", ...(specialRef ? ["specials-inquire"] : [])],
      submitted_at: new Date().toISOString(),
      page_url: window.location.href,
    };
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      sessionStorage.setItem("lastLeadData", JSON.stringify(payload));
      setLead(payload);
    } catch {
      setMessage("Something went wrong. Please call (515) 420-0551 or email Sales@ZLTravelAgency.com.");
    } finally {
      setSending(false);
    }
  }

  if (lead) {
    return (
      <>
        <div className="form-msg ok form-success"><strong>Thank you, {lead.firstName}!</strong><p>We received your request and will be in touch within one business day.</p><button className="btn btn--gold" type="button" onClick={() => setBooking(true)}>Book Appointment <i className="ti ti-calendar" /></button></div>
        {booking && <BookingModal lead={lead} onClose={() => setBooking(false)} />}
      </>
    );
  }

  return (
    <form id="leadForm" noValidate onSubmit={submit}>
      <div className={`form-msg${message ? " err" : ""}`}>{message}</div>
      <div className="field field--row"><div><label htmlFor={`${source}-fn`}>First name</label><input id={`${source}-fn`} name="first_name" required /></div><div><label htmlFor={`${source}-ln`}>Last name</label><input id={`${source}-ln`} name="last_name" /></div></div>
      <div className="field field--row"><div><label htmlFor={`${source}-em`}>Email</label><input id={`${source}-em`} type="email" name="email" required /></div><div><label htmlFor={`${source}-ph`}>Phone</label><div className="field-phone"><select name="phone_country" className="phone-country" aria-label="Country code"><option value="+1">US +1</option><option value="+44">UK +44</option><option value="+91">IN +91</option></select><input id={`${source}-ph`} type="tel" name="phone" required /></div></div></div>
      <div className="field field--row"><div><label htmlFor={`${source}-dest`}>Trip type</label><select id={`${source}-dest`} name="destination"><option value="">Choose…</option>{["Family getaway", "All-inclusive resort", "Cruise", "Europe", "Caribbean / Mexico", "Honeymoon", "Solo trip", "Not sure yet"].map((value) => <option key={value}>{value}</option>)}</select></div><div><label htmlFor={`${source}-dates`}>Approx. dates</label><input id={`${source}-dates`} name="travel_dates" placeholder="MM-DD-YYYY" inputMode="numeric" /></div></div>
      <div className="field"><label htmlFor={`${source}-travelers`}>Travelers</label><input id={`${source}-travelers`} name="travelers" placeholder="2 adults, 2 kids" /></div>
      <div className="field"><label htmlFor={`${source}-message`}>Anything else?</label><textarea id={`${source}-message`} name="message" defaultValue={search.get("special_title") ? `I'm interested in this special: ${search.get("special_title")}` : ""} placeholder="Tell us what a great trip looks like for your family." /></div>
      <button type="submit" className="btn btn--gold" disabled={sending}>{sending ? "Sending…" : "Send my request"} <i className="ti ti-send" /></button>
    </form>
  );
}
