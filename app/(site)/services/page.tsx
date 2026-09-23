import type { Metadata } from "next";
import LegacyPage from "@/components/layout/LegacyPage";
export const metadata: Metadata = { title: "Services", description: "Family trips, cruises, all-inclusive resorts, European adventures and more." };
export default function Page() { return <LegacyPage file="services.html" />; }
