import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: "Product",
      links: [
        { label: "Brokerage", href: "/#brokerage" },
        { label: "Institutional Custody", href: "/#custody" },
        { label: "Mining Operations", href: "/#mining" },
        { label: "Analytics Suite", href: "/#analytics" },
      ],
    },
    {
      title: "Mining",
      links: [
        { label: "Hardware Hosting", href: "/#mining" },
        { label: "Hashrate Allocations", href: "/#mining" },
        { label: "Reward Distributions", href: "/#mining" },
        { label: "Operational Integrity", href: "/#mining" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Philosophy", href: "/about#philosophy" },
        { label: "Infrastructure", href: "/about#technology" },
        { label: "Security First", href: "/about#security" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Statement", href: "/privacy" },
        { label: "Risk Disclosures", href: "/disclaimer" },
        { label: "System Status", href: "/status" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[rgba(0,0,0,0.08)] pt-3xl pb-xl">
      <div className="max-w-[88rem] mx-auto px-lg">
        {/* Top Grid: Brand & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2xl mb-2xl">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 flex flex-col gap-lg pr-lg">
            <Link
              href="/"
              className="flex items-center gap-sm active:scale-[0.98] transition-transform w-fit"
            >
              <LogoIcon className="text-[#000000]" size={28} />
              <span className="font-sans font-semibold text-[18px] tracking-tight text-[#000000]">
                Zeus Capital
              </span>
            </Link>

            <p className="text-[14px] leading-relaxed text-[rgba(0,0,0,0.55)] max-w-4xl">
              The standard for sovereign digital wealth. Engineering
              industrial-scale mining and institutional-grade brokerage for
              long-term compounding.
            </p>

            {/* Premium, minimal newsletter sign-up visual */}
            <div className="flex flex-col gap-sm">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
                Subscribe to updates
              </span>
              <div className="flex max-w-sm items-center border-b border-[#000000] pb-[6px] group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border-0 py-1 text-[14px] text-black placeholder:text-[rgba(0,0,0,0.4)] focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  className="p-1 text-[#000000] hover:translate-x-1 transition-transform duration-200 cursor-pointer"
                  aria-label="Submit newsletter form"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-md">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">
                {col.title}
              </span>
              <ul className="flex flex-col gap-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[rgba(0,0,0,0.55)] hover:text-[#000000] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[rgba(0,0,0,0.08)] w-full mb-lg" />

        {/* Bottom Section: Copyright & Legal Disclaimer */}
        <div className="flex flex-col gap-lg">
          {/* Regulatory Risk Disclaimer */}
          <div className="text-[11px] leading-relaxed text-[rgba(0,0,0,0.4)] max-w-5xl">
            <p className="mb-sm">
              <strong>Regulatory Notice & Risk Warning:</strong> Digital assets,
              cryptocurrency trading, and mining hosting contracts carry high
              levels of risk and may not be suitable for all investors. Before
              deciding to trade or participate in hardware hosting programs, you
              should carefully consider your investment objectives, level of
              experience, and risk appetite. The possibility exists that you
              could sustain a loss of some or all of your initial investment.
              You should be aware of all the risks associated with digital
              currencies and seek advice from an independent financial adviser
              if you have any doubts.
            </p>
            <p>
              Zeus Capital is a commercial provider of mining hardware hosting
              services and structured OTC brokerage access. Mining yields depend
              on network difficulty, energy tariffs, and market volatility, none
              of which can be guaranteed. Past performance indicators are not
              indicative of future mining outputs or asset valuations.
            </p>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm text-[13px] text-[rgba(0,0,0,0.55)]">
            <span>
              &copy; {currentYear} Zeus Capital Ltd. All rights reserved.
            </span>
            <span>Made with precision for institutional wealth.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
