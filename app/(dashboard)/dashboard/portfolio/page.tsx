"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Loader2,
  PieChart,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  category: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  adminOverride: boolean;
  updatedAt: string;
}

export default function UserPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState<number>(0);
  const [totalProfitLossPercentage, setTotalProfitLossPercentage] =
    useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showBalance, setShowBalance] = useState(true);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/portfolio");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotalValue(data.totalPortfolioValue ?? 0);
        setTotalProfitLoss(data.totalProfitLoss ?? 0);
        setTotalProfitLossPercentage(data.totalProfitLossPercentage ?? 0);
      } else {
        toast.error("Failed to load portfolio holdings");
      }
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
      toast.error("Network error while loading portfolio");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  const isTotalProfit = totalProfitLoss >= 0;

  return (
    <div className="space-y-6 w-full max-w-full font-sans pb-12 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            My Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-160">
            Track your purchased cryptocurrencies, stocks, and commodities in
            real time.
          </p>
        </div>

        <Button
          render={
            <Link href="/dashboard/stocks">
              <ShoppingBag className="size-3.5" />
              Buy Assets
            </Link>
          }
          className="h-9 text-xs  bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs gap-1.5 shrink-0 self-start sm:self-center"
        />
      </div>

      {/* SINGLE CLEAN TOTAL PORTFOLIO VALUE CARD WITH SHOW/HIDE BALANCE EYE TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 my-3">
        <div className="">
          <div className="text-3xl sm:text-4xl font-mono">
            {showBalance
              ? `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "$••••••••"}
          </div>

          <div
            className={`inline-flex items-center pt-2 gap-1  text-sm ${
              isTotalProfit ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {isTotalProfit ? (
              <ArrowUpRight className="size-4" />
            ) : (
              <ArrowDownRight className="size-4" />
            )}
            <span>
              {showBalance
                ? `${isTotalProfit ? "+" : ""}$${totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${isTotalProfit ? "+" : ""}${totalProfitLossPercentage.toFixed(2)}%)`
                : "••••••"}
            </span>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowBalance(!showBalance)}
          className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
          title={showBalance ? "Hide Balance" : "Show Balance"}
        >
          {showBalance ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      </div>

      {/* Search Bar & Table Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h2 className="text-sm  text-foreground">
          Owned Holdings ({filteredItems.length})
        </h2>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search holdings by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-card border-border text-foreground w-full"
          />
        </div>
      </div>

      {/* SIMPLIFIED PORTFOLIO TABLE: NAME (+ Amount Underneath), PRICE, UP/DOWN INDICATOR */}
      <Card className="border-border bg-card shadow-xs overflow-hidden max-w-full">
        <CardContent className="p-0 overflow-x-auto w-full max-w-full">
          <Table className="w-full min-w-[500px] whitespace-nowrap">
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-xs  text-muted-foreground py-3">
                  Name & Holdings
                </TableHead>
                <TableHead className="text-xs  text-muted-foreground py-3">
                  Current Price
                </TableHead>
                <TableHead className="text-xs  text-muted-foreground py-3 text-right">
                  Performance (Up / Down)
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="h-14 border-border">
                    <TableCell>
                      <Skeleton className="h-8 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isPositive = item.profitLoss >= 0;

                  return (
                    <TableRow
                      key={item.id}
                      className="border-border hover:bg-muted/40 transition-colors text-xs font-medium"
                    >
                      {/* Name with Amount/Quantity Underneath */}
                      <TableCell className="py-3">
                        <div>
                          <span className="font-extrabold text-sm text-foreground block">
                            {item.name} ({item.symbol})
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono block">
                            Amount:{" "}
                            {showBalance
                              ? item.quantity.toLocaleString(undefined, {
                                  maximumFractionDigits: 6,
                                })
                              : "••••"}{" "}
                            {item.symbol}
                          </span>
                        </div>
                      </TableCell>

                      {/* Current Price */}
                      <TableCell className="py-3 font-mono  text-foreground text-sm">
                        {showBalance
                          ? `$${item.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : "$••••"}
                        {item.adminOverride && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/30 font-mono"
                          >
                            Admin Set
                          </Badge>
                        )}
                      </TableCell>

                      {/* Up or Down Performance Indicator */}
                      <TableCell className="py-3 text-right">
                        <div
                          className={`inline-flex items-center justify-end gap-1  ${
                            isPositive ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="size-4" />
                          ) : (
                            <ArrowDownRight className="size-4" />
                          )}
                          <span>
                            {showBalance
                              ? `${isPositive ? "+" : ""}${item.profitLossPercentage.toFixed(2)}%`
                              : "••••"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-12 text-center text-xs text-muted-foreground"
                  >
                    No holdings in your portfolio yet. Click "Buy Assets" to
                    invest!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
