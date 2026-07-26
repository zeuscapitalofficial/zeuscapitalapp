import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const brands = [
    {
      name: "Stripe",
      style: {
        fontFamily: "Georgia, serif",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        fontSize: "15px",
      },
    },
    {
      name: "Coinbase",
      style: {
        fontFamily: "Arial, sans-serif",
        fontWeight: 900,
        letterSpacing: "0.08em",
        fontSize: "13px",
        textTransform: "uppercase" as const,
      },
    },
    {
      name: "Uniswap",
      style: {
        fontFamily: '"Trebuchet MS", sans-serif',
        fontWeight: 600,
        letterSpacing: "0.01em",
        fontSize: "15px",
        fontStyle: "italic",
      },
    },
    {
      name: "Aave",
      style: {
        fontFamily: '"Courier New", monospace',
        fontWeight: 700,
        letterSpacing: "0.12em",
        fontSize: "13px",
        textTransform: "uppercase" as const,
      },
    },
    {
      name: "Compound",
      style: {
        fontFamily: 'Palatino, "Book Antiqua", serif',
        fontWeight: 400,
        letterSpacing: "-0.01em",
        fontSize: "16px",
      },
    },
    {
      name: "MakerDAO",
      style: {
        fontFamily: 'Impact, "Arial Narrow", sans-serif',
        fontWeight: 400,
        letterSpacing: "0.04em",
        fontSize: "14px",
      },
    },
    {
      name: "Chainlink",
      style: {
        fontFamily: "Verdana, sans-serif",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        fontSize: "13px",
      },
    },
  ];

  return (
    <section className="flex-1 flex items-end w-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            .marquee-track {
              display: flex;
              width: max-content;
              animation: marquee 22s linear infinite;
            }
          `,
        }}
      />
      <div className="relative w-full overflow-hidden flex flex-col justify-end p-lg md:p-xl pt-3xl h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-start p-lg md:p-xl justify-start">
          <h1 className="text-text-primary text-[48px] md:text-[72px] font-semibold leading-[1.05] tracking-[-0.04em] mb-md max-w-94">
            Your Wealth
            <br />
            Works
          </h1>
          <p
            className="text-text-secondary text-[16px] md:text-[18px] max-w-115 mb-lg leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            An automated, reward-powered digital dollar built for native passive
            earnings and effortless connection into DeFi.
          </p>

          <Button
            variant="primary"
            className="pl-lg pr-sm py-xs text-[16px] font-semibold group cursor-pointer"
            icon={<ArrowRight size={18} />}
          >
            Join us
          </Button>

          {/* Brand Marquee */}
          <div className="mt-xl w-full max-w-115 overflow-hidden">
            <div className="marquee-track">
              {/* First loop */}
              {brands.map((brand, idx) => (
                <span
                  key={`b1-${brand.name}`}
                  className="mx-lg shrink-0 text-text-secondary whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-150"
                  style={brand.style}
                >
                  {brand.name}
                </span>
              ))}
              {/* Second loop */}
              {brands.map((brand, idx) => (
                <span
                  key={`b2-${brand.name}`}
                  className="mx-lg shrink-0 text-text-secondary whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity duration-150"
                  style={brand.style}
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
