"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const faqCategories = [
  {
    title: "Account & Verification",
    items: [
      {
        q: "What documents are required for KYC verification?",
        a: "We require a valid government-issued ID card (front and back) or Passport, alongside a proof of residential address (such as a utility bill or bank statement issued within the last 90 days)."
      },
      {
        q: "How long does the verification audit take?",
        a: "Manual compliance reviews are processed by our auditors within 2 hours. You will receive an email confirmation and status updates on your dashboard."
      }
    ]
  },
  {
    title: "Cloud Mining Tiers",
    items: [
      {
        q: "How does geothermal cloud mining work?",
        a: "Zeus Capital owns and operates high-performance ASIC hashing clusters inside carbon-neutral cooling zones in Iceland. When you lease a plan, we allocate hashing capacity to your digital wallet index, crediting daily yields directly."
      },
      {
        q: "Are there any hidden maintenance fees?",
        a: "No, all maintenance fees, power costs, and cooling charges are fully factored into the upfront contract lease price. What you see is exactly what you get."
      }
    ]
  },
  {
    title: "Deposits & Withdrawals",
    items: [
      {
        q: "How do I deposit funds to my digital ledger?",
        a: "You can deposit funds securely using USD Halo (USDH) tokens. Go to your dashboard deposit page, copy the unique wallet address, and initiate a transfer from your ERC-20 compatible wallet."
      },
      {
        q: "Are withdrawals subject to daily processing limits?",
        a: "Standard accounts have a 24h limit of $50,000 USDH. Once your profile is KYC verified and cleared, limits are lifted and outgoing payments are settled instantly."
      }
    ]
  }
];

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen text-[#000000] font-sans pt-[120px] pb-3xl select-none">
      <div className="max-w-[88rem] mx-auto px-lg flex flex-col gap-2xl">
        
        {/* Title Block */}
        <div className="flex flex-col items-center text-center gap-xs max-w-[800px] mx-auto">
          <span className="text-xs font-semibold text-[#8B7CFF] uppercase tracking-wider">
            Help & Knowledge Hub
          </span>
          <h1 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.03em] leading-tight mt-xs text-black">
            Frequently Asked Questions
          </h1>
          <p className="text-[18px] text-[rgba(0,0,0,0.55)] font-medium leading-relaxed">
            Find quick answers to common queries regarding accounts, hashrate plans, ledger payouts, and security protocols.
          </p>
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-xl max-w-[800px] mx-auto w-full mt-sm">
          {faqCategories.map((category) => (
            <div key={category.title} className="flex flex-col gap-sm">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider border-b border-[rgba(0,0,0,0.06)] pb-xs text-left">
                {category.title}
              </h3>
              
              <div className="flex flex-col gap-xs">
                {category.items.map((item, index) => {
                  const uniqueId = `${category.title}-${index}`;
                  const isOpen = openId === uniqueId;
                  return (
                    <Card
                      key={item.q}
                      variant="flat"
                      className="p-md bg-white border border-[rgba(0,0,0,0.04)] rounded-[16px] flex flex-col gap-sm transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(uniqueId)}
                        className="flex justify-between items-center w-full text-left font-semibold text-[15px] font-sans text-black gap-sm cursor-pointer"
                      >
                        <span className="flex items-center gap-xs">
                          <HelpCircle className="w-4 h-4 text-[#8B7CFF] shrink-0" /> {item.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <p className="text-[13px] text-[rgba(0,0,0,0.55)] leading-relaxed font-medium pl-6 border-t border-[rgba(0,0,0,0.02)] pt-sm text-left">
                          {item.a}
                        </p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
