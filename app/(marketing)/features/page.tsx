import { Card } from "@/components/ui/card";
import {
  Cpu,
  ShieldCheck,
  Coins,
  Database,
  RefreshCw,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Cpu,
    title: "High-Performance Cloud Hashing",
    desc: "Rent industrial ASIC nodes located in high-cooling geothermal zones in Iceland. Mine digital assets with zero local maintenance costs or electric bills.",
  },
  {
    icon: ShieldCheck,
    title: "Institutional Custody Secure Vaults",
    desc: "Enjoy top-grade compliance safeguards. Multi-signature offline cold storage protects client funds against digital network intrusion risks.",
  },
  {
    icon: Coins,
    title: "OTC Multi-Asset Brokerage",
    desc: "Execute large block orders in Bitcoin and Ethereum at institutional pricing. Trades settle directly to your private custody wallet with best-execution guarantees and zero slippage on OTC desk fills.",
  },
  {
    icon: Database,
    title: "Immutable Transaction Ledger",
    desc: "Every transaction, mining payout, and custodial transfer is recorded with cryptographic integrity. Your complete account history is available on demand for compliance, tax reporting, and audit purposes.",
  },
  {
    icon: RefreshCw,
    title: "Live Market Price Feeds",
    desc: "Real-time spot prices are sourced from multiple institutional data feeds and cross-validated to ensure accuracy. Mining yield calculations and OTC valuations always reflect true market conditions.",
  },
  {
    icon: BarChart2,
    title: "Portfolio Analytics Dashboard",
    desc: "Monitor mining hashrate, yield trends, and asset performance in real time. Interactive charts display cumulative return curves, daily payout history, and account net value across all holdings.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen text-[#000000] font-sans pt-[120px] pb-3xl select-none">
      <div className="max-w-[88rem] mx-auto px-lg flex flex-col gap-2xl">
        {/* Title Block */}
        <div className="flex flex-col items-center text-center gap-xs max-w-[800px] mx-auto">
          <span className="text-xs font-semibold text-[#8B7CFF] uppercase tracking-wider">
            Premium Infrastructure
          </span>
          <h1 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.03em] leading-tight mt-xs text-black">
            Platform Features
          </h1>
          <p className="text-[18px] text-[rgba(0,0,0,0.55)] font-medium leading-relaxed">
            Zeus Capital blends multi-asset digital brokerage interfaces with
            industrial geothermal cloud mining arrays.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-sm">
          {features.map((feat) => (
            <Card
              key={feat.title}
              variant="flat"
              className="p-lg bg-white border border-[rgba(0,0,0,0.04)] rounded-[21px] flex flex-col gap-md hover:border-[rgba(0,0,0,0.08)] hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-[12px] bg-[#2B2644]/5 flex items-center justify-center text-[#2B2644]">
                <feat.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-[20px] font-semibold text-black tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-[14px] text-[rgba(0,0,0,0.55)] leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Block */}
        <div className="bg-white border border-[rgba(0,0,0,0.04)] rounded-[34px] p-xl flex flex-col items-center text-center gap-md max-w-[800px] mx-auto w-full mt-xl">
          <h2 className="text-[32px] font-semibold tracking-tight text-black">
            Start Generating Hashing Yield
          </h2>
          <p className="text-[15px] text-[rgba(0,0,0,0.55)] font-medium leading-relaxed max-w-[600px]">
            Log in to lease hardware packages in seconds. Check live stats,
            request funding audits, and withdraw your balances instantly.
          </p>
          <div className="flex gap-sm mt-sm">
            <Link href="/sign-up">
              <Button variant="default" className="px-6 py-2.5">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" className="px-6 py-2.5">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
