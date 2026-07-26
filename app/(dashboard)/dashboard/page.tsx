"use client";

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Copy,
  Cpu,
  DollarSign,
  Eye,
  EyeOff,
  Gift,
  HelpCircle,
  Layers,
  Package,
  Share2,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DashboardAreaChart,
  DashboardPieChart,
} from "@/components/charts/dashboard-chart";
import { MarketChartContainer } from "@/components/charts/market-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/lib/auth-client";

// Mock Data for Analytics Chart
const chartData = [
  { label: "Jan", value: 310000 },
  { label: "Feb", value: 325000 },
  { label: "Mar", value: 340000 },
  { label: "Apr", value: 335000 },
  { label: "May", value: 370000 },
  { label: "Jun", value: 395000 },
  { label: "Jul", value: 424912.8 },
];

// Mock Data for Asset Allocation
const allocationData = [
  { name: "Bitcoin (BTC)", value: 55, color: "#F7931A" },
  { name: "USD Halo (USDH)", value: 20, color: "#8B7CFF" },
  { name: "Ethereum (ETH)", value: 15, color: "#627EEA" },
  { name: "ASIC Power (TH/s)", value: 10, color: "#22C55E" },
];

// Mock Data for Transactions
const transactions = [
  {
    id: "tx-001",
    type: "payout",
    asset: "Bitcoin (BTC)",
    amount: "+0.0125 BTC",
    value: "+$854.20",
    status: "success",
    date: "July 5, 2026",
    icon: Cpu,
  },
  {
    id: "tx-002",
    type: "deposit",
    asset: "USD Halo (USDH)",
    amount: "+$5,000.00 USDH",
    value: "+$5,000.00",
    status: "success",
    date: "July 4, 2026",
    icon: ArrowDownLeft,
  },
  {
    id: "tx-003",
    type: "charge",
    asset: "ASIC Maintenance",
    amount: "-$45.00 USDH",
    value: "-$45.00",
    status: "success",
    date: "July 3, 2026",
    icon: ArrowUpRight,
  },
  {
    id: "tx-004",
    type: "yield",
    asset: "USD Halo Rewards",
    amount: "+$134.12 USDH",
    value: "+$134.12",
    status: "success",
    date: "July 1, 2026",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [showBalance, setShowBalance] = useState(true);
  const [coinsList, setCoinsList] = useState<any[]>([]);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchTopCoins() {
      try {
        setLoadingCoins(true);
        const res = await fetch("/api/market/top-coins");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (active) {
          setCoinsList(data);
        }
      } catch (err) {
        console.error("Failed to load top coins");
      } finally {
        if (active) {
          setLoadingCoins(false);
        }
      }
    }
    fetchTopCoins();
    return () => {
      active = false;
    };
  }, []);

  const handleCopyRef = () => {
    navigator.clipboard.writeText("https://zeus.capital/ref/zc-389f2a");
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const user = session?.user;

  // Format today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Investor"}
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium flex items-center gap-xs">
            <ShieldCheck className="w-4 h-4 text-[#8B7CFF]" />
            Your secure account is generating yield normally.
          </p>
        </div>
        <div className="flex gap-sm">
          <Badge variant="pending" className="text-[13px] font-semibold">
            Unverified
          </Badge>
        </div>
      </div>

      {/* Replicated Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        {/* Left Column: Account Balance Card */}
        <Card
          variant="flat"
          className="lg:col-span-5 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between gap-md min-h-[300px]"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-sm">
              <span className="p-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-[10px] text-[rgba(255,255,255,0.72)]">
                <Wallet className="w-4 h-4" />
              </span>
              <span className="text-[14px] font-semibold text-white">
                Account Balance
              </span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-[rgba(255,255,255,0.48)] hover:text-white transition-colors"
            >
              {showBalance ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Large Value */}
          <div className="flex flex-col gap-xs mt-sm">
            <span className="text-[36px] font-semibold tracking-[-0.03em] text-white leading-none">
              {showBalance ? "$635,919.50" : "••••••"}
            </span>
            <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Your current available balance
            </span>
          </div>

          <div className="h-[1px] bg-[rgba(255,255,255,0.06)] w-full my-xs" />

          {/* Sub-Section */}
          <div className="flex flex-col gap-xs">
            <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Available for Withdrawal
            </span>
            <span className="text-[18px] font-semibold text-white">
              {showBalance ? "$635,919.50" : "••••••"}
            </span>
            <span className="text-[11px] text-[rgba(255,255,255,0.36)] font-mono">
              Last updated: 5/7/2026, 1:34:48 AM
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-sm mt-sm">
            <Link href="/dashboard/deposit-withdraw" className="flex-1">
              <Button className="w-full bg-[#1D1D22] hover:bg-[#27272D] text-white text-[14px] font-semibold h-11 rounded-[14px] border border-[rgba(255,255,255,0.04)] flex flex-col items-center justify-center">
                <ArrowUpRight className="w-4 h-4 inline mr-1" />{" "}
                <span className="inline">Deposit</span>
              </Button>
            </Link>
            <Link href="/dashboard/deposit-withdraw" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-[rgba(255,255,255,0.08)] bg-transparent hover:bg-[rgba(255,255,255,0.02)] text-white text-[14px] font-semibold h-11 rounded-[14px] flex items-center justify-center"
              >
                <ArrowDownLeft className="w-4 h-4 inline mr-1" />{" "}
                <span className="inline">Withdraw</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Right Column: Grid of cards */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-md">
          {/* Top row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md flex-1">
            {/* Total Profit */}
            <Card
              variant="flat"
              className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm justify-between min-h-[140px] hover:border-[rgba(255,255,255,0.12)] transition-all"
            >
              <div className="flex items-center gap-xs text-[11px] font-semibold text-[#22C55E] tracking-wider uppercase">
                <TrendingUp className="w-4 h-4" /> Total Profit
              </div>
              <span className="text-[28px] font-semibold text-white tracking-[-0.02em] mt-2 block">
                {showBalance ? "$0" : "••••••"}
              </span>
              <span className="flex items-center gap-xs text-[12px] text-[#22C55E] font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> Lifetime earnings
              </span>
            </Card>

            {/* Total Deposit */}
            <Card
              variant="flat"
              className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm justify-between min-h-[140px] hover:border-[rgba(255,255,255,0.12)] transition-all"
            >
              <div className="flex items-center gap-xs text-[11px] font-semibold text-[#8B7CFF] tracking-wider uppercase">
                <DollarSign className="w-4 h-4" /> Total Deposit
              </div>
              <span className="text-[28px] font-semibold text-white tracking-[-0.02em] mt-2 block">
                {showBalance ? "$530,000" : "••••••"}
              </span>
              <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-semibold mt-1">
                All time
              </span>
            </Card>
          </div>

          {/* Bottom Bonus card */}
          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-sm justify-between min-h-[140px] hover:border-[rgba(255,255,255,0.12)] transition-all"
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-xs text-[11px] font-semibold text-purple-400 tracking-wider uppercase">
                <Gift className="w-4 h-4" /> Bonus
              </div>
              <span className="text-[12px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                Rewards & Promotions
              </span>
            </div>
            <span className="text-[28px] font-semibold text-white tracking-[-0.02em] mt-2 block">
              {showBalance ? "$0" : "••••••"}
            </span>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        {/* Market Analytics CoinGecko Chart (8 cols) */}
        <div className="lg:col-span-8 flex">
          <MarketChartContainer />
        </div>

        {/* Quick Actions Hub (4 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-4 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between gap-md"
        >
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">
              Quick Actions
            </h3>
          </div>

          <div className="flex flex-col gap-3 my-xs w-full">
            <Link href="/dashboard/deposit-withdraw">
              <button className="w-full text-left p-md bg-[#09090B] hover:bg-[#1D1D22] border border-[rgba(255,255,255,0.04)] rounded-[14px] flex items-center justify-between transition-all group">
                <div className="flex items-center gap-md">
                  <span className="p-2 bg-[#111114] rounded-[10px] text-[#8B7CFF] group-hover:text-white transition-colors">
                    <ArrowLeftRight className="w-4 h-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-white">
                      Deposit & Withdraw
                    </span>
                    <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-medium">
                      Fund account or withdraw yield
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.2)] group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </button>
            </Link>

            <Link href="/dashboard/kyc">
              <button className="w-full text-left p-md bg-[#09090B] hover:bg-[#1D1D22] border border-[rgba(255,255,255,0.04)] rounded-[14px] flex items-center justify-between transition-all group">
                <div className="flex items-center gap-md">
                  <span className="p-2 bg-[#111114] rounded-[10px] text-amber-400 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-white">
                      AML & KYC Verification
                    </span>
                    <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-medium">
                      Verify profile to lift limits
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.2)] group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </button>
            </Link>

            <Link href="/dashboard/help">
              <button className="w-full text-left p-md bg-[#09090B] hover:bg-[#1D1D22] border border-[rgba(255,255,255,0.04)] rounded-[14px] flex items-center justify-between transition-all group">
                <div className="flex items-center gap-md">
                  <span className="p-2 bg-[#111114] rounded-[10px] text-purple-400 group-hover:text-white transition-colors">
                    <HelpCircle className="w-4 h-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-white">
                      Help Desk
                    </span>
                    <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-medium">
                      Raise queries or check FAQs
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.2)] group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Replaced Transactions Table with Two Columns: Top Coins & Refer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        {/* Top Coins Card (8 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-8 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md h-[400px] overflow-hidden"
        >
          <div className="flex flex-col gap-xs shrink-0">
            <h3 className="text-[18px] font-semibold text-white">
              Top Cryptocurrency Indices
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Live market valuations via CoinGecko index rankings
            </p>
          </div>

          <ScrollArea className="flex-1 w-full overflow-hidden pr-2">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse select-none">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider h-[40px]">
                    <th className="py-2 pr-4">Asset</th>
                    <th className="py-2 px-4 text-right">Price</th>
                    <th className="py-2 px-4 text-right">24h Change</th>
                    <th className="py-2 pl-4 text-right">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingCoins
                    ? // Skeleton rows
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr
                          key={i}
                          className="border-b border-[rgba(255,255,255,0.04)] last:border-0 h-[56px] animate-pulse"
                        >
                          <td className="py-3 pr-4 flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.03)]" />
                            <div className="w-16 h-4 bg-[rgba(255,255,255,0.03)] rounded" />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="w-12 h-4 bg-[rgba(255,255,255,0.03)] rounded ml-auto" />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="w-10 h-4 bg-[rgba(255,255,255,0.03)] rounded ml-auto" />
                          </td>
                          <td className="py-3 pl-4 text-right">
                            <div className="w-20 h-4 bg-[rgba(255,255,255,0.03)] rounded ml-auto" />
                          </td>
                        </tr>
                      ))
                    : coinsList.map((coin) => {
                        const change = coin.price_change_percentage_24h || 0;
                        const isPositive = change >= 0;
                        return (
                          <tr
                            key={coin.id}
                            className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.01)] transition-colors text-[14px] h-[56px] font-medium"
                          >
                            <td className="py-3 pr-4 flex items-center gap-sm">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-6 h-6 object-contain animate-fade-in"
                              />
                              <div>
                                <span className="font-semibold text-white block">
                                  {coin.name}
                                </span>
                                <span className="text-[12px] text-[rgba(255,255,255,0.48)] uppercase">
                                  {coin.symbol}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-white">
                              $
                              {coin.current_price?.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 6,
                              })}
                            </td>
                            <td
                              className={`py-3 px-4 text-right font-semibold ${
                                isPositive ? "text-[#22C55E]" : "text-[#EF4444]"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {change.toFixed(2)}%
                            </td>
                            <td className="py-3 pl-4 text-right text-[rgba(255,255,255,0.72)] font-semibold">
                              ${coin.market_cap?.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </Card>

        {/* Refer your friend Card (4 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-4 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between gap-md h-[400px]"
        >
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-[11px] font-semibold text-[#8B7CFF] tracking-wider uppercase">
              <Share2 className="w-4 h-4" /> Refer & Earn
            </div>
            <h3 className="text-[18px] font-semibold text-white mt-1">
              Invite Friends
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium leading-relaxed mt-1">
              Invite your friends to Zeus Capital and earn up to{" "}
              <span className="text-white font-semibold">5% commission</span> on
              their ASIC mining contract yields.
            </p>
          </div>

          {/* Referral link display */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
              Your Referral Link
            </span>
            <div className="flex items-center gap-sm bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px] p-3">
              <span className="text-[12px] text-white font-mono break-all grow select-all">
                https://zeus.capital/ref/zc-389f2a
              </span>
              <button
                onClick={handleCopyRef}
                className="p-2 bg-[#111114] hover:bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] rounded-[10px] text-[rgba(255,255,255,0.72)] hover:text-white transition-all text-xs"
              >
                {copiedRef ? "Copied" : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Referral stats */}
          <div className="flex items-center gap-md border-t border-[rgba(255,255,255,0.06)] pt-md">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
                Referred
              </span>
              <span className="text-[18px] font-semibold text-white">
                12 Friends
              </span>
            </div>
            <div className="h-8 w-[1px] bg-[rgba(255,255,255,0.06)]" />
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
                Earned
              </span>
              <span className="text-[18px] font-semibold text-[#22C55E]">
                $1,250.00 USDH
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
