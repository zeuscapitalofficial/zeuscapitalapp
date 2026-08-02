import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function UseCasesSection() {
  return (
    <section className="bg-background px-lg py-2xl hidden lg:block">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-2xl items-center">
        {/* Left column - Introductory narrative */}
        <div className="md:pr-lg md:pt-xs">
          <p className="text-muted-foreground/60 text-[14px] font-normal mb-xs uppercase tracking-wider">
            Why Institutional Clients Choose Us
          </p>
          <h2
            className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black"
            style={{ letterSpacing: "-0.03em" }}
          >
            Built for serious capital.
          </h2>
          <p className="text-muted-foreground text-[16px] leading-relaxed max-w-4xl">
            Zeus Capital operates at the intersection of physical infrastructure
            and institutional-grade digital asset custody — serving family
            offices, sovereign funds, and high-net-worth compounders who demand
            more than promises.
          </p>
        </div>

        {/* Right column - Feature card with video background */}
        <Card className="relative min-h-[480px] md:min-h-[560px]">
          <video
            className="absolute inset-0 w-full h-full object-cover animate-fade-in duration-300"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-linear-to-b from-accent via-accent-foreground/20 to-transparent z-1" />

          <CardHeader className="relative z-10 p-lg md:p-xl ">
            <CardTitle
              className=" text-[32px] md:text-[40px] font-semibold leading-tight mb-md"
              style={{ letterSpacing: "-0.02em" }}
            >
              Private Custody & OTC Brokerage
            </CardTitle>
          </CardHeader>
          <CardContent className="absolute  bottom-50 w-full z-10 p-lg md:p-xl ">
            <p className="text-[16px] leading-relaxed max-w-95 mb-lg">
              Settle large spot transactions directly into multi-signature cold
              vaults, bypassing exchange custody risk entirely.
            </p>
          </CardContent>
          <CardFooter className="absolute bottom-0 w-full z-10 p-lg md:p-xl ">
            <button
              type="button"
              className="inline-flex items-center gap-sm text-white text-[16px] font-semibold group cursor-pointer"
            >
              <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/40 transition-colors border border-white/10">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
              <span>Learn more</span>
            </button></CardFooter>
        </Card>
      </div>
    </section>
  );
}

// Alias export for backward compatibility
export { UseCasesSection as WhyZeusSection };
