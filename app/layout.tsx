import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import "../styles/site.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZL Travel Agency | Effortless Family Getaways",
    template: "%s | ZL Travel Agency",
  },
  description: "Bespoke family travel, cruises, all-inclusive escapes, honeymoons and European adventures, designed end to end.",
  icons: { icon: "/logo-header.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.24.0/dist/tabler-icons.min.css"
        />
      </head>
      <body id="top" className={`${fraunces.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
