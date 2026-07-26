import { AboutCtaSection } from "@/components/sections/about/cta";
import { AboutHeroSection } from "@/components/sections/about/hero";
import { AboutMissionSection } from "@/components/sections/about/mission";
import { AboutPhilosophySection } from "@/components/sections/about/philosophy";
import { AboutSecuritySection } from "@/components/sections/about/security";
import { AboutStorySection } from "@/components/sections/about/story";
import { AboutTechnologySection } from "@/components/sections/about/technology";
import { AboutTimelineSection } from "@/components/sections/about/timeline";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] font-sans">
      <AboutHeroSection />
      <AboutMissionSection />
      <AboutStorySection />
      <AboutPhilosophySection />
      <AboutTimelineSection />
      <AboutTechnologySection />
      <AboutSecuritySection />
      <AboutCtaSection />
    </div>
  );
}
