export function AboutMissionSection() {
  return (
    <section className="py-2xl bg-white border-t border-b border-[rgba(0,0,0,0.06)]">
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2xl">
          <div className="flex flex-col gap-md">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
              The Mission
            </span>
            <h3 className="text-[32px] font-semibold tracking-tight text-black leading-tight">
              To engineer the most secure, transparent, and resilient gate to
              digital wealth.
            </h3>
            <p className="text-[16px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              We reject the paper claims model of traditional brokers. We
              empower high-net-worth investors and family offices to possess
              direct physical and cryptographic ownership over their computing
              power and digital holdings.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
              The Vision
            </span>
            <h3 className="text-[32px] font-semibold tracking-tight text-black leading-tight">
              A sovereign digital economy anchored in physical infrastructure.
            </h3>
            <p className="text-[16px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              As money becomes purely digital, security must become physical. We
              envision a future where digital asset reserves are backed by
              sustainable hardware hash rates, fully audited pipelines, and
              client-controlled custody vaults.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
