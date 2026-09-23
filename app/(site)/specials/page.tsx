import type { Metadata } from "next";
import Link from "next/link";
import FeatureBand from "@/components/layout/FeatureBand";
import PageHero from "@/components/layout/PageHero";
import data from "@/data/specials.json";

export const metadata: Metadata = { title: "Travel Specials", description: "Exclusive travel deals and limited-time specials." };

export default function SpecialsPage() {
  const specials = data.specials.filter((item) => item.active);
  return <>
    <PageHero compact eyebrow="Limited-time offers" title={<>Travel <span className="italic">Specials</span></>} pageName="Specials" image="/assets/img/caribbean-beach.jpg" imageAlt="Tropical coastline"><p className="lead-p" style={{ maxWidth: "48ch", marginTop: 16 }}>Hand-picked deals on resorts, cruises, and vacation packages — with personal guidance on every booking.</p></PageHero>
    <section className="section bg-dark"><div className="container"><div className="specials-notice" data-animate><i className="ti ti-message-circle" /><span><strong>See something you like?</strong> Click Inquire Now and we’ll reach out personally.</span></div><div className="sec-head text-center" data-animate><span className="eyebrow center">Current promotions</span><h2>Featured deals</h2></div>
      <div className="specials-grid">{specials.map((item) => <article className="special-card" key={item.id}><div className={`special-card__img${/\.(png|webp)$/i.test(item.image_url) ? " flyer" : ""}`}><img src={item.image_url} alt={item.title} loading="lazy" /></div><div className="special-card__body"><span className="special-card__tag">{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p>{item.expires && <div className="special-card__expires"><i className="ti ti-clock" /> Expires {item.expires}</div>}</div><div className="special-card__footer"><Link className="btn btn--gold" href={`/contact?special=${encodeURIComponent(item.slug)}&special_title=${encodeURIComponent(item.title)}`}>Inquire now <i className="ti ti-arrow-right" /></Link></div></article>)}</div>
    </div></section>
    <FeatureBand eyebrow="Don’t see what you need?" title="We can find you a deal" />
  </>;
}
