"use client";

import { PerformanceChart } from "@/components/charts/performance-chart";
import { DepositDialog } from "@/components/dashboard/deposit-dialog";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { WithdrawDialog } from "@/components/dashboard/withdraw-dialog";
import {
  formatCompactCurrency,
  formatFullCurrency,
} from "@/components/formatter";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/auth-client";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  DollarSign,
  Eye,
  EyeOff,
  Gift,
  HelpCircle,
  History,
  PieChart,
  Radio,
  Settings,
  ShieldCheck,
  TrendingUp,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [coinsList, setCoinsList] = useState<any[]>([]);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [copiedRef, setCopiedRef] = useState(false);

  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    balance?: number;
    totalProfit?: number;
    totalDeposit?: number;
    bonusRewards?: number;
    kycStatus?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  } | null>(null);
  const [coinError, setCoinError] = useState(false);
  const [userError, setUserError] = useState(false);

  const fetchTopCoins = useCallback(async () => {
    try {
      setLoadingCoins(true);
      setCoinError(false);
      const res = await fetch("/api/market/top-coins");
      if (!res.ok) throw new Error("Failed to fetch coins");
      const data = await res.json();
      setCoinsList(data);
    } catch (err) {
      console.error("Failed to load top coins");
      setCoinError(true);
    } finally {
      setLoadingCoins(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      setUserError(false);
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        setUserError(true);
      }
    } catch (err) {
      console.error("Failed to load user profile");
      setUserError(true);
    }
  }, []);

  useEffect(() => {
    fetchTopCoins();
    fetchUserData();
  }, [fetchTopCoins, fetchUserData]);

  // ── Alex (Power User): Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "d" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push("/dashboard/deposit-withdraw?tab=deposit");
      } else if (e.key === "w" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push("/dashboard/deposit-withdraw?tab=withdraw");
      } else if (e.key === "p" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push("/dashboard/packages");
      } else if (e.key === "s" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push("/dashboard/signals");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleCopyRef = () => {
    navigator.clipboard.writeText("https://zeus.capital/sign-up?ref=zc-389f2a");
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const user = session?.user;
  const userName = userData?.name || user?.name || "Investor";
  const kycStatus = userData?.kycStatus || "NONE";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Format today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-lg font-sans min-h-screen">
      <div className="grid grid-cols-1 mb-4 lg:grid-cols-12 gap-md items-stretch">
        <Card className="lg:col-span-5 min-h-75">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-sm">
              <Wallet className="w-4 h-4" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-default">
                    Account Balance
                  </TooltipTrigger>
                  <TooltipContent>
                    Total liquid capital available across your trading and mining accounts
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardAction>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-0.5"
                aria-label={showBalance ? "Hide balance" : "Show balance"}
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-xs mt-sm">
              <span className="text-[36px] font-semibold tracking-[-0.03em] leading-none">
                {!userData && !userError ? (
                  <Skeleton className="h-9 w-40" />
                ) : showBalance ? (
                  formatFullCurrency(userData?.balance ?? 0)
                ) : (
                  "••••••"
                )}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                Your current available balance
              </span>
            </div>

            <div className="h-[.1px] bg-border/60 w-full my-xs" />

            <div className="flex flex-col gap-xs">
              <span className="text-sm text-muted-foreground font-medium">
                Available for Withdrawal
              </span>
              <span className="text-[18px] font-semibold">
                {showBalance
                  ? formatFullCurrency(userData?.balance ?? 0)
                  : "••••••"}
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex gap-sm mt-sm">
            <DepositDialog
              trigger={
                <Button variant="outline" className="flex-1 cursor-pointer">
                  <ArrowUpRight className="w-4 h-4 inline mr-1 text-accent-foreground" />{" "}
                  <span className="inline">Deposit</span>
                </Button>
              }
            />
            <WithdrawDialog
              trigger={
                <Button variant="outline" className="flex-1 cursor-pointer">
                  <ArrowDownLeft className="w-4 h-4 inline mr-1 text-accent-foreground" />{" "}
                  <span className="inline">Withdraw</span>
                </Button>
              }
            />
          </CardFooter>
        </Card>

        <div className="lg:col-span-7 flex flex-col justify-between gap-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md flex-1">
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-xs text-chart-1">
                  <TrendingUp className="w-4 h-4" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-default">
                        Total Profit
                      </TooltipTrigger>
                      <TooltipContent>
                        Cumulative yield from active mining contracts and trading signals
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <span className="text-[28px] font-semibold tracking-[-0.02em] mt-2 block">
                  {!userData && !userError ? (
                    <Skeleton className="h-7 w-28" />
                  ) : showBalance ? (
                    formatFullCurrency(userData?.totalProfit ?? 0)
                  ) : (
                    "••••••"
                  )}
                </span>
                <span className="text-xs text-muted-foreground font-semibold mt-1">
                  Lifetime earnings
                </span>
              </CardContent>
            </Card>

            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-xs text-chart-2">
                  <DollarSign className="w-4 h-4" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-default">
                        Total Deposit
                      </TooltipTrigger>
                      <TooltipContent>
                        Sum of all deposits made to your account
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <span className="text-[28px] font-semibold tracking-[-0.02em] mt-2 block">
                  {!userData && !userError ? (
                    <Skeleton className="h-7 w-28" />
                  ) : showBalance ? (
                    formatFullCurrency(userData?.totalDeposit ?? 0)
                  ) : (
                    "••••••"
                  )}
                </span>
                <span className="text-xs text-muted-foreground font-semibold mt-1">
                  All time deposits
                </span>
              </CardContent>
            </Card>
          </div>

          <Card className="">
            <CardHeader>
              <CardTitle className="flex justify-between items-center w-full">
                <span className="flex items-center gap-xs text-chart-3">
                  <Gift className="w-4 h-4" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-default">
                        Bonus
                      </TooltipTrigger>
                      <TooltipContent>
                        Promotional credits and referral rewards earned
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <span className="text-chart-3 hover:text-chart-3/70 transition-colors cursor-pointer">
                  Rewards & Promotions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <span className="text-[28px] font-semibold tracking-[-0.02em] mt-2 block">
                {!userData && !userError ? (
                  <Skeleton className="h-7 w-28" />
                ) : showBalance ? (
                  formatFullCurrency(userData?.bonusRewards ?? 0)
                ) : (
                  "••••••"
                )}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        <div className="lg:col-span-8 flex">
          <PerformanceChart />
        </div>

        <Card className="lg:col-span-4 flex flex-col justify-between gap-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/dashboard/deposit-withdraw?tab=deposit"
                className="w-full p-3 bg-background hover:bg-accent/40 border border-border/50 rounded-xl flex items-center justify-between transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-accent/50 rounded-lg text-foreground group-hover:bg-accent transition-colors">
                    <ArrowLeftRight className="w-4 h-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      Deposit & Withdraw
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Fund account or request payouts
                    </span>
                    <kbd className="hidden lg:inline text-[10px] text-muted-foreground/60 font-mono mt-0.5">D</kbd>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-all transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/packages"
                className="w-full p-3 bg-background hover:bg-accent/40 border border-border/50 rounded-xl flex items-center justify-between transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-accent/50 rounded-lg text-foreground group-hover:bg-accent transition-colors">
                    <Cpu className="w-4 h-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      Investment Packages
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Crypto brokerage & mining contracts
                    </span>
                    <kbd className="hidden lg:inline text-[10px] text-muted-foreground/60 font-mono mt-0.5">P</kbd>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-all transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/signals"
                className="w-full p-3 bg-background hover:bg-accent/40 border border-border/50 rounded-xl flex items-center justify-between transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-accent/50 rounded-lg text-foreground group-hover:bg-accent transition-colors">
                    <Radio className="w-4 h-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      Trading Signals
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Real-time AI market analytics
                    </span>
                    <kbd className="hidden lg:inline text-[10px] text-muted-foreground/60 font-mono mt-0.5">S</kbd>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-all transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/kyc"
                className="w-full p-3 bg-background hover:bg-accent/40 border border-border/50 rounded-xl flex items-center justify-between transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-accent/50 rounded-lg text-foreground group-hover:bg-accent transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      Account Verification
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      Verify identity for higher limits
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-all transform group-hover:translate-x-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Replaced Transactions Table with Two Columns: Top Coins & Refer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        {/* Top Coins Card (8 cols) */}
        <Card className="lg:col-span-8 h-100 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Cryptocurrency Indices</CardTitle>
              <CardDescription>
                Live market valuations via CoinGecko index rankings
              </CardDescription>
            </div>
            {coinError && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTopCoins()}
                className="text-xs gap-1 cursor-pointer"
              >
                Retry
              </Button>
            )}
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-80 flex-1 w-full overflow-hidden pr-4">
              <Table className="select-none">
                <TableHeader>
                  <TableRow className="border-b border-border/40 hover:bg-transparent">
                    <TableHead className="py-2 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider h-10">
                      Asset
                    </TableHead>
                    <TableHead className="py-2 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider h-10">
                      Price
                    </TableHead>
                    <TableHead className="py-2 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider h-10">
                      24h Change
                    </TableHead>
                    <TableHead className="py-2 pl-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider h-10">
                      Market Cap
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingCoins
                    ? // Skeleton rows
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow
                          key={i}
                          className="border-b border-border/40 last:border-0 h-14"
                        >
                          <TableCell className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Skeleton className="w-8 h-8 rounded-full" />
                              <Skeleton className="w-16 h-4" />
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-right">
                            <Skeleton className="w-12 h-4 ml-auto" />
                          </TableCell>
                          <TableCell className="py-3 px-4 text-right">
                            <Skeleton className="w-10 h-4 ml-auto" />
                          </TableCell>
                          <TableCell className="py-3 pl-4 text-right">
                            <Skeleton className="w-20 h-4 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    : coinsList.map((coin) => {
                        const change = coin.price_change_percentage_24h || 0;
                        const isPositive = change >= 0;
                        return (
                          <TableRow
                            key={coin.id}
                            className="border-b border-border/40 last:border-0 text-sm h-14 font-medium"
                          >
                            <TableCell className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={coin.image}
                                  alt={coin.name}
                                  className="w-6 h-6 object-contain animate-fade-in"
                                />
                                <div>
                                  <span className="font-semibold text-foreground block">
                                    {coin.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground uppercase">
                                    {coin.symbol}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-right font-semibold text-foreground">
                              {formatFullCurrency(coin.current_price || 0)}
                            </TableCell>
                            <TableCell
                              className={`py-3 px-4 text-right font-semibold ${
                                isPositive
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {change.toFixed(2)}%
                            </TableCell>
                            <TableCell className="py-3 pl-4 text-right text-muted-foreground font-semibold">
                              {formatCompactCurrency(coin.market_cap || 0)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Refer your friend Card (4 cols) */}
        <ReferralCard />
      </div>
    </div>
  );
}
