import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
export const metadata: Metadata = { title: "Affiliate Disclosures" };
export default function Page() { return <LegalPage file="affiliate.html" title="Affiliate Disclosures" />; }
