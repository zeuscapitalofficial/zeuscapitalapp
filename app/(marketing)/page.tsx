import { BlogSection } from "@/components/sections/home/blog";
import { CtaSection } from "@/components/sections/home/cta";
import { HeroSection } from "@/components/sections/home/hero";
import { InfoSection } from "@/components/sections/home/info";
import { StatsSection } from "@/components/sections/home/stats";
import { TrustedBySection } from "@/components/sections/home/trusted-by";
import { WhyZeusSection } from "@/components/sections/home/why-zeus";
import { MiningSection } from "@/components/sections/home/mining";
import { SecuritySection } from "@/components/sections/home/security";
import { TestimonialsSection } from "@/components/sections/home/testimonials";
import { FaqSection } from "@/components/sections/home/faq";
import { HowItWorksSection } from "@/components/sections/home/how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] font-sans">
      <HeroSection />
      <InfoSection />
      <TrustedBySection />
      <WhyZeusSection />
      <HowItWorksSection />
      <MiningSection />
      <SecuritySection />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
      <BlogSection />
      <CtaSection />
    </div>
  );
}
