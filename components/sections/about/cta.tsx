import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AboutCtaSection() {
  return (
    <section className="py-3xl px-md max-w-[88rem] mx-auto w-full">
      <Card
        variant="dark"
        size="sm"
        className="text-center flex flex-col items-center gap-lg"
      >
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.6)]">
          Partner with us
        </span>
        <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-white max-w-4xl">
          Build your digital asset foundation.
        </h2>
        <p className="text-[16px] md:text-[18px] text-[rgba(255,255,255,0.7)] max-w-4xl mb-md">
          Learn how family offices and high-net-worth investors deploy capital
          safely into digital commodity brokerage and mining hosting.
        </p>
        <div className="flex flex-col sm:flex-row gap-md">
          <Link href="/sign-up">
            <Button
              variant="default"
              className="bg-white text-black hover:bg-neutral-100 gap-2"
            >
              Establish Account
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="bg-transparent text-white border-white/20 hover:bg-white/5 hover:border-white/40"
            >
              Discuss Custody Options
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
