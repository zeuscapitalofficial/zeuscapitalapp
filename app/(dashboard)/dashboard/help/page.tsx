"use client";

import {
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const faqs = [
  {
    question: "How do I deposit funds?",
    answer:
      "You can deposit funds by navigating to the Deposit & Withdraw tab, copying your secure ERC-20 address, and sending USD Halo (USDH) or compatible assets. Payouts credit after 12 network confirmations.",
  },
  {
    question: "What is USD Halo (USDH)?",
    answer:
      "USD Halo is our platform's audited stablecoin pegged 1:1 to the US Dollar, secured by liquid dollar assets, yielding stable interest staking returns.",
  },
  {
    question: "When are ASIC payouts distributed?",
    answer:
      "Mining rewards are calculated daily based on active hashrate telemetry and credited automatically to your available wallet balance at 00:00 UTC.",
  },
  {
    question: "How long does verification take?",
    answer:
      "KYC approvals normally compile in 2-4 hours. You will receive an automated email notification once the compliance audit finishes.",
  },
];

export default function HelpPage() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const handleTicketSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTicketSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
            Client Relations
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            Help & Support
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium">
            Search our FAQ catalog or open a secure support ticket with our
            desk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
        {/* FAQs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          <h3 className="text-[18px] font-semibold text-white">
            Frequently Asked Questions
          </h3>
          <div className="flex flex-col gap-sm">
            {faqs.map((faq, idx) => {
              const isOpen = selectedFaq === idx;
              return (
                <Card
                  key={idx}
                  onClick={() => setSelectedFaq(isOpen ? null : idx)}
                  className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[16px] cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-all flex flex-col gap-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[14px] text-white flex items-center gap-sm">
                      <HelpCircle className="w-4 h-4 text-[#8B7CFF]" />
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-[rgba(255,255,255,0.3)] transition-transform duration-200 ${isOpen ? "rotate-90 text-white" : ""}`}
                    />
                  </div>
                  {isOpen && (
                    <p className="text-[13px] text-[rgba(255,255,255,0.72)] leading-relaxed font-medium pl-6 border-t border-[rgba(255,255,255,0.02)] pt-2">
                      {faq.answer}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Support Ticket (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-md">
          <h3 className="text-[18px] font-semibold text-white">
            Create Support Ticket
          </h3>
          {ticketSubmitted ? (
            <Card
              variant="flat"
              className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center flex flex-col items-center gap-sm py-xl"
            >
              <CheckCircle className="w-12 h-12 text-[#22C55E]" />
              <h4 className="font-semibold text-white">Ticket Raised</h4>
              <p className="text-[12px] text-[rgba(255,255,255,0.72)] leading-relaxed">
                We've queued your ticket. A client representative will respond
                shortly via email.
              </p>
            </Card>
          ) : (
            <Card
              variant="flat"
              className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
            >
              <form
                className="flex flex-col gap-md"
                onSubmit={handleTicketSubmit}
              >
                <div className="flex flex-col gap-xs">
                  <Label
                    htmlFor="category"
                    className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
                  >
                    Query Category
                  </Label>
                  <select
                    id="category"
                    className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#09090B] text-sm h-10 px-3 text-white focus:outline-none"
                    required
                  >
                    <option value="funding">Funding & Wallet</option>
                    <option value="mining">ASIC Packages</option>
                    <option value="signals">Trading Signals</option>
                    <option value="kyc">Compliance & KYC</option>
                    <option value="other">Other / Support</option>
                  </select>
                </div>

                <div className="flex flex-col gap-xs">
                  <Label
                    htmlFor="subject"
                    className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
                  >
                    Subject Line
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="e.g. ASIC miner status offline"
                    required
                    className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder-[rgba(255,255,255,0.3)]"
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <Label
                    htmlFor="message"
                    className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider"
                  >
                    Message Details
                  </Label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Provide details about your query..."
                    required
                    className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-transparent text-sm p-3 text-white focus:outline-none resize-none font-sans"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px]"
                >
                  Submit Ticket
                </Button>
              </form>
            </Card>
          )}

          <Card
            variant="flat"
            className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex items-center gap-sm"
          >
            <Mail className="w-5 h-5 text-[#8B7CFF] shrink-0" />
            <div className="flex flex-col text-[12px] font-medium">
              <span className="text-white">Direct Email Desk</span>
              <span className="text-[rgba(255,255,255,0.48)]">
                support@zeus.capital
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
