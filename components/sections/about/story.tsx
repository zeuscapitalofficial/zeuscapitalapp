export function AboutStorySection() {
  return (
    <section className="py-3xl px-md max-w-[88rem] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl">
        {/* Left Header */}
        <div className="lg:col-span-5 flex flex-col gap-md items-start">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
            The Narrative
          </span>
          <h2 className="text-[40px] sm:text-[56px] font-serif italic tracking-[-0.03em] leading-tight text-black">
            Why we built
            <br /> Zeus Capital.
          </h2>
        </div>

        {/* Right Story Copy */}
        <div className="lg:col-span-7 flex flex-col gap-lg text-[16px] leading-relaxed text-[rgba(0,0,0,0.7)]">
          <p>
            The legacy financial system was engineered for an era of physical
            paper ledgers. When digital assets emerged, the industry rushed to
            overlay modern volatile protocols on top of archaic plumbing. The
            results were predictable: systemic fragility, opaque exchanges, and
            custodian failures.
          </p>
          <p>
            Zeus Capital was founded on a simple conviction: digital wealth
            deserves native, robust infrastructure built from the hardware layer
            up. We recognized that digital assets represent a new class of
            digital commodities. To capture this opportunity securely, investors
            need direct integration between spot execution desks and physical
            mining datacenter facilities.
          </p>
          <p>
            By building our own sustainable cooling datacenters and connecting
            them directly with institutional custody pipelines, we eliminate
            third-party operational dependencies. The resulting platform
            delivers pure exposure to digital asset growth without
            administrative compromise.
          </p>
        </div>
      </div>
    </section>
  );
}
