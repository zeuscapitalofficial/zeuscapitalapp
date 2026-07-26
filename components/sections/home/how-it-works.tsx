export function HowItWorksSection() {
  return (
    <section className="py-3xl bg-white border-t border-b border-[rgba(0,0,0,0.06)]">
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="flex flex-col gap-md mb-3xl max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
            The onboarding sequence
          </span>
          <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-black">
            Simple onboarding, <br />
            secure integration.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg relative">
          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-[rgba(0,0,0,0.1)] leading-none font-mono">
              01
            </span>
            <h4 className="text-[18px] font-semibold text-black">
              Identity Verification
            </h4>
            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              Complete our corporate or individual onboarding questionnaire and
              verify credentials under strict compliance guidelines.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-[rgba(0,0,0,0.1)] leading-none font-mono">
              02
            </span>
            <h4 className="text-[18px] font-semibold text-black">
              Custody Provisioning
            </h4>
            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              Establish private multi-signature vaults through our custodian
              network to prepare cold reserves.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-[rgba(0,0,0,0.1)] leading-none font-mono">
              03
            </span>
            <h4 className="text-[18px] font-semibold text-black">
              Deploy Capital
            </h4>
            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              Fund your account or contract active hashrate capacity utilizing
              regulated banking networks or direct wallet transfers.
            </p>
          </div>

          <div className="flex flex-col gap-md">
            <span className="text-[48px] font-semibold text-[rgba(0,0,0,0.1)] leading-none font-mono">
              04
            </span>
            <h4 className="text-[18px] font-semibold text-black">
              Compound Yields
            </h4>
            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)]">
              Acquire assets or monitor daily mining reward distributions,
              building long-term digital wealth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
