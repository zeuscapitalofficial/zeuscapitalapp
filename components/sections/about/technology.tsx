import { Layers, Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AboutTechnologySection() {
  return (
    <section
      id="technology"
      className="py-3xl bg-white border-t border-b border-[rgba(0,0,0,0.06)]"
    >
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl items-center">
          {/* Left Column: Text & Stack Details */}
          <div className="lg:col-span-6 flex flex-col gap-lg items-start">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
              Platform Architecture
            </span>
            <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-[1.1] text-black">
              Built for performance. Compiled for safety.
            </h2>
            <p className="text-[16px] leading-relaxed text-[rgba(0,0,0,0.7)]">
              Zeus Capital is designed with modular software components to
              guarantee security and millisecond response times. We use Bun and
              TypeScript for deterministic compilations, coupled with Next.js
              App Router for server-rendered page deliveries.
            </p>

            <div className="grid grid-cols-2 gap-md w-full pt-md border-t border-[rgba(0,0,0,0.08)] mt-md">
              <div className="flex gap-sm">
                <Terminal className="text-black shrink-0" size={18} />
                <div>
                  <span className="text-[14px] font-semibold text-black block">
                    Strict TypeScript
                  </span>
                  <span className="text-[11px] text-[rgba(0,0,0,0.55)]">
                    Zero runtime any types
                  </span>
                </div>
              </div>
              <div className="flex gap-sm">
                <Layers className="text-black shrink-0" size={18} />
                <div>
                  <span className="text-[14px] font-semibold text-black block">
                    Modular Monolith
                  </span>
                  <span className="text-[11px] text-[rgba(0,0,0,0.55)]">
                    Isolated feature directories
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual representing Tech specs */}
          <div className="lg:col-span-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-md">
            <Card variant="border" className="p-md">
              <span className="text-[13px] font-bold text-black/40 font-mono block mb-xs">
                SERVER
              </span>
              <h4 className="text-[18px] font-semibold text-black mb-xs">
                Next.js 16 (App Router)
              </h4>
              <p className="text-[13px] text-[rgba(0,0,0,0.55)] leading-relaxed">
                Maximizes speed using edge-rendered React Server Components,
                keeping JavaScript bundles client-minimal.
              </p>
            </Card>

            <Card variant="border" className="p-md">
              <span className="text-[13px] font-bold text-black/40 font-mono block mb-xs">
                RUNTIME
              </span>
              <h4 className="text-[18px] font-semibold text-black mb-xs">
                Bun Package Manager
              </h4>
              <p className="text-[13px] text-[rgba(0,0,0,0.55)] leading-relaxed">
                Drives high-speed compilation, scripts orchestration, and
                lightning-fast local developer feedback loops.
              </p>
            </Card>

            <Card variant="border" className="p-md">
              <span className="text-[13px] font-bold text-black/40 font-mono block mb-xs">
                DATABASE
              </span>
              <h4 className="text-[18px] font-semibold text-black mb-xs">
                PostgreSQL & Prisma
              </h4>
              <p className="text-[13px] text-[rgba(0,0,0,0.55)] leading-relaxed">
                Provides relation safety, strict key structures, and efficient
                transactions for portfolio balances.
              </p>
            </Card>

            <Card variant="border" className="p-md">
              <span className="text-[13px] font-bold text-black/40 font-mono block mb-xs">
                AUTH
              </span>
              <h4 className="text-[18px] font-semibold text-black mb-xs">
                Better Auth Suite
              </h4>
              <p className="text-[13px] text-[rgba(0,0,0,0.55)] leading-relaxed">
                Enforces cryptographic session tokens, email verification
                protocols, and multi-factor authentications.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
