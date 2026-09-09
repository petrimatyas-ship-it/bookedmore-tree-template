import {
  AboutUs,
  CtaBand,
  WarningSigns,
  FaqSection,
  Footer,
  QuoteCta,
  Reviews,
  ServiceAreaMap,
  TreeCareServices,
  TrustBar
} from "@/components/Sections";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WorkGallery } from "@/components/WorkGallery";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";

export default function Home() {
  return (
    <main>
      <LocalBusinessSchema />
      <Header />
      <Hero />
      <TrustBar />
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
    </main>
  );
}
