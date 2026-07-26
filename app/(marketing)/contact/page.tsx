"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Sending message...",
        success: () => {
          setSubmitting(false);
          const form = e.target as HTMLFormElement;
          form.reset();
          return "Message dispatched! Our support team will respond shortly.";
        },
        error: "Failed to dispatch message."
      }
    );
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen text-[#000000] font-sans pt-[120px] pb-3xl select-none">
      <div className="max-w-[88rem] mx-auto px-lg flex flex-col gap-2xl">
        
        {/* Title Block */}
        <div className="flex flex-col items-center text-center gap-xs max-w-[800px] mx-auto">
          <span className="text-xs font-semibold text-[#8B7CFF] uppercase tracking-wider">
            Customer Support & Queries
          </span>
          <h1 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.03em] leading-tight mt-xs text-black">
            Get In Touch
          </h1>
          <p className="text-[18px] text-[rgba(0,0,0,0.55)] font-medium leading-relaxed">
            Have questions about ASIC hashing pools, account setups, or pricing? Contact our compliance and wealth managers.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start max-w-[1000px] mx-auto w-full mt-sm">
          {/* Office locations (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-md">
            <Card variant="flat" className="p-lg bg-white border border-[rgba(0,0,0,0.04)] rounded-[21px] flex flex-col gap-md text-left">
              <h3 className="text-[18px] font-semibold text-black tracking-tight border-b border-[rgba(0,0,0,0.04)] pb-xs">
                Wealth Center London
              </h3>
              <div className="flex flex-col gap-sm text-[13px] font-medium text-[rgba(0,0,0,0.6)]">
                <div className="flex items-start gap-xs">
                  <MapPin className="w-4 h-4 text-[#8B7CFF] shrink-0 mt-0.5" />
                  <span>30 St Mary Axe, London EC3A 8BF, United Kingdom</span>
                </div>
                <div className="flex items-center gap-xs">
                  <Mail className="w-4 h-4 text-[#8B7CFF]" />
                  <span>london@zeus.capital</span>
                </div>
              </div>
            </Card>

            <Card variant="flat" className="p-lg bg-white border border-[rgba(0,0,0,0.04)] rounded-[21px] flex flex-col gap-md text-left">
              <h3 className="text-[18px] font-semibold text-black tracking-tight border-b border-[rgba(0,0,0,0.04)] pb-xs">
                Reykjavik Hashing Array
              </h3>
              <div className="flex flex-col gap-sm text-[13px] font-medium text-[rgba(0,0,0,0.6)]">
                <div className="flex items-start gap-xs">
                  <MapPin className="w-4 h-4 text-[#8B7CFF] shrink-0 mt-0.5" />
                  <span>Katrínartún 4, 105 Reykjavík, Iceland</span>
                </div>
                <div className="flex items-center gap-xs">
                  <Mail className="w-4 h-4 text-[#8B7CFF]" />
                  <span>iceland@zeus.capital</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Form (7 cols) */}
          <Card variant="flat" className="lg:col-span-7 p-lg bg-white border border-[rgba(0,0,0,0.04)] rounded-[21px] text-left">
            <h3 className="text-[18px] font-semibold text-black tracking-tight border-b border-[rgba(0,0,0,0.04)] pb-xs mb-md">
              Send Support Query
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <Label htmlFor="fullname" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="rounded-[13px] border-[rgba(0,0,0,0.08)] bg-transparent text-sm h-10 placeholder-zinc-400 focus:border-[#8B7CFF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <Label htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="rounded-[13px] border-[rgba(0,0,0,0.08)] bg-transparent text-sm h-10 placeholder-zinc-400 focus:border-[#8B7CFF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <Label htmlFor="message" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Support message
                </Label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="How can our wealth managers help you today?"
                  className="rounded-[13px] border border-[rgba(0,0,0,0.08)] bg-transparent text-sm p-3 text-black placeholder-zinc-400 focus:outline-none focus:border-[#8B7CFF] resize-none font-sans transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#2B2644] hover:bg-[#3d375d] text-white text-[13px] font-semibold h-10 rounded-[12px] px-lg flex items-center justify-center gap-xs ml-auto transition-colors cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}
