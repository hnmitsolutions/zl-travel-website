"use client";

import { useState } from "react";
import { PinGate, useAgentGate } from "@/components/agent/AgentGate";

type Package = { package_name: string; travel_start_date: string; travel_end_date: string; hotel_resort_name: string; room_type: string; package_inclusions: string; total_investment: string; deposit_required: string; file?: File };
const emptyPackage = (): Package => ({ package_name: "", travel_start_date: "", travel_end_date: "", hotel_resort_name: "", room_type: "", package_inclusions: "", total_investment: "", deposit_required: "" });

export default function AgentPage() {
  const gate = useAgentGate("zl_agent_unlocked");
  const [packages, setPackages] = useState<Package[]>([emptyPackage()]);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  if (!gate.unlocked) return <PinGate title="Agent Form" gate={gate} />;

  function updatePackage(index: number, field: keyof Package, value: string | File) {
    setPackages((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gate.pin) { setStatus("Please refresh and enter your PIN again before submitting."); return; }
    setSending(true); setStatus("");
    try {
      const uploaded = await Promise.all(packages.map(async (item, index) => {
        const { file, ...details } = item;
        if (!file) return { package_number: index + 1, ...details };
        const data = new FormData(); data.append("pin", gate.pin); data.append("file", file);
        const response = await fetch("/api/media/upload", { method: "POST", body: data });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Upload failed.");
        return { package_number: index + 1, ...details, pdf_url: result.url || result.fileUrl || "", pdf_file_id: result.fileId || result.id || "" };
      }));
      const values = Object.fromEntries(new FormData(event.currentTarget).entries());
      const payload = { phone: values.phone, email: values.email, final_payment_date: values.final_payment_date, booking_expiration_date: values.booking_expiration_date, packages: uploaded, package_count: uploaded.length, source: "agent-package-form", tags: ["agent-form", "package-submission"], submitted_at: new Date().toISOString() };
      const response = await fetch("/api/agent/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin: gate.pin, payload }) });
      if (!response.ok) throw new Error((await response.json()).error || "Submission failed.");
      setStatus("Submitted successfully.");
      setPackages([emptyPackage()]);
      event.currentTarget.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Submission failed."); } finally { setSending(false); }
  }
  return <section className="agent-card"><p className="agent-eyebrow">Agent Only</p><h1>Package Submission</h1><p>Enter client contact info and up to three package options.</p>{status && <div className={`agent-alert${status.includes("success") ? " agent-alert--ok" : ""}`}>{status}</div>}<form onSubmit={submit}><div className="agent-row"><div className="agent-field"><label>Client phone</label><input name="phone" type="tel" required /></div><div className="agent-field"><label>Client email</label><input name="email" type="email" required /></div></div>
    {packages.map((pkg, index) => <div className="agent-package" key={index}><h3>Package {index + 1}</h3><div className="agent-field"><label>Package name</label><input required value={pkg.package_name} onChange={(event) => updatePackage(index, "package_name", event.target.value)} /></div><div className="agent-row"><div className="agent-field"><label>Travel start</label><input type="date" value={pkg.travel_start_date} onChange={(event) => updatePackage(index, "travel_start_date", event.target.value)} /></div><div className="agent-field"><label>Travel end</label><input type="date" value={pkg.travel_end_date} onChange={(event) => updatePackage(index, "travel_end_date", event.target.value)} /></div></div><div className="agent-row"><div className="agent-field"><label>Hotel / resort</label><input value={pkg.hotel_resort_name} onChange={(event) => updatePackage(index, "hotel_resort_name", event.target.value)} /></div><div className="agent-field"><label>Room type</label><input value={pkg.room_type} onChange={(event) => updatePackage(index, "room_type", event.target.value)} /></div></div><div className="agent-field"><label>Package inclusions</label><textarea value={pkg.package_inclusions} onChange={(event) => updatePackage(index, "package_inclusions", event.target.value)} /></div><div className="agent-row"><div className="agent-field"><label>Total investment</label><input value={pkg.total_investment} onChange={(event) => updatePackage(index, "total_investment", event.target.value)} /></div><div className="agent-field"><label>Deposit required</label><input value={pkg.deposit_required} onChange={(event) => updatePackage(index, "deposit_required", event.target.value)} /></div></div><div className="agent-field"><label>Package PDF</label><input type="file" accept=".pdf,application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) updatePackage(index, "file", file); }} /></div>{index > 0 && <button type="button" className="agent-btn agent-btn--ghost" onClick={() => setPackages((current) => current.filter((_, i) => i !== index))}>Remove</button>}</div>)}
    <div className="agent-actions">{packages.length < 3 && <button type="button" className="agent-btn agent-btn--ghost" onClick={() => setPackages((current) => [...current, emptyPackage()])}>+ Add package</button>}</div><div className="agent-row"><div className="agent-field"><label>Final payment date</label><input name="final_payment_date" type="date" /></div><div className="agent-field"><label>Booking expiration</label><input name="booking_expiration_date" type="date" /></div></div><button className="agent-btn" type="submit" disabled={sending}>{sending ? "Submitting…" : "Submit to GHL"}</button></form></section>;
}
