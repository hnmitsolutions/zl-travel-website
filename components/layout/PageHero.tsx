import Link from "next/link";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  pageName: string;
  image: string;
  imageAlt: string;
  compact?: boolean;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, pageName, image, imageAlt, compact, children }: PageHeroProps) {
  return (
    <section className="page-hero" style={compact ? { minHeight: "46vh" } : undefined}>
      <div className="px" data-px="0.12"><img src={image} alt={imageAlt} /></div>
      <div className="container">
        <div className="page-hero__inner" data-animate>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {children}
          <div className="crumbs"><Link href="/">Home</Link> / {pageName}</div>
        </div>
      </div>
    </section>
  );
}
