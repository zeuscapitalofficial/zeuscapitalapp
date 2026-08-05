"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  History,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DepositDialog } from "@/components/dashboard/deposit-dialog";
import { WithdrawDialog } from "@/components/dashboard/withdraw-dialog";
import { formatFullCurrency } from "@/components/formatter";

interface UserProfile {
  balance: number;
  totalDeposit: number;
  totalProfit: number;
  bonusRewards: number;
}

interface TransactionRecord {
  id: string;
  type: string;
  asset: string;
  amount: number;
  txHash?: string | null;
  address?: string | null;
  status: string;
  createdAt: string;
}

function DepositWithdrawContent() {
  const searchParams = useSearchParams();

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam === "deposit") {
      setIsDepositOpen(true);
    } else if (tabParam === "withdraw") {
      setIsWithdrawOpen(true);
    }
  }, [tabParam]);

  // Fetch real user balance details
  const fetchUserData = useCallback(async () => {
    try {
      setLoadingUser(true);
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setUser({
          balance: Number(data.balance ?? 0),
          totalDeposit: Number(data.totalDeposit ?? 0),
          totalProfit: Number(data.totalProfit ?? 0),
          bonusRewards: Number(data.bonusRewards ?? 0),
        });
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Fetch real transaction history
  const fetchTransactions = useCallback(async () => {
    try {
      setLoadingTx(true);
      const res = await fetch("/api/user/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, [fetchUserData, fetchTransactions]);

  const availableBalance = user?.balance ?? 0;
  const totalDeposit = user?.totalDeposit ?? 0;
  const totalProfit = user?.totalProfit ?? 0;
  const totalPortfolioValue =
    availableBalance + totalProfit + (user?.bonusRewards ?? 0);

  const handleOpenChangeDeposit = (open: boolean) => {
    setIsDepositOpen(open);
    if (!open) {
      // Refresh balance and history after dialog closes
      fetchUserData();
      fetchTransactions();
    }
  };

  const handleOpenChangeWithdraw = (open: boolean) => {
    setIsWithdrawOpen(open);
    if (!open) {
      // Refresh balance and history after dialog closes
      fetchUserData();
      fetchTransactions();
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans max-w-7xl mx-auto w-full pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Deposit & Withdraw
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your crypto funding, instant deposits, and secure 2FA
            withdrawals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="px-3 py-1.5 text-xs font-semibold gap-1.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            2FA Protected Vault
          </Badge>
        </div>
      </div>

      {/* ── Portfolio Stats Overview ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Available Liquid Cash
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {loadingUser ? (
                <Skeleton className="h-9 w-36" />
              ) : (
                formatFullCurrency(availableBalance)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Ready for withdrawal or investment</span>
            <Badge
              variant="secondary"
              className="bg-emerald-500/15 text-emerald-500 text-[10px]"
            >
              Liquid
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Deposits Made
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {loadingUser ? (
                <Skeleton className="h-9 w-36" />
              ) : (
                formatFullCurrency(totalDeposit)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center justify-between">
            <span>All time verified deposits</span>
            <Badge
              variant="secondary"
              className="bg-accent-foreground/15 text-accent-foreground text-[10px]"
            >
              Verified
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Portfolio Equivalence
            </CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {loadingUser ? (
                <Skeleton className="h-9 w-36" />
              ) : (
                formatFullCurrency(totalPortfolioValue)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Aggregated vault equivalence</span>
            <Badge
              variant="secondary"
              className="bg-blue-500/15 text-blue-500 text-[10px]"
            >
              Audited
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Action Cards (Dialog Triggers) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit Card */}
        <Card className="border-border shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <ArrowDownLeft className="w-32 h-32 text-emerald-500" />
          </div>
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Deposit Capital
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Fund your account using instant crypto transfers (USDT, BTC, ETH,
              USDC) or manual fiat gateways.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground py-1 border-b border-border/50">
                <span>Supported Assets</span>
                <span className="font-medium text-foreground">
                  BTC, USDT, ETH, USDC, Bank
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground py-1 border-b border-border/50">
                <span>Processing Time</span>
                <span className="font-medium text-emerald-500">
                  Automated Indexing (&lt; 3 mins)
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground py-1">
                <span>Platform Fee</span>
                <span className="font-semibold text-emerald-500">
                  0.00% (Free)
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsDepositOpen(true)}
              className="w-full bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold h-11 text-xs gap-2 cursor-pointer shadow-xs"
            >
              <Coins className="w-4 h-4" />
              Deposit Funds Now
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw Card */}
        <Card className="border-border shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <ArrowUpRight className="w-32 h-32 text-accent-foreground" />
          </div>
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-accent-foreground/10 text-accent-foreground flex items-center justify-center mb-3">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Withdraw Cash
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Request payouts directly to your verified bank account, wire
              (SWIFT/SEPA), or external crypto wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground py-1 border-b border-border/50">
                <span>Withdrawal Methods</span>
                <span className="font-medium text-foreground">
                  Bank, Wire, Crypto, PayPal
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground py-1 border-b border-border/50">
                <span>Security Authorization</span>
                <span className="font-medium text-foreground">
                  2FA Authenticator Code
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground py-1">
                <span>Daily Limit</span>
                <span className="font-semibold text-foreground">
                  $50,000.00 USD
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsWithdrawOpen(true)}
              className="w-full bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold h-11 text-xs gap-2 cursor-pointer shadow-xs"
            >
              <Lock className="w-4 h-4" />
              Withdraw Funds Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Transaction History Table ── */}
      <Card className="border-border shadow-xs mt-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              Funding History
            </CardTitle>
            <CardDescription className="text-xs">
              Recent deposits, withdrawals, and network confirmations.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {transactions.length} Recorded Transactions
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse select-none">
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="text-xs font-semibold">
                    Type & Asset
                  </TableHead>
                  <TableHead className="text-xs font-semibold">TxID</TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingTx ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i} className="border-border/40">
                      <TableCell className="py-3">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="py-3">
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </TableCell>
                      <TableCell className="py-3">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground text-xs"
                    >
                      No funding transactions recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => {
                    const isDeposit = tx.type.toUpperCase() === "DEPOSIT";
                    const isPending = tx.status.toUpperCase() === "PENDING";
                    const txHashStr = tx.txHash
                      ? tx.txHash.length > 12
                        ? `${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-4)}`
                        : tx.txHash
                      : "N/A";

                    return (
                      <TableRow
                        key={tx.id}
                        className="border-border/40 hover:bg-muted/30"
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isDeposit
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-accent-foreground/10 text-accent-foreground"
                              }`}
                            >
                              {isDeposit ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-xs block capitalize text-foreground">
                                {tx.type.toLowerCase()}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {tx.asset}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 font-mono text-xs text-foreground font-medium">
                          {txHashStr}
                        </TableCell>
                        <TableCell
                          className={`py-3 text-right font-semibold text-xs ${
                            isDeposit ? "text-emerald-500" : "text-foreground"
                          }`}
                        >
                          {isDeposit ? "+" : "-"}
                          {formatFullCurrency(tx.amount)}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] gap-1 font-medium capitalize border ${
                              isPending
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                isPending ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            />
                            {tx.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Dialog Components ── */}
      <DepositDialog
        open={isDepositOpen}
        onOpenChange={handleOpenChangeDeposit}
      />
      <WithdrawDialog
        open={isWithdrawOpen}
        onOpenChange={handleOpenChangeWithdraw}
      />
    </div>
  );
}

export default function DepositWithdrawPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground">
          Loading your wallet addresses...
        </div>
      }
    >
      <DepositWithdrawContent />
    </Suspense>
  );
}
