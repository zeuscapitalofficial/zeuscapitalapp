import { Accordion } from "@/components/ui/accordion";

export function FaqSection() {
  const faqItems = [
    {
      title: "How does the mining hosting model work?",
      content:
        "Zeus Capital operates institutional-grade hosting facilities with sustainable power sources. When you allocate capital to mining, we acquire physical ASIC hardware on your behalf, host it in our monitored tier-3 facilities, and distribute daily block rewards directly to your multi-sig custodian wallet.",
    },
    {
      title: "What are the minimum capital requirements for brokerage?",
      content:
        "Our digital asset brokerage is tailored for high-net-worth individuals, corporations, and family offices. The minimum initial account opening size for personalized OTC brokerage access is $250,000 USD, or equivalent in major digital assets.",
    },
    {
      title: "How is Zeus Capital regulated and audited?",
      content:
        "We prioritize operational integrity. Our custody pipelines and assets are audited quarterly by top-tier independent firms. All client transactions flow through regulated fiat trust accounts, and our physical facilities adhere to ISO 27001 data security standards.",
    },
    {
      title: "What security measures are applied to digital asset custody?",
      content:
        "We employ institutional-grade multi-party computation (MPC) combined with hardware security modules (HSM). 100% of cold storage assets are held in offline vaults requiring geographically separated multi-signature authorization.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-3xl bg-white border-t border-b border-[rgba(0,0,0,0.06)]"
    >
      <div className="max-w-[88rem] mx-auto px-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl">
          <div className="lg:col-span-5 flex flex-col gap-md items-start">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
              Got Questions?
            </span>
            <h2 className="text-[40px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-tight text-black">
              Frequently Asked Questions
            </h2>
            <p className="text-[16px] leading-relaxed text-[rgba(0,0,0,0.55)] max-w-4xl mt-md">
              Everything you need to know about our physical mining, custody
              structures, and OTC trading operations. For custom inquiries,
              please contact our relationship managers.
            </p>
          </div>
          <div className="lg:col-span-7">
            <Accordion items={faqItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
