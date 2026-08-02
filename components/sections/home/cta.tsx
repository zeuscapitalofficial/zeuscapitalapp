import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, ArrowRightIcon } from "lucide-react";

export function CtaSection() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-between gap-y-6 rounded-4xl border bg-card px-4 py-8 shadow-sm md:py-10 dark:bg-card/50">
      <div className="space-y-2">
        <h2 className="text-center font-semibold text-lg tracking-tight md:text-2xl">
          Begin compounding digital asset wealth.
        </h2>
        <p className="text-balance text-center text-muted-foreground text-sm md:text-base">
          Establish a private multi-sig custody account or contract active
          hashrate capacity today.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Link href="/contact">
          <Button className="" variant="secondary">
            Contact OTC Desk
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-accent dark:bg-accent-foreground hover:bg-accent-foreground dark:hover:bg-accent text-background-foreground">
            Open Custody Account <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
