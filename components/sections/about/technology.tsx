import { Cpu, Layers, Terminal, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export function AboutTechnologySection() {
  return (
    <section
      id="technology"
      className="py-3xl bg-white border-t border-b border-[rgba(0,0,0,0.06)]"
    >

      <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-16">
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
          Platform Architecture
        </span>
        <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black">
          The Lyra ecosystem brings together our models.
        </h2>
            <p className="text-muted-foreground">
              Our platform is purpose-built for institutional-grade reliability.
              Every component — from{" "}
              <span className="text-accent-foreground font-bold">
                real-time mining telemetry pipelines
              </span>{" "}
              to custody settlement modules — is designed to minimize latency,
              eliminate single-point failures, and provide full auditability at
              every transaction layer.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="size-4" />
                  <h3 className="text-sm font-medium">
                    Deterministic Processing</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                 Strictly typed, zero ambiguity
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4" />
                  <h3 className="text-sm font-medium">Modular Architecture</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Isolated, independently auditable
                </p>
              </div>
            </div>
          </div>
          <div className="relative mt-6 sm:mt-0">
            <div className="bg-linear-to-b aspect-67/34 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/exercice-dark.png"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1206}
                height={612}
              />
              <Image
                src="/exercice.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="payments illustration light"
                width={1206}
                height={612}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
