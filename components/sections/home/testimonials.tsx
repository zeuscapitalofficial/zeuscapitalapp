import { Card } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-3xl px-md max-w-[88rem] mx-auto w-full">
      <div className="flex flex-col gap-md mb-3xl max-w-4xl">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Client Testimonials
        </span>
        <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black">
          Endorsed by <br /> sovereign wealth.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <Card className="flex flex-col justify-between h-full p-lg">
          <p className="text-[16px] leading-relaxed text-muted-foreground italic">
            &ldquo;Zeus Capital completely resolved our concerns regarding
            custody risk for large-scale allocations. Settling trades directly
            into multi-sig storage has redefined how we interact with
            cryptocurrency brokers.&rdquo;
          </p>
          <div className="mt-lg pt-md border-t border-border">
            <span className="text-[14px] font-semibold text-foreground block">
              Marcus Sterling
            </span>
            <span className="text-[11px] text-muted-foreground/80 uppercase tracking-wider">
              Managing Partner, Sterling Family Office
            </span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-full p-lg">
          <p className="text-[16px] leading-relaxed text-muted-foreground italic">
            &ldquo;The hosting transparency is unmatched. Daily payouts flow
            directly to our vaults, and our on-site cameras/uptime logs confirm
            our ASICs are running exactly as contracted. A top-tier mining
            partner.&rdquo;
          </p>
          <div className="mt-lg pt-md border-t border-border">
            <span className="text-[14px] font-semibold text-foreground block">
              Elena Rostova
            </span>
            <span className="text-[11px] text-muted-foreground/80 uppercase tracking-wider">
              Chief Investment Officer, Rostova Digital
            </span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-full p-lg">
          <p className="text-[16px] leading-relaxed text-muted-foreground italic">
            &ldquo;Operating in both physical mining hosting and digital
            brokerage, Zeus Capital has created a unique hedge against market
            fluctuations. Their institutional desk delivers pristine
            execution.&rdquo;
          </p>
          <div className="mt-lg pt-md border-t border-border">
            <span className="text-[14px] font-semibold text-foreground block">
              Arthur Vance
            </span>
            <span className="text-[11px] text-muted-foreground/80 uppercase tracking-wider">
              Director of Treasury, Vance Corp
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
}
