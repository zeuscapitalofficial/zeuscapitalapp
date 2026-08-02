export function HowItWorksSection() {
  return (
    <section className="py-3xl bg-background border-t border-border">
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="flex flex-col gap-md mb-3xl max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Your onboarding journey
          </span>
          <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black">
            From verification
            <br />
            to compounding yield.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg relative">
          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-muted-foreground/20 leading-none font-mono">
              01
            </span>
            <h4 className="text-[18px] font-semibold text-foreground">
              Identity Verification
            </h4>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Complete our corporate or individual onboarding questionnaire and
              verify credentials under strict compliance guidelines.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-muted-foreground/20 leading-none font-mono">
              02
            </span>
            <h4 className="text-[18px] font-semibold text-foreground">
              Custody Provisioning
            </h4>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Establish private multi-signature vaults through our custodian
              network to prepare cold reserves.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-muted-foreground/20 leading-none font-mono">
              03
            </span>
            <h4 className="text-[18px] font-semibold text-foreground">
              Deploy Capital
            </h4>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Fund your account or contract active hashrate capacity utilizing
              regulated banking networks or direct wallet transfers.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-muted-foreground/20 leading-none font-mono">
              04
            </span>
            <h4 className="text-[18px] font-semibold text-foreground">
              Compound Yields
            </h4>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Acquire assets or monitor daily mining reward distributions,
              building long-term digital wealth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
