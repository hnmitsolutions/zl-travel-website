import type { Metadata } from "next";
import { Suspense } from "react";
import LeadForm from "@/components/forms/LeadForm";
import ScrollPopup from "@/components/forms/ScrollPopup";
import Quiz from "@/components/home/Quiz";
import { legacyHomeSections } from "@/lib/legacy-content";

export const metadata: Metadata = {
  title: "The Art of the Effortless Family Getaway",
  description: "Bespoke family travel, cruises, all-inclusive escapes, honeymoons and European adventures designed end to end.",
};

export default function HomePage() {
  const { beforeQuiz, afterQuiz } = legacyHomeSections();
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: beforeQuiz }} />
      <Quiz />
      <div dangerouslySetInnerHTML={{ __html: afterQuiz }} />
      <section className="section bg-dark" id="contact">
        <div className="container"><div className="lead" data-animate>
          <div className="lead__info"><span className="eyebrow">Start planning</span><h2>Let&apos;s design your <span className="italic">escape</span></h2><p className="lead-p">Share a few details and we&apos;ll follow up within one business day with trip ideas tailored to your family.</p><ul className="lead__list"><li><i className="ti ti-discount" /> Access to exclusive rates &amp; perks</li><li><i className="ti ti-calendar-dollar" /> Flexible payment plans</li><li><i className="ti ti-shield-check" /> 24/7 support before &amp; during your trip</li></ul></div>
          <div className="lead__form"><h3>Request your custom quote</h3><p>No pressure — just ideas built around your family.</p><Suspense><LeadForm /></Suspense></div>
        </div></div>
      </section>
      <ScrollPopup />
    </>
  );
}
