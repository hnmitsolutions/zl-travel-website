import Link from "next/link";
import type { ReactNode } from "react";

type FeatureBandProps = {
  eyebrow: string;
  title: ReactNode;
  image?: string;
  href?: string;
  label?: string;
  children?: ReactNode;
};

export default function FeatureBand({ eyebrow, title, image = "/assets/img/travel-landscape.jpg", href = "/contact", label = "Start planning", children }: FeatureBandProps) {
  return (
    <section className="feature-band">
      <div className="px" data-px="0.18"><img src={image} alt="" /></div>
      <div className="container" data-animate>
        <span className="eyebrow center">{eyebrow}</span>
        <h2 style={{ marginInline: "auto" }}>{title}</h2>
        {children}
        <Link className="btn btn--gold" href={href} style={{ marginTop: 26 }}>{label} <i className="ti ti-arrow-right" /></Link>
      </div>
    </section>
  );
}
