"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Mouse } from "lucide-react";
import { LogoIcon } from "@/components/ui/logo";

export function AboutHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fadeItem0Ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [
        fadeItem0Ref.current,
        headingRef.current,
        subtextRef.current,
        scrollRef.current,
      ].filter(Boolean);

      targets.forEach((target, i) => {
        gsap.fromTo(
          target,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.15,
            ease: "power2.out", // Custom cubic bezier equivalent [0.22, 1, 0.36, 1]
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-md pt-[clamp(40px,8vw,72px)] pb-[48px] flex flex-col items-center justify-center">
        <div className="w-full max-w-[660px] mx-auto flex flex-col items-center text-center gap-md">
          {/* Logo Component */}
          <div ref={fadeItem0Ref} className="flex items-center justify-center mb-xs">
            <LogoIcon size={48} className="" />
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="font-serif text-center leading-[1.05] tracking-[-0.01em] italic font-semibold "
            style={{
              fontSize: "clamp(4.65rem, 5vw, 3rem)",
            }}
          >
            <span className="whitespace-nowrap">Sovereignty. Scale.</span>
            <br />
            <span>Stability</span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="font-sans /80 max-w-[560px] leading-[1.65] text-center"
            style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            }}
          >
            Zeus Capital was founded to bridge the physical realities of
            industrial mining with the mathematical guarantees of digital asset
            custody. We build premium financial technology for long-term
            compounders.
          </p>

          {/* Scroll for more Visual */}
          <div
            ref={scrollRef}
            className="mt-lg flex items-center justify-center pointer-events-none select-none"
          >
            <div className="px-6 py-4.25 flex items-center justify-center animate-pulse">
              <Mouse className="w-5 h-5 /90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
