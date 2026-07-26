import { CheckCircle, Cpu, Shield } from "lucide-react";

export function AboutSecuritySection() {
  return (
    <section
      id="security"
      className="py-3xl px-md max-w-[88rem] mx-auto w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl items-center">
        {/* Left Graphics */}
        <div className="lg:col-span-5 order-last lg:order-first flex flex-col gap-md">
          <div className="border border-[rgba(0,0,0,0.08)] bg-white rounded-card-custom p-lg">
            <div className="flex items-center gap-md mb-md">
              <div className="w-[36px] h-[36px] bg-[#F5F5F5] rounded-full flex items-center justify-center text-black">
                <Shield size={18} />
              </div>
              <div>
                <h5 className="text-[16px] font-semibold text-black">
                  HSM Isolation Layer
                </h5>
                <span className="text-[12px] text-[rgba(0,0,0,0.4)]">
                  Hardware-level cryptography protection
                </span>
              </div>
            </div>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)] leading-relaxed">
              Private root keys are generated inside military-grade FIPS 140-2
              Level 3 hardware security modules. They are physically incapable
              of being exported or accessed via the network.
            </p>
          </div>

          <div className="border border-[rgba(0,0,0,0.08)] bg-white rounded-card-custom p-lg">
            <div className="flex items-center gap-md mb-md">
              <div className="w-[36px] h-[36px] bg-[#F5F5F5] rounded-full flex items-center justify-center text-black">
                <Cpu size={18} />
              </div>
              <div>
                <h5 className="text-[16px] font-semibold text-black">
                  Physical Air-Gapping
                </h5>
                <span className="text-[12px] text-[rgba(0,0,0,0.4)]">
                  Offline deep custody vaults
                </span>
              </div>
            </div>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)] leading-relaxed">
              Signing operations for high-value administrative commands occur on
              isolated nodes requiring physical keys, smartcards, and geographic
              sign-offs.
            </p>
          </div>
        </div>

        {/* Right Text */}
        <div className="lg:col-span-7 flex flex-col gap-lg items-start">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
            Defense In Depth
          </span>
          <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-black">
            Custody, protected at every level.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-relaxed text-[rgba(0,0,0,0.7)]">
            Our approach to digital asset defense combines advanced
            cryptographic protocols with strict operational policies. We
            maintain structural boundaries between platform database nodes and
            custodian vault layers, eliminating vulnerabilities at the
            platform-custodian boundary.
          </p>
          <div className="flex flex-col sm:flex-row gap-md mt-md">
            <div className="flex items-center gap-sm">
              <CheckCircle className="text-black shrink-0" size={16} />
              <span className="text-[14px] text-[rgba(0,0,0,0.7)]">
                FIPS 140-2 Level 3
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <CheckCircle className="text-black shrink-0" size={16} />
              <span className="text-[14px] text-[rgba(0,0,0,0.7)]">
                ISO 27001 Datacenters
              </span>
            </div>
            <div className="flex items-center gap-sm">
              <CheckCircle className="text-black shrink-0" size={16} />
              <span className="text-[14px] text-[rgba(0,0,0,0.7)]">
                Multi-Custody Settlement
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
