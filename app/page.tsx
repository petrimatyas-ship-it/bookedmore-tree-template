import {
  AboutUs,
  CtaBand,
  WarningSigns,
  FaqSection,
  Footer,
  QuoteCta,
  Reviews,
  ServiceAreaMap,
  TreeCareServices
} from "@/components/Sections";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WorkGallery } from "@/components/WorkGallery";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";

export default function Home() {
  return (
    <main>
      <LocalBusinessSchema />
      <Header />
      <Hero />
      <TreeCareServices compact />
      <WarningSigns />
      <AboutUs />
      <CtaBand />
      <WorkGallery />
      <Reviews />
      <ServiceAreaMap />
      <FaqSection />
      <QuoteCta />
      <Footer />
      <MobileCtaBar />
    </main>
  );
}
