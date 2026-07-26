import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CtaSection() {
  return (
    <section className="py-3xl px-md max-w-[88rem] mx-auto w-full">
      <Card
        variant="dark"
        size="large"
        className="text-center flex flex-col items-center gap-lg"
      >
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.6)]">
          Secure your account
        </span>
        <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-white max-w-4xl">
          Begin compounding digital asset wealth.
        </h2>
        <p className="text-[16px] md:text-[18px] text-[rgba(255,255,255,0.7)] max-w-5xl mb-md">
          Establish a secure private custody account or contract active hashrate
          capacity within minutes. Contact our desk for institutional sizes.
        </p>
        <div className="flex flex-col sm:flex-row gap-md">
          <Link href="/register">
            <Button
              variant="primary"
              className="bg-white text-black hover:bg-neutral-100"
              icon={<ArrowRight size={16} />}
            >
              Establish Account
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="secondary"
              className="bg-transparent text-white border-white/20 hover:bg-white/5 hover:border-white/40"
            >
              Contact OTC Desk
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
