"use client";

import { useState } from "react";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  ArrowUpRight,
  Info,
  Clock,
  Sparkles,
  Coins,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DepositDialog } from "@/components/dashboard/deposit-dialog";

interface Vault {
  id: string;
  name: string;
  ticker: string;
  baseApy: number;
  tvl: string;
  lockupDays: number;
  riskLevel: string;
  strategy: string;
  popular?: boolean;
}

const VAULTS: Vault[] = [
  {
    id: "usdc-prime",
    name: "USDC Prime Yield Vault",
    ticker: "USDC",
    baseApy: 18.2,
    tvl: "$124.8M",
    lockupDays: 90,
    riskLevel: "Low Risk",
    strategy: "Short-term Treasuries & Prime lending arbitrage.",
    popular: true,
  },
  {
    id: "eth-validator",
    name: "Ethereum Staking Vault",
    ticker: "ETH",
    baseApy: 14.5,
    tvl: "$78.1M",
    lockupDays: 0,
    riskLevel: "Liquid",
    strategy: "Distributed ETH validator nodes + MEV yield.",
  },
  {
    id: "btc-delta",
    name: "Bitcoin Yield Vault",
    ticker: "BTC",
    baseApy: 11.2,
    tvl: "$42.5M",
    lockupDays: 30,
    riskLevel: "Low Risk",
    strategy: "Delta-neutral basis trading & options strategy.",
  },
  {
    id: "sol-liquid",
    name: "Solana Staking Vault",
    ticker: "SOL",
    baseApy: 21.6,
    tvl: "$31.9M",
    lockupDays: 60,
    riskLevel: "Medium Risk",
    strategy: "Jito-SOL liquid staking & flash-loan yield.",
  },
];

const INITIAL_STAKES = [
  {
    id: "stk-001",
    vaultName: "USDC Prime Yield Vault",
    asset: "USDC",
    amountStaked: 50000.0,
    apy: 22.4,
    totalEarned: 1840.5,
    daysRemaining: 64,
    autoCompound: true,
  },
  {
    id: "stk-002",
    vaultName: "Ethereum Staking Vault",
    asset: "ETH",
    amountStaked: 35200.0,
    apy: 14.5,
    totalEarned: 1120.0,
    daysRemaining: 0,
    autoCompound: true,
  },
  {
    id: "stk-003",
    vaultName: "Bitcoin Yield Vault",
    asset: "BTC",
    amountStaked: 48050.0,
    apy: 15.4,
    totalEarned: 1410.8,
    daysRemaining: 12,
    autoCompound: false,
  },
];

export default function StakingPage() {
  const [selectedVaultId, setSelectedVaultId] = useState<string>("usdc-prime");
  const [depositAmount, setDepositAmount] = useState<number[]>([25000]);
  const [isLockupBoosted, setIsLockupBoosted] = useState<boolean>(true);
  const [activeStakes, setActiveStakes] = useState(INITIAL_STAKES);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const currentVault = VAULTS.find((v) => v.id === selectedVaultId) || VAULTS[0];
  const lockupBoostApy = 4.2;
  const effectiveApy = isLockupBoosted
    ? currentVault.baseApy + lockupBoostApy
    : currentVault.baseApy;

  const amountVal = depositAmount[0] || 25000;
  const annualReturn = (amountVal * effectiveApy) / 100;
  const monthlyReturn = annualReturn / 12;
  const dailyReturn = annualReturn / 365;
  const projectedBalanceIn1Yr = amountVal + annualReturn;

  const handleUnstake = (id: string) => {
    setActiveStakes((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleAutoCompound = (id: string) => {
    setActiveStakes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, autoCompound: !s.autoCompound } : s))
    );
  };

  return (
    <div className="flex flex-col gap-6 font-sans pb-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Staking & Yield Vaults
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Automated institutional yield strategies and liquid compounding vaults.
          </p>
        </div>
        <Button
          onClick={() => setIsDepositOpen(true)}
          className="bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-9 gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Coins className="size-4" />
          Deposit & Stake
        </Button>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-1.5">
            <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Staked Value
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              $133,250.00
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-500 font-medium flex items-center gap-1 pt-0">
            <TrendingUp className="size-3.5" />
            +12.4% yield performance
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-1.5">
            <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Yield Earned
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-500">
              +$4,371.30
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground font-medium flex items-center gap-1 pt-0">
            <Coins className="size-3.5 text-accent-foreground" />
            Compounded continuously
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-1.5">
            <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Average Portfolio APY
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              17.43%
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-500 font-medium flex items-center gap-1 pt-0">
            <Zap className="size-3.5" />
            +4.2% Lockup Boost
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-1.5">
            <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Active Positions
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {activeStakes.length} Vaults
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground font-medium flex items-center gap-1 pt-0">
            <ShieldCheck className="size-3.5 text-accent-foreground" />
            Fully Insured & Audited
          </CardContent>
        </Card>
      </div>

      {/* Yield Vault Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Available Vault Strategies</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VAULTS.map((vault) => {
            const isSelected = vault.id === selectedVaultId;
            return (
              <Card
                key={vault.id}
                className={`relative flex flex-col justify-between transition-all border ${
                  isSelected
                    ? "border-accent-foreground bg-accent-foreground/5 ring-1 ring-accent-foreground/30"
                    : "border-border bg-card hover:border-accent-foreground/50"
                }`}
              >
                {vault.popular && (
                  <div className="absolute -top-2.5 right-3">
                    <Badge className="bg-accent-foreground text-background text-[9px] uppercase font-bold px-2 py-0">
                      Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {vault.ticker}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {vault.riskLevel}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold mt-2 text-foreground">
                    {vault.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 text-muted-foreground mt-0.5">
                    {vault.strategy}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-2">
                  <div className="bg-muted/40 p-2.5 rounded-lg flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground font-medium">APY Yield</span>
                    <span className="text-xl font-extrabold text-emerald-500">
                      {vault.baseApy}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>TVL</span>
                    <span className="font-semibold text-foreground">{vault.tvl}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Lockup</span>
                    <span className="font-semibold text-foreground">
                      {vault.lockupDays === 0 ? "Flexible" : `${vault.lockupDays} Days`}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full text-xs font-semibold h-8 cursor-pointer ${
                      isSelected
                        ? "bg-accent-foreground text-background hover:bg-accent-foreground/90"
                        : ""
                    }`}
                    onClick={() => setSelectedVaultId(vault.id)}
                  >
                    {isSelected ? "Selected" : "Select Vault"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* APY & Yield Calculator */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 pb-3 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Yield Calculator — {currentVault.name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Simulate potential yield growth based on deposit amount and lockup duration.
              </CardDescription>
            </div>

            {/* Quick Vault Selector */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
              {VAULTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVaultId(v.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    selectedVaultId === v.id
                      ? "bg-card text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v.ticker}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Inputs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Deposit Amount (USD)
                  </Label>
                  <span className="text-lg font-bold font-mono text-foreground">
                    ${amountVal.toLocaleString()}
                  </span>
                </div>

                <Slider
                  value={depositAmount}
                  onValueChange={(vals) => setDepositAmount(vals as number[])}
                  min={1000}
                  max={250000}
                  step={1000}
                  className="py-1"
                />

                <div className="flex gap-2">
                  {[5000, 10000, 50000, 100000].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="xs"
                      className="text-xs font-mono h-7 px-2"
                      onClick={() => setDepositAmount([preset])}
                    >
                      ${preset >= 1000 ? `${preset / 1000}k` : preset}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Lockup Switch */}
              <div className="bg-muted/40 p-3 rounded-lg border border-border flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="lockup-boost-toggle" className="text-xs font-bold text-foreground cursor-pointer">
                      Enable 90-Day Lockup Commitment
                    </Label>
                    <Badge className="bg-emerald-500/15 text-emerald-500 border-none text-[10px]">
                      +{lockupBoostApy}% Boost
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Lock capital for 90 days to gain institutional yield boost.
                  </p>
                </div>
                <Switch
                  id="lockup-boost-toggle"
                  checked={isLockupBoosted}
                  onCheckedChange={(checked) => setIsLockupBoosted(checked)}
                />
              </div>
            </div>

            {/* Output Display */}
            <div className="lg:col-span-5 bg-muted/30 border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-xs font-medium text-muted-foreground">Effective APY</span>
                <span className="text-2xl font-extrabold text-emerald-500">
                  {effectiveApy.toFixed(1)}%
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Daily Yield</span>
                  <span className="font-mono font-bold text-foreground">+${dailyReturn.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Monthly Yield</span>
                  <span className="font-mono font-bold text-foreground">+${monthlyReturn.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-border/60 pt-1.5">
                  <span className="text-foreground">Projected 1-Yr Balance</span>
                  <span className="font-mono text-emerald-500">
                    ${projectedBalanceIn1Yr.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setIsDepositOpen(true)}
                className="w-full bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-9 gap-1 cursor-pointer"
              >
                Stake ${amountVal.toLocaleString()} into {currentVault.ticker} Vault <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Positions Table */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Active Vault Positions
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Overview of current active stakes and auto-compounding controls.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {activeStakes.length} Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="text-xs uppercase">Vault</TableHead>
                  <TableHead className="text-xs uppercase">Staked Amount</TableHead>
                  <TableHead className="text-xs uppercase">APY</TableHead>
                  <TableHead className="text-xs uppercase">Earned Yield</TableHead>
                  <TableHead className="text-xs uppercase">Lock Status</TableHead>
                  <TableHead className="text-xs uppercase">Auto-Compound</TableHead>
                  <TableHead className="text-xs uppercase text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeStakes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-xs">
                      No active stakes. Select a vault above to start earning yield.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeStakes.map((stake) => (
                    <TableRow key={stake.id} className="border-border hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium text-xs">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            {stake.asset}
                          </Badge>
                          <span className="text-foreground font-semibold">{stake.vaultName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-foreground">
                        ${stake.amountStaked.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-emerald-500">
                        {stake.apy}%
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-emerald-500">
                        +${stake.totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-xs">
                        {stake.daysRemaining > 0 ? (
                          <div className="flex items-center gap-1 text-amber-500 font-medium">
                            <Lock className="size-3.5" />
                            <span>{stake.daysRemaining} days left</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-emerald-500 font-medium">
                            <CheckCircle2 className="size-3.5" />
                            <span>Flexible</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          size="sm"
                          checked={stake.autoCompound}
                          onCheckedChange={() => handleToggleAutoCompound(stake.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          disabled={stake.daysRemaining > 0}
                          onClick={() => handleUnstake(stake.id)}
                          className="text-xs text-destructive hover:bg-destructive/10 disabled:opacity-40"
                        >
                          Unstake
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      <DepositDialog open={isDepositOpen} onOpenChange={setIsDepositOpen} />
    </div>
  );
}
