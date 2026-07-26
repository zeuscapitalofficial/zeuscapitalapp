import { ArrowRight } from "lucide-react";

export function UseCasesSection() {
  return (
    <section className="bg-background px-lg py-2xl">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-2xl items-start">
        {/* Left column -- big card with bg video */}
        <div className="relative rounded-large-card-custom overflow-hidden min-h-[720px]">
          <video
            className="absolute inset-0 w-full h-full object-cover animate-fade-in duration-300"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="relative z-10 p-lg md:p-xl">
            <h3
              className="text-text-primary text-[32px] md:text-[40px] font-semibold leading-tight mb-md"
              style={{ letterSpacing: "-0.02em" }}
            >
              Commerce
            </h3>
            <p className="text-text-secondary text-[16px] leading-relaxed max-w-4xl mb-lg">
              Lift customer retention by offering USD Halo, a trusted
              dollar-backed stablecoin with strong yields, letting your patrons
              earn with zero effort on your platform.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-sm text-text-primary text-[16px] font-semibold group cursor-pointer"
            >
              <span className="w-9 h-9 rounded-full bg-[#FFFFFF]/80 backdrop-blur-md flex items-center justify-center group-hover:bg-[#FFFFFF] transition-colors border border-[rgba(0,0,0,0.08)]">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
              <span>Know more</span>
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="md:pr-lg md:pt-xs">
          <p className="text-text-muted text-[14px] font-normal mb-xs uppercase tracking-wider">
            USD Halo in Practice
          </p>
          <h2
            className="text-text-primary text-[48px] md:text-[56px] font-semibold leading-none mb-md"
            style={{ letterSpacing: "-0.03em" }}
          >
            Use modes
          </h2>
          <p className="text-text-secondary text-[16px] leading-relaxed max-w-4xl">
            USD Halo powers a wide range of modes for builders, companies and
            treasuries wanting safe and rewarding stablecoin integrations plus
            more
          </p>
        </div>
      </div>
    </section>
  );
}

// Alias export for backward compatibility
export { UseCasesSection as WhyZeusSection };
