"use client";

import { useState } from "react";
import { PinGate, useAgentGate } from "@/components/agent/AgentGate";
import initialData from "@/data/specials.json";

type Special = (typeof initialData.specials)[number];

export default function SpecialsAdminPage() {
  const gate = useAgentGate("zl_specials_admin");
  const [specials, setSpecials] = useState<Special[]>(initialData.specials);
  const [editing, setEditing] = useState<Special | null>(null);
  const [status, setStatus] = useState("");
  if (!gate.unlocked) return <PinGate title="Specials Admin" gate={gate} />;

  function download() {
    const blob = new Blob([JSON.stringify({ updated_at: new Date().toISOString(), specials }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "specials.json"; anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded specials.json. Replace data/specials.json and deploy.");
  }
  async function upload(file: File) {
    if (!gate.pin) { setStatus("Please refresh and enter your PIN again before uploading."); return; }
    const data = new FormData(); data.append("pin", gate.pin); data.append("file", file);
    const response = await fetch("/api/media/upload", { method: "POST", body: data });
    const result = await response.json();
    if (!response.ok) setStatus(result.error || "Upload failed.");
    else setEditing((current) => current ? { ...current, image_url: result.url || result.fileUrl || "" } : current);
  }
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setSpecials((current) => current.some((item) => item.id === editing.id) ? current.map((item) => item.id === editing.id ? editing : item) : [editing, ...current]);
    setEditing(null); setStatus("Special saved locally. Download JSON to publish.");
  }
  return <><section className="agent-card"><p className="agent-eyebrow">Manage promotions</p><h1>Travel Specials</h1><p>Edit promotions, upload media securely, then download the updated data file for deployment.</p>{status && <div className="agent-alert agent-alert--ok">{status}</div>}<div className="agent-actions"><button className="agent-btn" type="button" onClick={() => setEditing({ id: `sp-${Date.now()}`, slug: "", title: "", description: "", image_url: "", tag: "Limited-Time Offer", expires: "", active: true, created_at: new Date().toISOString() })}>+ Add special</button><button className="agent-btn agent-btn--ghost" type="button" onClick={download}>Download JSON</button></div></section>
    {editing && <section className="agent-card"><h2>Edit special</h2><form onSubmit={save}><div className="agent-row"><div className="agent-field"><label>Title</label><input required value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value, slug: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></div><div className="agent-field"><label>Tag</label><input value={editing.tag} onChange={(event) => setEditing({ ...editing, tag: event.target.value })} /></div></div><div className="agent-field"><label>Description</label><textarea required value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></div><div className="agent-row"><div className="agent-field"><label>Expires</label><input value={editing.expires} onChange={(event) => setEditing({ ...editing, expires: event.target.value })} /></div><div className="agent-field"><label>Status</label><select value={String(editing.active)} onChange={(event) => setEditing({ ...editing, active: event.target.value === "true" })}><option value="true">Active</option><option value="false">Hidden</option></select></div></div><div className="agent-field"><label>Image URL</label><input value={editing.image_url} onChange={(event) => setEditing({ ...editing, image_url: event.target.value })} /></div><div className="agent-field"><label>Upload image</label><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></div><div className="agent-actions"><button className="agent-btn" type="submit">Save</button><button className="agent-btn agent-btn--ghost" type="button" onClick={() => setEditing(null)}>Cancel</button></div></form></section>}
    <section className="agent-card"><h2>Current specials</h2>{specials.map((item) => <article className="agent-package" key={item.id}><p className="agent-eyebrow">{item.active ? item.tag : "Hidden"}</p><h3>{item.title}</h3><p>{item.description}</p><div className="agent-actions"><button className="agent-btn agent-btn--ghost" type="button" onClick={() => setEditing(item)}>Edit</button><button className="agent-btn agent-btn--ghost" type="button" onClick={() => setSpecials((current) => current.filter((special) => special.id !== item.id))}>Delete</button></div></article>)}</section></>;
}
