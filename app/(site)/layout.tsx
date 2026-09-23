import BackToTop from "@/components/BackToTop";
import ChatWidget from "@/components/ChatWidget";
import SiteEffects from "@/components/SiteEffects";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <ChatWidget />
      <SiteEffects />
    </>
  );
}
