import ContactSection from "@/components/client/ContactSection";
import Footer from "@/components/client/Footer";
import HeroSection from "@/components/client/HeroSection";
import HowItWorks from "@/components/client/HowItWorks";
import { Navbar } from "@/components/client/NavBar";
import ZoneSection from "@/components/client/ZoneSection";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative">
      <Navbar />
      <section className="relative z-10 bg-white dark:bg-background shadow-2xl">
        <HeroSection />
        <HowItWorks />
        <ZoneSection />
        <ContactSection />
      </section>
      <Footer />
    </main>
  );
}
