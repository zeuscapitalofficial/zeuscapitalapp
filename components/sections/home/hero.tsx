import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react";

export function HeroSection() {
  return (
    <section className="">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="mx-auto relative h-screen w-full max-w-7xl overflow-hidden pt-44 md:pt-36 lg:pt-28">
        {/* Video Background */}

        {/* Content positioned in bottom left */}
        <div className="relative z-10 flex max-w-5xl flex-col gap-5">
          <Link
            className={cn(
              "group flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow-xs",
              "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out",
            )}
            href="/#mining"
          >
            <div className="rounded-sm border bg-card px-1.5 py-0.5 shadow-sm">
              <p className="font-mono text-xs">LIVE</p>
            </div>

            <span className="text-xs">ASIC Mining Capacity Online</span>
            <span className="block h-5 border-l" />

            <div className="pr-1">
              <ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
            </div>
          </Link>

          <h1
            className={cn(
              "text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 text-balance font-medium text-foreground leading-tight",
              "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out",
            )}
          >
            Sovereign Digital Asset Brokerage & Mining
          </h1>

          <p
            className={cn(
              "text-muted-foreground text-sm tracking-wider max-w-100 sm:text-lg md:text-xl",
              "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out",
            )}
          >
            We engineer industrial-scale mining infrastructure and provide private OTC brokerage pipelines for institutional wealth.
          </p>

          <div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
            <Link href="/contact">
              <Button variant="outline">
                <PhoneCallIcon data-icon="inline-start" /> Book a Call
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-accent dark:bg-accent-foreground hover:bg-accent-foreground dark:hover:bg-accent text-background-foreground">
                Get started <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
