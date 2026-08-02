import { CtaSection } from "@/components/sections/home/cta";
import { AboutHeroSection } from "@/components/sections/about/hero";
import { AboutMissionSection } from "@/components/sections/about/mission";
import { AboutPhilosophySection } from "@/components/sections/about/philosophy";
import { AboutSecuritySection } from "@/components/sections/about/security";
import { AboutStorySection } from "@/components/sections/about/story";
import { AboutTechnologySection } from "@/components/sections/about/technology";
import { AboutTimelineSection } from "@/components/sections/about/timeline";
import { BlogSection } from "@/components/sections/home/blog";
import { FaqSection } from "@/components/sections/home/faq";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <AboutHeroSection />
      <div className="w-7xl mx-auto">
        <AboutMissionSection />
        <AboutStorySection />
        <AboutPhilosophySection />
        <AboutTimelineSection />
        <AboutTechnologySection />
        <FaqSection />
        <CtaSection />
        <BlogSection />
      </div>
    </div>
  );
}
