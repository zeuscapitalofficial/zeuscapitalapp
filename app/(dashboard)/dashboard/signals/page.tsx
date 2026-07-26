"use client";

import {
  Activity,
  AlertCircle,
  Award,
  Compass,
  TrendingUp,
} from "lucide-react";
import { DashboardAreaChart } from "@/components/charts/dashboard-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const signals = [
  {
    id: "sig-101",
    pair: "BTC/USD",
    action: "BUY (LONG)",
    entryRange: "$68,200 - $68,500",
    tp1: "$69,800",
    tp2: "$71,500",
    sl: "$67,100",
    timeframe: "4H",
    strength: "92%",
    status: "active",
    published: "10 mins ago",
    rationale:
      "Ascending triangle breakout on 4H chart backed by strong volume profile and cooling funding rates.",
  },
  {
    id: "sig-102",
    pair: "ETH/USD",
    action: "HOLD (WAIT)",
    entryRange: "N/A",
    tp1: "N/A",
    tp2: "N/A",
    sl: "N/A",
    timeframe: "1D",
    strength: "54%",
    status: "pending",
    published: "2 hours ago",
    rationale:
      "Price consolidating between key exponential moving averages ($3,400 - $3,500). Wait for clear directional signal.",
  },
  {
    id: "sig-103",
    pair: "SOL/USD",
    action: "SELL (SHORT)",
    entryRange: "$144.50 - $146.00",
    tp1: "$138.00",
    tp2: "$132.00",
    sl: "$149.20",
    timeframe: "1H",
    strength: "78%",
    status: "active",
    published: "4 hours ago",
    rationale:
      "Bearish divergence on RSI under key psychological resistance at $148. Expected pullback to local support levels.",
  },
];

const performanceData = [
  { label: "Feb", value: 120 },
  { label: "Mar", value: 180 },
  { label: "Apr", value: 240 },
  { label: "May", value: 220 },
  { label: "Jun", value: 310 },
  { label: "Jul", value: 342.8 },
];

export default function SignalsPage() {
  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
            Market Intelligence
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            Trading Signals
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium">
            Real-time algorithmic trading triggers and qualitative technical
            rationale verified by our analysts.
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant="outline"
            className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
          >
            Signals Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <Card
          variant="flat"
          className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Average Win Rate
          </span>
          <div className="flex flex-col">
            <span className="text-[36px] font-semibold tracking-[-0.02em] text-[#22C55E]">
              84.2%
            </span>
            <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-medium mt-1">
              Calculated over past 90 days
            </span>
          </div>
        </Card>
        <Card
          variant="flat"
          className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Cumulative Profit
          </span>
          <div className="flex flex-col">
            <span className="text-[36px] font-semibold tracking-[-0.02em]">
              +342.8%
            </span>
            <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-medium mt-1">
              Compounded net returns curve
            </span>
          </div>
        </Card>
        <Card
          variant="flat"
          className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Active Signals
          </span>
          <div className="flex flex-col">
            <span className="text-[36px] font-semibold tracking-[-0.02em]">
              2 Live
            </span>
            <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-medium mt-1">
              1 signal pending breakout
            </span>
          </div>
        </Card>
      </div>

      {/* Grid Layout: Active Signals and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        {/* Signal Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          <h3 className="text-[18px] font-semibold text-white">
            Active Signal Feeds
          </h3>
          <div className="flex flex-col gap-4">
            {signals.map((sig) => (
              <Card
                key={sig.id}
                className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
              >
                <div className="flex justify-between items-start pb-md border-b border-[rgba(255,255,255,0.04)]">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
                      {sig.id} &bull; Timeframe {sig.timeframe}
                    </span>
                    <span className="text-[20px] font-semibold mt-1 text-white">
                      {sig.pair}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-[12px] text-[12px] font-semibold ${
                      sig.action.startsWith("BUY")
                        ? "bg-green-500/10 text-green-400"
                        : sig.action.startsWith("SELL")
                          ? "bg-red-500/10 text-red-400"
                          : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.48)]"
                    }`}
                  >
                    {sig.action}
                  </span>
                </div>

                {sig.status === "active" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-md text-[13px] font-medium">
                    <div className="flex flex-col">
                      <span className="text-[rgba(255,255,255,0.48)] mb-1">
                        Entry Range
                      </span>
                      <span className="text-white font-semibold">
                        {sig.entryRange}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[rgba(255,255,255,0.48)] mb-1">
                        Take Profit 1
                      </span>
                      <span className="text-[#22C55E] font-semibold">
                        {sig.tp1}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[rgba(255,255,255,0.48)] mb-1">
                        Take Profit 2
                      </span>
                      <span className="text-[#22C55E] font-semibold">
                        {sig.tp2}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[rgba(255,255,255,0.48)] mb-1">
                        Stop Loss
                      </span>
                      <span className="text-[#EF4444] font-semibold">
                        {sig.sl}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[14px] p-md text-[13px] text-[rgba(255,255,255,0.48)] flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                    Market is currently sideways. Avoid opening entries.
                    Standing by for breakout confirmations.
                  </div>
                )}

                <div className="text-[13px] font-medium text-[rgba(255,255,255,0.72)] bg-[#09090B] p-md rounded-[14px] border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[rgba(255,255,255,0.48)] block text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Rationale
                  </span>
                  {sig.rationale}
                </div>

                <div className="flex justify-between items-center text-[11px] text-[rgba(255,255,255,0.48)] font-semibold">
                  <span className="flex items-center gap-xs">
                    <Compass className="w-3.5 h-3.5 text-[#8B7CFF]" />{" "}
                    Probability Strength: {sig.strength}
                  </span>
                  <span>Published {sig.published}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Chart (5 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-5 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between gap-lg"
        >
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">
              Historical Yield Curve
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Compounded monthly signal returns (%)
            </p>
          </div>
          <div className="h-[200px] w-full">
            <DashboardAreaChart
              data={performanceData}
              valueType="number"
              strokeColor="#8B7CFF"
            />
          </div>
          <div className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[16px] flex items-center gap-sm">
            <Award className="w-8 h-8 text-yellow-500 shrink-0" />
            <div className="flex flex-col text-[12px] font-semibold">
              <span className="text-white">Ranked Tier-1 Global Alpha</span>
              <span className="text-[rgba(255,255,255,0.48)]">
                Audited signal history has a +342.8% total yield.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
