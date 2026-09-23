"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    let lastY = window.scrollY;
    const close = () => setOpen(false);
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 8) close();
      lastY = y;
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    const onClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    const onResize = () => window.innerWidth > 920 && close();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    document.body.classList.add("nav-open");
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      document.body.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <header ref={headerRef} className={`header${open ? " nav-open" : ""}`}>
      <div className="container">
        <Link className="brand" href="/" aria-label={SITE.name} onClick={() => setOpen(false)}>
          <img src="/logo-header.png" alt={SITE.name} />
        </Link>
        <nav id="primary-nav" className={`nav${open ? " open" : ""}`} aria-label="Primary">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={pathname === href ? "active" : undefined} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link className="nav-mobile-cta" href="/contact" onClick={() => setOpen(false)}>Start planning</Link>
        </nav>
        <div className="nav-cta">
          <Link className="btn btn--gold" href="/contact">Start planning</Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Menu"}
            aria-controls="primary-nav"
            aria-expanded={open}
            onClick={(event) => {
              event.stopPropagation();
              setOpen((value) => !value);
            }}
          >
            <i className={`ti ${open ? "ti-x" : "ti-menu-2"}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
