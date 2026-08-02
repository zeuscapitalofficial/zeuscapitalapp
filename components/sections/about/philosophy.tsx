export function AboutPhilosophySection() {
  return (
    <section className="py-3xl bg-white border-t border-b border-[rgba(0,0,0,0.06)]">
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="flex flex-col gap-md mb-3xl max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
            Our Philosophy
          </span>
          <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] leading-tight font-serif italic text-black">
            Our structural invariants.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="flex flex-col gap-md">
            <h4 className="text-[21px] font-semibold text-black">
              01 / Mechanical Rigor
            </h4>
            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              We treat software and datacenter design with mechanical precision.
              We avoid trends and focus on compiling strict, typed architectures
              that guarantee high availability.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <h4 className="text-[21px] font-semibold text-black">
              02 / Audited Uptime
            </h4>
            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              Transparency is non-negotiable. From hash rates to custody
              movements, all data is verifiable on-chain and reviewed regularly
              by third-party auditors.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <h4 className="text-[21px] font-semibold text-black">
              03 / Capital Protection
            </h4>
            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              Every decision, from energy contracts to key sharding, is
              optimized to protect capital against technological and economic
              tail risks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
