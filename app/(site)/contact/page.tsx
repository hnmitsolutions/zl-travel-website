import type { Metadata } from "next";
import { Suspense } from "react";
import LeadForm from "@/components/forms/LeadForm";
import PageHero from "@/components/layout/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Request a custom quote or book a free travel consultation." };

export default function ContactPage() {
  return <>
    <PageHero compact eyebrow="Let’s talk" title={<>Start your <span className="italic">escape</span></>} pageName="Contact" image="/assets/img/aerial-coast.jpg" imageAlt="Sunset coastline" />
    <section className="section bg-dark" id="form"><div className="container"><div className="lead" data-animate><div className="lead__info"><span className="eyebrow">Get in touch</span><h2>Tell us about your <span className="italic">dream trip</span></h2><p className="lead-p">Share a few details and we&apos;ll follow up within one business day.</p><ul className="lead__list"><li><i className="ti ti-discount" /> Access to exclusive rates &amp; perks</li><li><i className="ti ti-calendar-dollar" /> Flexible payment plans</li><li><i className="ti ti-shield-check" /> 24/7 support</li></ul><div className="lead__contact"><div><i className="ti ti-phone" /><a href={`tel:${SITE.phoneE164}`}>{SITE.phone}</a></div><div><i className="ti ti-mail" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div><div><i className="ti ti-map-pin" />Ankeny, IA — serving Des Moines &amp; beyond</div></div></div><div className="lead__form"><h3>Request your custom quote</h3><p>No pressure — just ideas built around your family.</p><Suspense><LeadForm source="contact-page-form" /></Suspense></div></div><div style={{ marginTop: 30 }} data-animate><div className="map-embed"><iframe title="ZL Travel Agency location — Ankeny, IA" loading="lazy" src="https://maps.google.com/maps?q=Ankeny%2C%20IA&t=m&z=11&output=embed&iwloc=near" /></div></div></div></section>
  </>;
}
