import type { Metadata } from "next";
import FeatureBand from "@/components/layout/FeatureBand";
import PageHero from "@/components/layout/PageHero";
import faqs from "@/content/faqs.json";

export const metadata: Metadata = { title: "FAQs", description: "Answers to common travel planning questions." };

export default function FaqsPage() {
  return <>
    <PageHero eyebrow="Good to know" title={<>Frequently asked <span className="italic">questions</span></>} pageName="FAQs" image="/assets/img/romantic-escape.jpg" imageAlt="Coastal cove" />
    <section className="section bg-dark"><div className="container"><div className="sec-head text-center" data-animate><span className="eyebrow center">Best answers</span><h2>We get these a lot</h2></div><div className="faq" data-animate>{faqs.map(({ question, answer }) => <div className="faq__item" key={question}><button type="button" className="faq__q">{question}<i className="ti ti-plus" /></button><div className="faq__a"><p>{answer}</p></div></div>)}</div></div></section>
    <FeatureBand eyebrow="Still curious?" title="Can’t find your answer? We’d love to help personally" image="/assets/img/mediterranean-harbor.jpg" label="Ask us anything" />
  </>;
}
