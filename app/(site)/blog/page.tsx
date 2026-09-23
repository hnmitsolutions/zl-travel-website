import type { Metadata } from "next";
import LegacyPage from "@/components/layout/LegacyPage";
export const metadata: Metadata = { title: "Blog", description: "Travel advice and inspiration for families." };
export default function Page() { return <LegacyPage file="blog.html" />; }
