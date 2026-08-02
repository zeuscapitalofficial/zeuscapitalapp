import { CheckCircle, Cpu, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SecuritySection() {
  return (
    <section className="py-3xl px-md max-w-[88rem] mx-auto w-full">
      <Card variant="dark" size="sm" className="relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[rgba(255,255,255,0.015)] rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-lg items-start">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)]">
              Institutional Security
            </span>
            <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-white">
              Sovereignty over your digital capital.
            </h2>
            <p className="text-[16px] md:text-[18px] leading-relaxed text-[rgba(255,255,255,0.7)] max-w-4xl">
              We combine multi-signature security protocols with military-grade offline vaults. 
              This completely eliminates single-point failures, preventing network breaches from compromising reserves.
            </p>

            <div className="flex flex-col sm:flex-row gap-md mt-md">
              <div className="flex items-center gap-sm">
                <CheckCircle className="text-white shrink-0" size={18} />
                <span className="text-[14px] text-[rgba(255,255,255,0.85)]">
                  Quarterly Audits
                </span>
              </div>
              <div className="flex items-center gap-sm">
                <CheckCircle className="text-white shrink-0" size={18} />
                <span className="text-[14px] text-[rgba(255,255,255,0.85)]">
                  Regulated Trusts
                </span>
              </div>
              <div className="flex items-center gap-sm">
                <CheckCircle className="text-white shrink-0" size={18} />
                <span className="text-[14px] text-[rgba(255,255,255,0.85)]">
                  Multi-Sig Vaults
                </span>
              </div>
            </div>
          </div>

          {/* Right representation: Secure Key Vault layout */}
          <div className="lg:col-span-5 w-full flex flex-col gap-md">
            <div className="bg-white/5 border border-white/10 rounded-card-custom p-md flex items-center gap-md">
              <div className="w-[36px] h-[36px] bg-white/10 rounded-full flex items-center justify-center text-white font-semibold text-[13px]">
                1
              </div>
              <div>
                <span className="text-[14px] font-semibold text-white block">
                  MPC Key Partition A
                </span>
                <span className="text-[11px] text-[rgba(255,255,255,0.5)]">
                  Custodian Offline Security Module
                </span>
              </div>
              <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-[11px] px-[8px] py-[3px] rounded-full font-semibold">
                Verified
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-card-custom p-md flex items-center gap-md">
              <div className="w-[36px] h-[36px] bg-white/10 rounded-full flex items-center justify-center text-white font-semibold text-[13px]">
                2
              </div>
              <div>
                <span className="text-[14px] font-semibold text-white block">
                  MPC Key Partition B
                </span>
                <span className="text-[11px] text-[rgba(255,255,255,0.5)]">
                  Zeus Capital Client Node
                </span>
              </div>
              <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-[11px] px-[8px] py-[3px] rounded-full font-semibold">
                Verified
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-card-custom p-md flex items-center gap-md opacity-60">
              <div className="w-[36px] h-[36px] bg-white/10 rounded-full flex items-center justify-center text-white font-semibold text-[13px]">
                3
              </div>
              <div>
                <span className="text-[14px] font-semibold text-white block">
                  Co-Signer Auth Partition
                </span>
                <span className="text-[11px] text-[rgba(255,255,255,0.5)]">
                  Third-party Trust Entity
                </span>
              </div>
              <span className="ml-auto bg-amber-500/20 text-amber-400 text-[11px] px-[8px] py-[3px] rounded-full font-semibold">
                Pending
              </span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
