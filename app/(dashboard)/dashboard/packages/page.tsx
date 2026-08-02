"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { DepositDialog } from "@/components/dashboard/deposit-dialog";

const miningPackages = [
  {
    id: "starter",
    name: "BTC Micro Rig",
    tagline: "Essential Entry for Beginners",
    hashrate: "25 TH/s",
    dailyYield: "~$3.80 / day",
    estBtcMonth: "0.0016 BTC",
    priceMonthly: 49,
    priceAnnually: 39,
    isPopular: false,
    isCurrent: true,
    features: [
      "Dedicated BTC Antminer Allocation",
      "Automatic Daily Wallet Payouts",
      "Standard Pool Hashrate Priority",
      "Manual Signal Access Only",
      "99.2% Uptime Guarantee",
    ],
    lockedPerks: ["Auto-Bot Execution (Pro+)", "Zero Host Maintenance Fees"],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Hashrate Booster",
    tagline: "Accelerated BTC Yield & Bot Perks",
    hashrate: "110 TH/s",
    dailyYield: "~$18.50 / day",
    estBtcMonth: "0.0078 BTC",
    priceMonthly: 199,
    priceAnnually: 159,
    isPopular: true,
    isCurrent: false,
    features: [
      "4.4x Faster BTC Mining Speed",
      "Zero Host Maintenance Fees",
      "Includes 1-Click Bot Trading License",
      "Real-Time Live Signal Execution",
      "99.9% High-Yield Pool Priority",
      "Instant Daily Auto-Withdrawals",
    ],
    lockedPerks: [],
    buttonText: "Upgrade to Booster",
    buttonVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "ASIC Cluster Vault",
    tagline: "Maximum BTC Production Fleet",
    hashrate: "350 TH/s",
    dailyYield: "~$62.00 / day",
    estBtcMonth: "0.0255 BTC",
    priceMonthly: 599,
    priceAnnually: 479,
    isPopular: false,
    isCurrent: false,
    features: [
      "14x Hashrate Power Allocation",
      "Full VIP Bot Trading Suite (Uncapped)",
      "Institutional VIP Alpha Signals Access",
      "Dedicated Geothermal Data Center Slot",
      "Zero Deposit & Withdrawal Fees",
      "1-on-1 Account Strategist",
    ],
    lockedPerks: [],
    buttonText: "Purchase Cluster",
    buttonVariant: "outline" as const,
  },
];

export default function PackagesPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const [selectedPkg, setSelectedPkg] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handleSelectPackage = (name: string, price: number) => {
    setSelectedPkg({ name, price });
    setIsPurchaseDialogOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-lg select-none font-sans text-foreground min-h-screen pb-xl">
        {/* Header Section */}
        <div className="flex flex-col gap-sm pb-lg border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-foreground leading-tight">
                Bitcoin Mining Packages
              </h1>
              <p className="text-muted-foreground text-[15px] max-w-120 mt-1">
                Start mining BTC instantly. Upgrade your rig package to scale
                your daily hash yield and unlock automated Bot Trading perks.
              </p>
            </div>

            {/* Annual Billing Toggle */}
            <div className="flex items-center gap-sm bg-card p-1.5 rounded-full border border-border">
              <Label
                htmlFor="billing-toggle"
                className={`text-xs font-medium px-2 cursor-pointer ${!isAnnual ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <Label
                htmlFor="billing-toggle"
                className={`text-xs font-medium px-2 cursor-pointer flex items-center gap-1 ${isAnnual ? "text-foreground font-semibold" : "text-muted-foreground"}`}
              >
                Annual
                <Badge
                  variant="default"
                  className="text-[10px] py-0 px-1.5 h-4 bg-emerald-500/15 text-emerald-500 border-none font-bold"
                >
                  Save 20%
                </Badge>
              </Label>
            </div>
          </div>
        </div>

        {/* Current Free Account Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 rounded-full bg-accent-foreground/10 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-xs">
                    <span className="font-semibold text-foreground text-sm">
                      Active Account Status:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[11px] font-semibold"
                    >
                      Starter Tier (Active)
                    </Badge>
                  </div>
                  <div className="flex items-center gap-md text-xs text-muted-foreground">
                    <span>
                      Current Speed:{" "}
                      <strong className="text-foreground font-semibold">
                        25 TH/s
                      </strong>
                    </span>
                    <span>
                      Est. Yield:{" "}
                      <strong className="text-emerald-500 font-semibold">
                        ~$3.80/day
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-muted-foreground">
                    Account Hashrate Level
                  </span>
                  <span className="text-accent-foreground">Tier 1 / 3</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
            </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-stretch">
          {miningPackages.map((pkg) => {
            const price = isAnnual ? pkg.priceAnnually : pkg.priceMonthly;
            return (
              <Card
                key={pkg.id}
                className={`relative flex flex-col justify-between p-lg rounded-3xl border transition-all duration-200 ${
                  pkg.isPopular
                    ? "bg-card border-accent-foreground/50 shadow-lg shadow-accent-foreground/5"
                    : "bg-card border-border"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent-foreground text-accent font-semibold text-[11px] px-3 py-0.5 rounded-full shadow-sm">
                      Most Popular & Scalable
                    </Badge>
                  </div>
                )}

                <div>
                  {/* Header */}
                  <CardHeader className="p-0 gap-xs">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-semibold text-foreground">
                        {pkg.name}
                      </CardTitle>
                      {pkg.isCurrent && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      {pkg.tagline}
                    </CardDescription>
                  </CardHeader>

                  {/* Price Display */}
                  <div className="my-md py-md border-y border-border flex flex-col gap-xs">
                    <div className="flex items-baseline gap-xs">
                      <span className="text-3xl font-bold tracking-tight text-foreground">
                        ${price}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        / month
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-muted-foreground font-medium">
                        Hashrate Power:
                      </span>
                      <Badge
                        variant="outline"
                        className="font-bold text-accent-foreground bg-accent-foreground/5 border-accent-foreground/20"
                      >
                        {pkg.hashrate}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Est. Daily Income:
                      </span>
                      <span className="font-semibold text-emerald-500">
                        {pkg.dailyYield}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <CardContent className="p-0 flex flex-col gap-xs">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Included Benefits
                    </span>
                    {pkg.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-xs text-xs text-foreground font-medium"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-emerald-500 stroke-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}

                    {pkg.lockedPerks.length > 0 && (
                      <div className="mt-xs pt-xs border-t border-border/50 flex flex-col gap-xs opacity-60">
                        {pkg.lockedPerks.map((perk, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-xs text-xs text-muted-foreground line-through"
                          >
                            <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>

                {/* Footer / CTA */}
                <CardFooter className="p-0 mt-lg">
                  {pkg.isCurrent ? (
                    <Button
                      variant={pkg.buttonVariant}
                      className="w-full h-11 rounded-full font-semibold text-xs gap-xs"
                      disabled
                    >
                      {pkg.buttonText}
                    </Button>
                  ) : (
                    <Button
                      variant={pkg.buttonVariant}
                      onClick={() => handleSelectPackage(pkg.name, price)}
                      className="w-full h-11 rounded-full font-semibold text-xs gap-xs cursor-pointer"
                    >
                      <span>{pkg.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* In-place Purchase Deposit Dialog */}
        <DepositDialog
          open={isPurchaseDialogOpen}
          onOpenChange={setIsPurchaseDialogOpen}
          initialAmount={selectedPkg?.price}
          isAmountDisabled={true}
          customType="PURCHASE"
          itemTitle={selectedPkg?.name}
        />
      </div>
    </TooltipProvider>
  );
}
