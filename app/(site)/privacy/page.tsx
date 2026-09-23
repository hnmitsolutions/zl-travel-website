import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function Page() { return <LegalPage file="privacy.html" title="Privacy Policy" />; }
