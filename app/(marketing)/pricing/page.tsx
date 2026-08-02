"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, Cpu, Zap, CirclePercent } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Bronze Hashing",
    price: "$500",
    hashrate: "10 TH/s",
    duration: "1 Year",
    efficiency: "32 J/TH",
    multiplier: "1.1x Payout",
    features: [
      "Iceland Cooling Node Allocation",
      "Automatic Daily Yield Payouts",
      "Basic Platform Support",
      "Zero Maintenance Fees",
    ],
  },
  {
    name: "Silver Hashing",
    price: "$2,500",
    hashrate: "55 TH/s",
    duration: "1 Year",
    efficiency: "28 J/TH",
    multiplier: "1.25x Payout",
    featured: true,
    features: [
      "Iceland Cooling Node Allocation",
      "Automatic Daily Yield Payouts",
      "Priority Auditor Clearing",
      "24/7 Platform Support",
      "Zero Maintenance Fees",
    ],
  },
  {
    name: "Gold Hashing",
    price: "$7,500",
    hashrate: "180 TH/s",
    duration: "2 Years",
    efficiency: "24 J/TH",
    multiplier: "1.5x Payout",
    features: [
      "Iceland Cooling Node Allocation",
      "Automatic Daily Yield Payouts",
      "Priority Auditor Clearing",
      "Dedicated Client Manager",
      "Zero Maintenance Fees",
    ],
  },
];

export default function PricingPage() {
  const [hashrate, setHashrate] = useState(50); // slider state in TH/s

  // Yield Math constants
  const costPerTh = 45; // $45 per TH/s
  const dailyRevenuePerTh = 0.12; // $0.12 daily revenue per TH/s

  const calculatedCost = hashrate * costPerTh;
  const dailyYield = hashrate * dailyRevenuePerTh;
  const weeklyYield = dailyYield * 7;
  const annualYield = dailyYield * 365;

  return (
    <div className="bg-[#F5F5F5] min-h-screen text-[#000000] font-sans pt-[120px] pb-3xl select-none">
      <div className="max-w-[88rem] mx-auto px-lg flex flex-col gap-2xl">
        {/* Title Block */}
        <div className="flex flex-col items-center text-center gap-xs max-w-[800px] mx-auto">
          <span className="text-xs font-semibold text-[#8B7CFF] uppercase tracking-wider">
            Clear Yield Structures
          </span>
          <h1 className="text-[48px] md:text-[56px] font-semibold tracking-[-0.03em] leading-tight mt-xs text-black">
            Cloud Mining Plans
          </h1>
          <p className="text-[18px] text-[rgba(0,0,0,0.55)] font-medium leading-relaxed">
            Choose a pre-configured hashing package, or custom lease hashrate
            power using the interactive calculator.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md items-stretch mt-sm">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              variant="flat"
              className={`p-lg bg-white border rounded-[21px] flex flex-col justify-between gap-lg relative transition-all hover:shadow-sm ${
                plan.featured
                  ? "border-[#8B7CFF]/40 ring-1 ring-[#8B7CFF]/20"
                  : "border-[rgba(0,0,0,0.04)]"
              }`}
            >
              {plan.featured && (
                <span className="absolute top-4 right-4 bg-[#8B7CFF]/10 text-[#8B7CFF] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[99px]">
                  Most Popular
                </span>
              )}

              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-xs mt-1">
                    <span className="text-[36px] font-semibold text-black tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-[13px] text-zinc-500 font-medium">
                      / contract
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-sm py-md border-y border-[rgba(0,0,0,0.04)] text-[12px] font-semibold text-zinc-400">
                  <div className="flex flex-col">
                    <span className="uppercase text-[9px] tracking-wider">
                      Capacity
                    </span>
                    <span className="text-black mt-0.5 font-sans font-medium text-sm flex items-center gap-xs">
                      <Cpu className="w-3.5 h-3.5 text-zinc-400" />{" "}
                      {plan.hashrate}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="uppercase text-[9px] tracking-wider">
                      Efficiency
                    </span>
                    <span className="text-black mt-0.5 font-sans font-medium text-sm flex items-center gap-xs">
                      <Zap className="w-3.5 h-3.5 text-zinc-400" />{" "}
                      {plan.efficiency}
                    </span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="uppercase text-[9px] tracking-wider">
                      Multiplier
                    </span>
                    <span className="text-[#8B7CFF] mt-0.5 font-sans font-semibold text-sm flex items-center gap-xs">
                      <CirclePercent className="w-3.5 h-3.5 text-[#8B7CFF]" />{" "}
                      {plan.multiplier}
                    </span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="uppercase text-[9px] tracking-wider">
                      Duration
                    </span>
                    <span className="text-black mt-0.5 font-sans font-medium text-sm">
                      {plan.duration}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-sm mt-sm">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-xs text-[13px] font-medium text-[rgba(0,0,0,0.6)]"
                    >
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register" className="w-full mt-md">
                <Button
                  variant={plan.featured ? "default" : "secondary"}
                  className="w-full h-10 justify-center"
                >
                  Lease Hashing Power
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Dynamic Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-center bg-white border border-[rgba(0,0,0,0.04)] rounded-[34px] p-xl mt-xl w-full">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-lg text-left">
            <div className="flex flex-col gap-xs">
              <span className="text-xs font-semibold text-[#8B7CFF] uppercase tracking-wider">
                Custom Hashing Lease
              </span>
              <h2 className="text-[28px] md:text-[32px] font-semibold text-black tracking-tight">
                Interactive Hashing Calculator
              </h2>
              <p className="text-[14px] text-[rgba(0,0,0,0.55)] font-medium max-w-[500px]">
                Adjust the slider parameters to lease a customized hardware
                layout. We instantly calculate the setup costs and projected
                contract returns.
              </p>
            </div>

            <div className="flex flex-col gap-sm mt-md">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-zinc-500">Lease Capacity:</span>
                <span className="text-black text-md font-bold">
                  {hashrate} TH/s
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={hashrate}
                onChange={(e) => setHashrate(parseInt(e.target.value))}
                className="w-full accent-[#8B7CFF] h-1.5 bg-zinc-100 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-zinc-400 font-semibold self-end">
                Capacity limit: 500 TH/s
              </span>
            </div>
          </div>

          {/* Calculator Yield Output Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-md bg-[#F5F5F5] border border-[rgba(0,0,0,0.04)] p-lg rounded-[21px]">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider text-left border-b border-[rgba(0,0,0,0.06)] pb-xs">
              Yield Projections (USD)
            </h3>

            <div className="flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500">
                  Daily Return
                </span>
                <span className="text-sm font-bold text-black">
                  ${dailyYield.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500">
                  Weekly Return
                </span>
                <span className="text-sm font-bold text-black">
                  ${weeklyYield.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500">
                  Annual Return
                </span>
                <span className="text-sm font-bold text-black">
                  ${annualYield.toFixed(2)}
                </span>
              </div>
              <div className="h-[1px] bg-[rgba(0,0,0,0.06)] my-xs" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">
                  Contract Cost
                </span>
                <span className="text-md font-bold text-[#8B7CFF]">
                  ${calculatedCost.toLocaleString()}
                </span>
              </div>
            </div>

            <Link href="/register" className="w-full mt-sm">
              <Button variant="default" className="w-full h-10 justify-center">
                Initiate Contract Lease
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
