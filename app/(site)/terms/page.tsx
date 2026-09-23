import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
export const metadata: Metadata = { title: "Terms & Conditions" };
export default function Page() { return <LegalPage file="terms.html" title="Terms & Conditions" />; }
