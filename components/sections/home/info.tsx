import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InfoSection() {
  return (
    <section className="bg-background px-lg py-2xl w-full space-y-lg">
      {/* Row 1: Intro Grid */}
      <div className="max-w-352 mx-auto grid grid-cols-1 md:grid-cols-3 gap-lg items-start">
        {/* Left Column: Heading and CTA */}
        <div className="flex flex-col gap-md items-start">
          <h2
            className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black"
            style={{ letterSpacing: "-0.03em" }}
          >
            Own your stack.
          </h2>
          <Button
            variant="default"
            className="bg-accent dark:bg-accent-foreground hover:bg-accent-foreground dark:hover:bg-accent text-background-foreground"
          >
            <ArrowRight size={16} />
            Explore Services
          </Button>
        </div>

        {/* Right Column: Narrative */}
        <div className="md:col-span-2">
          <p className="text-muted-foreground text-[21px] md:text-[28px] leading-relaxed tracking-tight">
            Zeus Capital gives high-net-worth investors and institutions direct
            ownership over digital assets — from the mining hardware layer up
            through institutional custody vaults.
          </p>
        </div>
      </div>

      {/* Row 2: Card Grid */}
      <div className="max-w-352 mx-auto grid grid-cols-1 md:grid-cols-4 gap-lg">
        {/* Card 1: Large Image Background (Spans 2 columns on md/lg) */}
        <Card
          className="md:col-span-2 ring-0 border-0 overflow-hidden relative bg-cover bg-center min-h-80 flex flex-col justify-between"
          style={{
            backgroundImage: `url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85")`,
          }}
        >
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/25 pointer-events-none" />

          <CardHeader>
            <CardTitle className="text-foreground z-10 text-[24px] font-semibold leading-snug">
              Mining yields, compounded daily.
            </CardTitle>
          </CardHeader>

          <CardContent className="z-10 pt-18 max-w-92">
            <p className="text-foreground text-[14px] leading-relaxed font-medium">
              Industrial ASIC hashrate generates daily BTC rewards credited
              directly to your private custody wallet — no pooling, no delays.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Dark Surface - Cold Storage */}
        <Card
          className="bg-accent dark:bg-accent-foreground ring-0 border-0 flex flex-col justify-between min-h-80"
        >
          <CardHeader>
            <CardTitle className="text-foreground z-10 text-[24px] font-semibold leading-snug">
              Cold custody, always sovereign.
            </CardTitle>
          </CardHeader>

          <CardContent className="z-10 pt-18 max-w-92">
            <p className="text-foreground text-[14px] leading-relaxed font-medium">
              Assets settle into multi-signature vaults secured by FIPS 140-2
              hardware modules — never held on an exchange or fractional reserve.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Dark Surface - Automation */}
        <Card
          className="bg-accent dark:bg-accent-foreground ring-0 border-0 flex flex-col justify-between min-h-80"
        >
          <CardHeader>
            <CardTitle className="text-foreground z-10 text-[24px] font-semibold leading-snug">
              Institutional OTC execution.
            </CardTitle>
          </CardHeader>

          <CardContent className="z-10 pt-18 max-w-92">
            <p className="text-foreground text-[14px] leading-relaxed font-medium">
              Our dedicated brokerage desk handles large block trades with
              best-execution pricing and same-day settlement into custody.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
