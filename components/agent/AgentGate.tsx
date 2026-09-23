"use client";

import { useEffect, useState } from "react";

export function useAgentGate(key: string) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  useEffect(() => setUnlocked(sessionStorage.getItem(key) === "1"), [key]);
  async function authenticate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/agent/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    if (!response.ok) { setError("Incorrect PIN."); setPin(""); return; }
    sessionStorage.setItem(key, "1");
    setUnlocked(true);
    setError("");
  }
  return { unlocked, pin, setPin, error, authenticate };
}

export function PinGate({ title, gate }: { title: string; gate: ReturnType<typeof useAgentGate> }) {
  return <section className="agent-card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}><p className="agent-eyebrow">Private Access</p><h1>{title}</h1><p>Enter your agent PIN to continue.</p>{gate.error && <div className="agent-alert">{gate.error}</div>}<form onSubmit={gate.authenticate}><div className="agent-field"><label htmlFor="agentPin">PIN</label><input id="agentPin" type="password" inputMode="numeric" value={gate.pin} onChange={(event) => gate.setPin(event.target.value)} required autoFocus /></div><button className="agent-btn" type="submit">Continue</button></form></section>;
}
