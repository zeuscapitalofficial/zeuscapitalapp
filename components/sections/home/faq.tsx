import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 md:grid-cols-2">
      <div className="px-4">
        <div className="space-y-5">
          <h2 className="text-[40px] sm:text-[56px] tracking-[-0.03em] font-serif italic max-w-118 leading-[1.1] text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Quick answers to common questions about Zeus Capital's brokerage,
            custody, and mining services.
          </p>
          <p className="text-muted-foreground">
            {"Can't find what you're looking for? "}
            <a
              className="text-accent-foreground font-bold hover:underline"
              href="/contact"
            >
              Contact Us
            </a>
          </p>
        </div>
      </div>
      <div className="relative">
        <Accordion className="rounded-none">
          {faqs.map((item) => (
            <AccordionItem
              className="group relative pl-5"
              key={item.id}
              value={item.id}
            >
              <AccordionTrigger className="px-4 hover:no-underline focus-visible:underline focus-visible:ring-0">
                {item.title}
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const faqs = [
  {
    id: "item-1",
    title: "What does Zeus Capital offer?",
    content:
      "Zeus Capital is a premium digital asset brokerage and industrial-scale mining platform. We offer OTC trade execution, private multi-signature custody, and physical ASIC hashrate hosting for institutional investors and high-net-worth individuals.",
  },
  {
    id: "item-2",
    title: "Who is Zeus Capital designed for?",
    content:
      "We serve family offices, institutional funds, and high-net-worth individuals who require institutional-grade security, transparent mining operations, and direct ownership of digital assets without exchange counterparty risk.",
  },
  {
    id: "item-3",
    title: "How does ASIC mining hosting work?",
    content:
      "When you lease hashrate capacity under a Zeus Capital contract, we allocate physical ASIC hardware in our Iceland geothermal facility to your account. Daily mining rewards are calculated against active hashrate telemetry and credited automatically to your custody wallet at 00:00 UTC.",
  },
  {
    id: "item-4",
    title: "How is client capital held in custody?",
    content:
      "Client assets are held in multi-party computation (MPC) vaults using FIPS 140-2 Level 3 hardware security modules. Signing operations require physical key material and multi-stakeholder sign-off, eliminating single-point-of-failure risk.",
  },
  {
    id: "item-5",
    title: "Do you offer OTC brokerage for large orders?",
    content:
      "Yes. Our institutional desk handles large block trades in Bitcoin, Ethereum, and select digital commodities with best-execution pricing, minimal market impact, and same-day settlement directly into your custody vault.",
  },
  {
    id: "item-6",
    title: "What compliance and regulatory standards do you follow?",
    content:
      "Zeus Capital adheres to full AML and KYC protocols. All accounts require identity verification before accessing mining contracts or withdrawal channels. Our custody infrastructure complies with ISO 27001 datacenter standards and undergoes quarterly third-party security audits.",
  },
  {
    id: "item-7",
    title: "How do I get started with Zeus Capital?",
    content:
      "Create an account, complete identity verification, and our team will guide you through custody provisioning and selecting the right mining or brokerage service for your capital objectives. Contact our desk at support@zeus.capital for expedited onboarding.",
  },
];
