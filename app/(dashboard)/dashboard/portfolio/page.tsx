"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Coins,
  DollarSign,
  Loader2,
  PieChart,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Building2,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { formatFullCurrency } from "@/components/formatter";
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
  const [balance, setBalance] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState<number>(0);
  const [totalProfitLossPercentage, setTotalProfitLossPercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/portfolio");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setBalance(data.balance ?? 0);
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

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isTotalProfit = totalProfitLoss >= 0;

  return (
    <div className="space-y-6 w-full max-w-full font-sans pb-12 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">
              Asset Custody
            </span>
            <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-500/30 font-mono">
              Live Holdings
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            My Investment Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Track your purchased cryptocurrencies, equities, and commodities. Real-time market valuation and total profit/loss tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="h-9 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs gap-1.5 shrink-0"
          >
            <Link href="/dashboard/stocks">
              <ShoppingBag className="size-3.5" />
              Buy More Assets
            </Link>
          </Button>

          <Button
            onClick={fetchPortfolio}
            disabled={loading}
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Portfolio Performance Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <Card className="p-4 border-border bg-card shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Total Portfolio Value</span>
            <PieChart className="size-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Combined asset value
          </p>
        </Card>

        <Card className="p-4 border-border bg-card shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Unrealized P&L</span>
            {isTotalProfit ? (
              <TrendingUp className="size-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="size-4 text-rose-500" />
            )}
          </div>
          <div className={`text-2xl font-bold mt-2 ${isTotalProfit ? "text-emerald-600" : "text-rose-600"}`}>
            {isTotalProfit ? "+" : ""}${totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {isTotalProfit ? "+" : ""}{totalProfitLossPercentage.toFixed(2)}% overall return
          </p>
        </Card>

        <Card className="p-4 border-border bg-card shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Available Liquid Balance</span>
            <DollarSign className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Ready for new investments
          </p>
        </Card>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex p-1 rounded-xl bg-muted border border-border overflow-x-auto max-w-full">
          {[
            { id: "all", label: "All Holdings" },
            { id: "crypto", label: "Cryptocurrencies" },
            { id: "stock", label: "Stocks" },
            { id: "commodity", label: "Commodities" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === tab.id
                  ? "bg-accent-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search holdings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-card border-border text-foreground w-full"
          />
        </div>
      </div>

      {/* Holdings Table */}
      <Card className="border-border bg-card shadow-xs overflow-hidden max-w-full">
        <CardHeader className="border-b border-border py-3.5 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground">
            Asset Holdings Breakdown
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            {filteredItems.length} asset{filteredItems.length === 1 ? "" : "s"} owned
          </span>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto w-full max-w-full">
          <Table className="w-full min-w-[780px] whitespace-nowrap">
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Asset</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Category</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Quantity Owned</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Avg Buy Price</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Current Price</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Total Value (USD)</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3 text-right">P&L (%)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="h-14 border-border">
                    <TableCell><Skeleton className="h-8 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
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
                      {/* Asset Name & Symbol */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-extrabold text-foreground block">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono uppercase block">
                              {item.symbol}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-semibold capitalize bg-purple-500/10 text-purple-600 border-purple-500/30"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>

                      {/* Quantity Owned */}
                      <TableCell className="py-3 font-mono font-bold text-foreground">
                        {item.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 6,
                        })}
                      </TableCell>

                      {/* Avg Buy Price */}
                      <TableCell className="py-3 font-mono text-muted-foreground">
                        ${item.avgBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>

                      {/* Current Price */}
                      <TableCell className="py-3 font-mono font-bold text-foreground">
                        ${item.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        {item.adminOverride && (
                          <Badge variant="outline" className="ml-1.5 text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/30 font-mono">
                            Admin Set
                          </Badge>
                        )}
                      </TableCell>

                      {/* Total Value */}
                      <TableCell className="py-3 font-mono font-extrabold text-foreground text-sm">
                        ${item.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>

                      {/* P&L */}
                      <TableCell className="py-3 text-right">
                        <div className={`inline-flex items-center justify-end gap-1 font-bold ${
                          isPositive ? "text-emerald-500" : "text-rose-500"
                        }`}>
                          {isPositive ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : (
                            <ArrowDownRight className="size-3.5" />
                          )}
                          <span>
                            {isPositive ? "+" : ""}${item.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })} (
                            {isPositive ? "+" : ""}
                            {item.profitLossPercentage.toFixed(2)}%)
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No holdings in your portfolio yet. Click "Buy More Assets" to invest!
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
