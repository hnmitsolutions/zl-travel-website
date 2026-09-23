"use client";

import { useEffect, useState } from "react";

const storageKey = "zl_scroll_popup_shown";

export default function ScrollPopup() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) return;
    const check = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      if (available > 0 && window.scrollY / available >= 0.6) {
        sessionStorage.setItem(storageKey, "1");
        setOpen(true);
        window.removeEventListener("scroll", check);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("popup-open", open);
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; document.documentElement.classList.remove("popup-open"); };
  }, [open]);

  if (!open) return null;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: values.first_name, lastName: values.last_name, email: values.email, destination: values.destination, source: "home-scroll-popup", lead_source: "Website Home Scroll Popup", tags: ["lead-captured", "home-scroll-popup"], submitted_at: new Date().toISOString(), page_url: window.location.href }),
    });
    if (response.ok) { setDone(true); window.setTimeout(() => setOpen(false), 2200); } else setError("Something went wrong. Please try again.");
  }
  return (
    <div className="scroll-popup" role="dialog" aria-modal="true" aria-labelledby="scrollPopupTitle">
      <button className="scroll-popup__overlay" type="button" onClick={() => setOpen(false)} aria-label="Close" />
      <div className="scroll-popup__panel">
        <button type="button" className="scroll-popup__close" onClick={() => setOpen(false)} aria-label="Close">×</button>
        {done ? <div className="scroll-popup__thanks"><span className="k">You&apos;re all set</span><h3>Thank you!</h3><p>We&apos;ll be in touch within one business day.</p></div> : <div className="scroll-popup__body">
          <span className="eyebrow">Before you go</span><h3 id="scrollPopupTitle">Dreaming of your next <span className="italic">getaway</span>?</h3><p>Share a few details and we&apos;ll send tailored trip ideas — no pressure, no obligation.</p>
          <form onSubmit={submit}><div className={`form-msg${error ? " err" : ""}`}>{error}</div><div className="field field--row"><div><label htmlFor="spf-fn">First name</label><input id="spf-fn" name="first_name" required /></div><div><label htmlFor="spf-ln">Last name</label><input id="spf-ln" name="last_name" /></div></div><div className="field"><label htmlFor="spf-em">Email</label><input id="spf-em" type="email" name="email" required /></div><div className="field"><label htmlFor="spf-dest">What are you dreaming of?</label><select id="spf-dest" name="destination"><option value="">Choose…</option><option>Caribbean cruise</option><option>All-inclusive resort</option><option>Family getaway</option><option>Europe</option><option>Honeymoon</option></select></div><button type="submit" className="btn btn--gold">Send me ideas</button></form>
        </div>}
      </div>
    </div>
  );
}
