import type { Metadata } from "next";
import LegacyPage from "@/components/layout/LegacyPage";
export const metadata: Metadata = { title: "Destinations & Deals", description: "Explore handpicked destinations and featured escapes." };
export default function Page() { return <LegacyPage file="destinations.html" />; }
