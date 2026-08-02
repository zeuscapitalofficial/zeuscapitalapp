"use client";

import { useState } from "react";
import {
  Lock,
  Zap,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Sparkles,
  Shield,
  Clock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DepositDialog } from "@/components/dashboard/deposit-dialog";

const signalTiers = [
  {
    id: "free",
    name: "Standard Signal Feed",
    price: 0,
    priceDisplay: "$0",
    period: "Free Tier",
    badge: "Current Plan",
    description:
      "Basic delayed signals for new accounts. Manual trade execution required.",
    signalDelay: "24-Hour Delay",
    winRate: "65% Avg Win Rate",
    supportedAssets: "BTC/USD Only",
    botExecution: false,
    stopLossTargets: false,
    vipCommunity: false,
    cta: "Default Plan",
    variant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro Alpha Signal Feed",
    price: 79,
    priceDisplay: "$79",
    period: "per month",
    badge: "Recommended for Traders",
    description:
      "Instant real-time algorithmic entry/exit signals with exact Take Profit levels.",
    signalDelay: "Instant (Real-Time)",
    winRate: "84.2% Audited Win Rate",
    supportedAssets: "Top 20 Crypto Pairs",
    botExecution: true,
    stopLossTargets: true,
    vipCommunity: false,
    cta: "Unlock Pro Signals",
    variant: "default" as const,
  },
  {
    id: "vip",
    name: "VIP Institutional Pass",
    price: 199,
    priceDisplay: "$199",
    period: "per month",
    badge: "Maximum Yield & Automation",
    description:
      "Full automated 1-Click Bot copy trading, high-leverage altcoin gems & 1-on-1 analyst calls.",
    signalDelay: "Instant + Early Trigger",
    winRate: "91.8% High Conviction",
    supportedAssets: "All Crypto + Futures Gems",
    botExecution: true,
    stopLossTargets: true,
    vipCommunity: true,
    cta: "Get VIP Access",
    variant: "outline" as const,
  },
];

const sampleSignals = [
  {
    id: "SIG-802",
    pair: "BTC/USD",
    type: "BUY (LONG)",
    entry: "$68,450",
    tp: "$71,200",
    sl: "$67,100",
    winRate: "92%",
    isLocked: false,
    status: "LIVE & ACTIVE",
  },
  {
    id: "SIG-803",
    pair: "ETH/USD",
    type: "BUY (LONG)",
    entry: "Upgrade to Pro to Reveal",
    tp: "Hidden",
    sl: "Hidden",
    winRate: "88%",
    isLocked: true,
    status: "PRO TIER ONLY",
  },
  {
    id: "SIG-804",
    pair: "SOL/USD",
    type: "BUY (LONG)",
    entry: "Upgrade to Pro to Reveal",
    tp: "Hidden",
    sl: "Hidden",
    winRate: "86%",
    isLocked: true,
    status: "PRO TIER ONLY",
  },
];

export default function SignalsPage() {
  const [activeTab, setActiveTab] = useState<"tiers" | "feed">("tiers");

  const [selectedSignal, setSelectedSignal] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handleSelectSignalTier = (name: string, price: number) => {
    if (price <= 0) return;
    setSelectedSignal({ name, price });
    setIsPurchaseDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-lg select-none font-sans text-foreground min-h-screen pb-xl max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md pb-lg border-b border-border/60">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-foreground leading-tight">
              AI Trading Signals & Alpha Feed
            </h1>
            <p className="text-muted-foreground text-[15px] max-w-120 mt-1">
              Access real-time quantitative trade setups verified by Zeus AI model scoring.
            </p>
          </div>

          <div className="flex gap-2 bg-muted p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab("tiers")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "tiers"
                  ? "bg-accent-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Signal Plans
            </button>
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "feed"
                  ? "bg-accent-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Live Signal Feed
            </button>
          </div>
        </div>

        {activeTab === "tiers" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-stretch mt-4">
            {signalTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative flex flex-col justify-between p-lg rounded-3xl border transition-all duration-200 ${
                  tier.id === "pro"
                    ? "bg-card border-accent-foreground/50 shadow-lg shadow-accent-foreground/5"
                    : "bg-card border-border"
                }`}
              >
                {tier.badge && tier.id !== "free" && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent-foreground text-accent font-semibold text-[11px] px-3 py-0.5 rounded-full">
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <div>
                  <CardHeader className="p-0 gap-xs">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {tier.name}
                      </CardTitle>
                      {tier.id === "free" && (
                        <Badge variant="secondary" className="text-[10px] font-semibold">
                          Active
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <div className="my-md py-md border-y border-border flex flex-col gap-xs">
                    <div className="flex items-baseline gap-xs">
                      <span className="text-3xl font-bold tracking-tight text-foreground">
                        {tier.priceDisplay}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {tier.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-xs mt-1 text-xs font-medium text-emerald-500">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{tier.winRate}</span>
                    </div>
                  </div>

                  <CardContent className="p-0 flex flex-col gap-sm">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">Signal Latency:</span>
                      <span className="font-semibold text-foreground">{tier.signalDelay}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">Pairs Covered:</span>
                      <span className="font-semibold text-foreground">{tier.supportedAssets}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">Bot Auto-Trade:</span>
                      {tier.botExecution ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted-foreground font-medium">Stop-Loss & TP Targets:</span>
                      {tier.stopLossTargets ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-muted-foreground font-medium">VIP Telegram Channel:</span>
                      {tier.vipCommunity ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground/40" />
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-0 mt-lg">
                  {tier.id === "free" ? (
                    <Button
                      variant={tier.variant}
                      className="w-full h-11 rounded-full font-semibold text-xs gap-xs"
                      disabled
                    >
                      {tier.cta}
                    </Button>
                  ) : (
                    <Button
                      variant={tier.variant}
                      onClick={() => handleSelectSignalTier(tier.name, tier.price)}
                      className={`w-full h-11 rounded-full font-semibold text-xs gap-xs cursor-pointer ${
                        tier.id === "pro"
                          ? "bg-accent-foreground hover:bg-accent-foreground/90 text-accent shadow-md"
                          : "hover:bg-accent-foreground hover:text-accent"
                      }`}
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "feed" && (
          <div className="space-y-6 mt-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs text-foreground font-medium">
                  You are viewing the <strong className="font-semibold">Free Standard Feed</strong> (24h Delayed). Upgrade to Pro to view real-time entry targets.
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => handleSelectSignalTier("Pro Alpha Signal Feed", 79)}
                className="h-8 text-xs font-semibold rounded-full bg-accent-foreground text-background cursor-pointer"
              >
                Upgrade Now
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {sampleSignals.map((sig) => (
                <Card key={sig.id} className={`p-md rounded-[20px] border ${sig.isLocked ? "bg-card/50 border-border opacity-90" : "bg-card border-border"}`}>
                  <div className="flex justify-between items-center pb-xs border-b border-border/50">
                    <div className="flex items-center gap-xs">
                      <span className="font-bold text-base text-foreground">{sig.pair}</span>
                      <Badge variant="outline" className="text-[10px]">{sig.id}</Badge>
                    </div>
                    <Badge variant={sig.isLocked ? "secondary" : "default"} className="text-[10px]">
                      {sig.status}
                    </Badge>
                  </div>

                  <div className="py-md flex flex-col gap-xs text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Action:</span>
                      <span className="font-semibold text-emerald-500">{sig.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entry Range:</span>
                      {sig.isLocked ? (
                        <span className="font-semibold text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500" /> Locked
                        </span>
                      ) : (
                        <span className="font-semibold text-foreground">{sig.entry}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Take Profit:</span>
                      {sig.isLocked ? (
                        <span className="font-semibold text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500" /> Locked
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-500">{sig.tp}</span>
                      )}
                    </div>
                  </div>

                  {sig.isLocked ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSelectSignalTier("Pro Alpha Signal Feed", 79)}
                      className="w-full h-9 rounded-full text-xs font-semibold gap-xs bg-accent-foreground text-background cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" /> Unlock Signal
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full h-9 rounded-full text-xs font-semibold">
                      View Details
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* In-place Purchase Deposit Dialog */}
        <DepositDialog
          open={isPurchaseDialogOpen}
          onOpenChange={setIsPurchaseDialogOpen}
          initialAmount={selectedSignal?.price}
          isAmountDisabled={true}
          customType="PURCHASE"
          itemTitle={selectedSignal?.name}
        />
      </div>
    </TooltipProvider>
  );
}
