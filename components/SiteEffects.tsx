"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector(".header");
    const toTop = document.querySelector(".totop");
    const parallaxElements = [...document.querySelectorAll<HTMLElement>("[data-px]")];
    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("scrolled", y > 40);
      toTop?.classList.toggle("show", y > 700);
      parallaxElements.forEach((element) => {
        const speed = Number.parseFloat(element.dataset.px || "") || 0.15;
        const rect = element.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        element.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    document.querySelector(".hero")?.classList.add("ready");
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    const revealElements = document.querySelectorAll("[data-animate], .reveal-img");
    revealElements.forEach((element) => revealObserver.observe(element));
    const fallback = window.setTimeout(() => revealElements.forEach((element) => element.classList.add("in")), 1200);

    const faqCleanups = [...document.querySelectorAll<HTMLElement>(".faq__item")].map((item) => {
      const button = item.querySelector<HTMLButtonElement>(".faq__q");
      const answer = item.querySelector<HTMLElement>(".faq__a");
      const toggle = () => {
        const shouldOpen = !item.classList.contains("open");
        document.querySelectorAll<HTMLElement>(".faq__item.open").forEach((openItem) => {
          openItem.classList.remove("open");
          const openAnswer = openItem.querySelector<HTMLElement>(".faq__a");
          if (openAnswer) openAnswer.style.maxHeight = "";
        });
        if (shouldOpen && answer) {
          item.classList.add("open");
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      };
      button?.addEventListener("click", toggle);
      return () => button?.removeEventListener("click", toggle);
    });
    const year = document.querySelector("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fallback);
      revealObserver.disconnect();
      faqCleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
