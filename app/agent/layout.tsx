import type { Metadata } from "next";
import Link from "next/link";
import "./agent.css";

export const metadata: Metadata = { title: "Agent Portal", robots: { index: false, follow: false } };

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <div className="agent-body"><header className="agent-top"><div className="agent-top__inner"><img src="/logo-header.png" alt="ZL Travel Agency" /><Link href="/agent/specials">Specials admin</Link></div></header><main className="agent-wrap">{children}</main></div>;
}
