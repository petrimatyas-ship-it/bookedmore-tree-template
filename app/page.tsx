import { AboutUs, Footer, HowItWorks, ReviewsMap, TreeCareServices } from "@/components/Sections";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";

export default function Home() {
  return (
    <main>
      <LocalBusinessSchema />
      <Header />
      <Hero />
      <TreeCareServices />
      <AboutUs />
      <HowItWorks />
      <ReviewsMap />
      <Footer />
      <MobileCtaBar />
    </main>
  );
}
