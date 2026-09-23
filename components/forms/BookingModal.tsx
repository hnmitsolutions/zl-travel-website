"use client";

import { useState } from "react";

export type LeadPayload = Record<string, string | string[]>;

type Props = { lead: LeadPayload; onClose: () => void };

const slots = Array.from({ length: 13 }, (_, index) => {
  const hour = index + 8;
  return { value: `${String(hour).padStart(2, "0")}:00`, label: `${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}` };
});

export default function BookingModal({ lead, onClose }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!date || !time) return;
    setStatus("sending");
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        tags: [...new Set([...(Array.isArray(lead.tags) ? lead.tags : []), "appointment-request"])],
        event_type: "appointment-booking",
        appointment_date: date,
        appointment_time: time,
        timezone: "America/Chicago",
        timezone_label: "US Central Time (CST/CDT)",
        calendar_name: "zltravelconsultationbooking",
        booking_type: "30-minute-consultation",
        submitted_at: new Date().toISOString(),
        page_url: window.location.href,
      }),
    });
    setStatus(response.ok ? "done" : "error");
  }

  return (
    <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="bookingModalTitle">
      <button className="booking-modal__overlay" type="button" onClick={onClose} aria-label="Close" />
      <div className="booking-modal__panel">
        <button type="button" className="booking-modal__close" onClick={onClose} aria-label="Close"><i className="ti ti-x" /></button>
        <div className="booking-modal__body">
          <span className="eyebrow">Free consultation</span>
          <h3 id="bookingModalTitle">{status === "done" ? "Appointment requested!" : <>Book your <span className="italic">appointment</span></>}</h3>
          {status === "done" ? <p>Thank you. We’ll confirm your requested time by email shortly.</p> : (
            <form onSubmit={submit}>
              <p className="booking-modal__sub">Choose a date and time (US Central).</p>
              {status === "error" && <div className="form-msg err">Something went wrong. Please try again.</div>}
              <div className="field"><label htmlFor="bookingDate">Date</label><input id="bookingDate" type="date" min={new Date().toISOString().slice(0, 10)} required value={date} onChange={(event) => setDate(event.target.value)} /></div>
              <div className="field"><label>Time (US Central)</label><div className="booking-times">{slots.map((slot) => <button key={slot.value} type="button" className={`booking-time${time === slot.value ? " sel" : ""}`} onClick={() => setTime(slot.value)}>{slot.label}</button>)}</div></div>
              <button type="submit" className="btn btn--gold" disabled={status === "sending" || !date || !time}>{status === "sending" ? "Booking…" : "Confirm appointment"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
