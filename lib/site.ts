export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/destinations", label: "Destinations" },
  { href: "/specials", label: "Specials" },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "ZL Travel Agency",
  phone: process.env.NEXT_PUBLIC_PHONE || "515-420-0551",
  phoneE164: process.env.NEXT_PUBLIC_PHONE_E164 || "+15154200551",
  email: process.env.NEXT_PUBLIC_EMAIL || "Sales@ZLTravelAgency.com",
  calendly:
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/zltravelagency-sales/30min",
  facebook:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/people/ZL-Travel-Agency/61568690865480/",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/zltravelagency/",
  youtube:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ||
    "https://www.youtube.com/channel/UC2BdA-rvtyUT1GDUjv9jU7w",
  chatWidgetId: process.env.NEXT_PUBLIC_CHAT_WIDGET_ID || "",
  tagline:
    "Based in Ankeny, IA, we design effortless getaways for families across the Des Moines area and beyond — from the Caribbean to the coastlines of Europe.",
} as const;

export type NavHref = (typeof NAV_LINKS)[number]["href"];
