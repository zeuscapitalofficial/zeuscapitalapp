import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function InfoSection() {
  return (
    <section className="bg-background px-lg py-2xl border-t border-[rgba(0,0,0,0.04)] w-full">
      {/* Row 1: Intro Grid */}
      <div className="max-w-352 mx-auto grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl items-start">
        {/* Left Column: Heading and CTA */}
        <div className="flex flex-col gap-md items-start">
          <h2
            className="text-text-primary text-[36px] md:text-[48px] font-semibold leading-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Meet USD Halo.
          </h2>
          <Button
            variant="primary"
            className="pl-lg pr-sm py-xs text-[14px] font-semibold group cursor-pointer"
            icon={<ArrowRight size={14} />}
          >
            Discover it
          </Button>
        </div>

        {/* Right Column: Narrative */}
        <div>
          <p className="text-text-secondary text-[21px] md:text-[28px] leading-relaxed tracking-tight">
            USD Halo is a reward-earning dollar coin that lets your savings grow
            while remaining tied to the U.S. dollar.
          </p>
        </div>
      </div>

      {/* Row 2: Card Grid */}
      <div className="max-w-352 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Card 1: Large Image Background (Spans 2 columns on lg) */}
        <div
          className="lg:col-span-2 rounded-card-custom overflow-hidden min-h-80 flex flex-col justify-between p-lg relative bg-cover bg-center border border-[rgba(0,0,0,0.06)]"
          style={{
            backgroundImage: `url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85")`,
          }}
        >
          {/* Subtle overlay for text readability if needed */}
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />

          <div className="relative z-10">
            <h4
              className="text-text-primary text-[24px] font-semibold leading-snug"
              style={{ letterSpacing: "-0.02em" }}
            >
              Savings that bloom
            </h4>
          </div>
          <div className="relative z-10 max-w-92">
            <p className="text-text-secondary text-[14px] leading-relaxed font-medium">
              Gain steady returns as your dollar tokens are routed into
              top-performing DeFi strategies.
            </p>
          </div>
        </div>

        {/* Card 2: Dark Surface pegged details */}
        <Card
          variant="dark"
          className="min-h-80 flex flex-col justify-between p-lg rounded-card-custom"
        >
          <h4
            className="text-white text-[24px] font-semibold leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Always fluid,
            <br />
            always pegged.
          </h4>
          <p className="text-white/60 text-[14px] leading-relaxed">
            Stay dollar-anchored with on-demand access to funds — no lockups or
            waits.
          </p>
        </Card>

        {/* Card 3: Dark Surface automation details */}
        <Card
          variant="dark"
          className="min-h-80 flex flex-col justify-between p-lg rounded-card-custom"
        >
          <h4
            className="text-white text-[24px] font-semibold leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Fully
            <br />
            automated.
          </h4>
          <p className="text-white/60 text-[14px] leading-relaxed">
            Skip the task of tuning positions yourself. USD Halo runs in the
            background for you.
          </p>
        </Card>
      </div>
    </section>
  );
}
