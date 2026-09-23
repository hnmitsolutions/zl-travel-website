import type { Metadata } from "next";
import LegacyPage from "@/components/layout/LegacyPage";
export const metadata: Metadata = { title: "About", description: "Meet the family travel expert behind ZL Travel Agency." };
export default function Page() { return <LegacyPage file="about.html" />; }
