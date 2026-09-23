import { readFileSync } from "node:fs";
import { join } from "node:path";
import PageHero from "./PageHero";

export default function LegalPage({ file, title }: { file: string; title: string }) {
  const html = readFileSync(join(process.cwd(), "content", file), "utf8");
  return <>
    <PageHero compact eyebrow="Policies & disclosures" title={title} pageName={title} image="/assets/img/aerial-coast.jpg" imageAlt="Coastline" />
    <section className="section bg-cream"><div className="container"><article className="legal" data-animate dangerouslySetInnerHTML={{ __html: html }} /></div></section>
  </>;
}
