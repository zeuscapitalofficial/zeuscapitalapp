import { BlogSection } from "@/components/sections/home/blog";
import { CtaSection } from "@/components/sections/home/cta";
import { FaqSection } from "@/components/sections/home/faq";
import { HeroSection } from "@/components/sections/home/hero";
import { HowItWorksSection } from "@/components/sections/home/how-it-works";
import { InfoSection } from "@/components/sections/home/info";
import { MiningSection } from "@/components/sections/home/mining";
import { TestimonialsSection } from "@/components/sections/home/testimonials";
import { TrustedBySection } from "@/components/sections/home/trusted-by";
import { WhyZeusSection } from "@/components/sections/home/why-zeus";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <HeroSection />
      <div className="w-7xl mx-auto">
        <InfoSection />
        <TrustedBySection />
        <WhyZeusSection />
        <HowItWorksSection />
        <MiningSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
        <BlogSection />
      </div>
    </div>
  );
}
