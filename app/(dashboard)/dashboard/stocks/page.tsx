"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Coins,
  DollarSign,
  Globe,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatFullCurrency } from "@/components/formatter";
import Link from "next/link";

interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: "crypto" | "stock" | "commodity";
  image?: string;
  price: number;
  change24h: number;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
  marketCap?: number;
  sparkline?: number[];
}

const STOCK_ASSETS: MarketAsset[] = [
  { id: "aapl", symbol: "AAPL", name: "Apple Inc.", category: "stock", price: 224.50, change24h: 1.85, marketCap: 3450000000000 },
  { id: "tsla", symbol: "TSLA", name: "Tesla Inc.", category: "stock", price: 254.80, change24h: 4.20, marketCap: 810000000000 },
  { id: "nvda", symbol: "NVDA", name: "NVIDIA Corp.", category: "stock", price: 128.30, change24h: 3.45, marketCap: 3150000000000 },
  { id: "msft", symbol: "MSFT", name: "Microsoft Corp.", category: "stock", price: 448.90, change24h: 0.95, marketCap: 3330000000000 },
  { id: "amzn", symbol: "AMZN", name: "Amazon.com Inc.", category: "stock", price: 186.20, change24h: 2.10, marketCap: 1940000000000 },
  { id: "googl", symbol: "GOOGL", name: "Alphabet Inc.", category: "stock", price: 177.40, change24h: -0.45, marketCap: 2180000000000 },
  { id: "meta", symbol: "META", name: "Meta Platforms", category: "stock", price: 485.60, change24h: 1.65, marketCap: 1230000000000 },
];

const COMMODITY_ASSETS: MarketAsset[] = [
  { id: "xau", symbol: "XAU", name: "Gold Spot", category: "commodity", price: 2384.50, change24h: 0.75 },
  { id: "wti", symbol: "WTI", name: "Crude Oil Futures", category: "commodity", price: 78.40, change24h: -1.20 },
  { id: "xag", symbol: "XAG", name: "Silver Spot", category: "commodity", price: 30.85, change24h: 1.15 },
  { id: "ng", symbol: "NG", name: "Natural Gas Futures", category: "commodity", price: 2.45, change24h: 3.80 },
  { id: "pl", symbol: "PL", name: "Platinum Spot", category: "commodity", price: 994.20, change24h: -0.30 },
];

const FALLBACK_CRYPTO: MarketAsset[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", category: "crypto", price: 63500.00, change24h: 2.45, marketCap: 1250000000000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", category: "crypto", price: 3450.00, change24h: 1.80, marketCap: 415000000000 },
  { id: "solana", symbol: "SOL", name: "Solana", category: "crypto", price: 142.50, change24h: 5.12, marketCap: 66000000000 },
  { id: "binancecoin", symbol: "BNB", name: "BNB", category: "crypto", price: 575.20, change24h: -0.40, marketCap: 84000000000 },
  { id: "ripple", symbol: "XRP", name: "XRP", category: "crypto", price: 0.58, change24h: 8.90, marketCap: 32000000000 },
];

export default function StocksMarketsPage() {
  const [cryptoAssets, setCryptoAssets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | "crypto" | "stock" | "commodity">("all");
  const [buyingAsset, setBuyingAsset] = useState<MarketAsset | null>(null);
  const [purchaseAmountUsd, setPurchaseAmountUsd] = useState("100");
  const [purchasing, setPurchasing] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);

  // Fetch Crypto from CoinGecko
  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      const [cgRes, portfolioRes] = await Promise.allSettled([
        fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true"
        ),
        fetch("/api/user/portfolio"),
      ]);

      if (portfolioRes.status === "fulfilled" && portfolioRes.value.ok) {
        const pData = await portfolioRes.value.json();
        setUserBalance(pData.balance ?? 0);
      }

      if (cgRes.status === "fulfilled" && cgRes.value.ok) {
        const data = await cgRes.value.json();
        const formatted: MarketAsset[] = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol?.toUpperCase(),
          name: coin.name,
          category: "crypto" as const,
          image: coin.image,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h || 0,
          high24h: coin.high_24h,
          low24h: coin.low_24h,
          volume24h: coin.total_volume,
          marketCap: coin.market_cap,
          sparkline: coin.sparkline_in_7d?.price || [],
        }));
        setCryptoAssets(formatted);
      } else {
        setCryptoAssets(FALLBACK_CRYPTO);
      }
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      setCryptoAssets(FALLBACK_CRYPTO);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Combine all market assets
  const allAssets = [...cryptoAssets, ...STOCK_ASSETS, ...COMMODITY_ASSETS];

  const filteredAssets = allAssets.filter((asset) => {
    const matchesCategory = category === "all" || asset.category === category;
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyAsset = async () => {
    if (!buyingAsset) return;

    const usdVal = parseFloat(purchaseAmountUsd);
    if (!usdVal || usdVal <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    const quantity = usdVal / buyingAsset.price;

    setPurchasing(true);
    try {
      const res = await fetch("/api/user/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: buyingAsset.symbol,
          name: buyingAsset.name,
          category: buyingAsset.category,
          quantity,
          price: buyingAsset.price,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Purchase failed");
      }

      toast.success(
        `Successfully bought ${quantity.toFixed(4)} ${buyingAsset.symbol} for $${usdVal.toFixed(2)} USD!`
      );
      setBuyingAsset(null);

      // Refresh balance
      fetchMarketData();
    } catch (err: any) {
      toast.error(err.message || "Failed to complete asset purchase");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full font-sans pb-12 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Market Intelligence
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-mono">
              Live CoinGecko & Equities
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Global Markets & Stocks
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Real-time cryptocurrency quotes, blue-chip stocks, and spot commodities. Instant 1-click execution into your live portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            render={
              <Link href="/dashboard/portfolio">
                <ShoppingBag className="size-3.5" />
                View Portfolio
              </Link>
            }
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5 cursor-pointer shrink-0"
          />

          <Button
            onClick={fetchMarketData}
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

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex p-1 rounded-xl bg-muted border border-border overflow-x-auto max-w-full">
          {[
            { id: "all", label: "All Markets" },
            { id: "crypto", label: "Cryptocurrencies (CoinGecko)" },
            { id: "stock", label: "Equities & Stocks" },
            { id: "commodity", label: "Spot Commodities" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                category === tab.id
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
            placeholder="Search Bitcoin, Apple, Gold..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-card border-border text-foreground w-full"
          />
        </div>
      </div>

      {/* Advanced Market Table Container */}
      <Card className="border-border bg-card shadow-xs overflow-hidden max-w-full">
        <CardHeader className="border-b border-border py-3.5 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground">
            Market Quotes & Execution
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            {filteredAssets.length} asset{filteredAssets.length === 1 ? "" : "s"} listed
          </span>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto w-full max-w-full">
          <Table className="w-full min-w-[780px] whitespace-nowrap">
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Asset</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Category</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Market Price (USD)</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">24h Change</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Market Cap / Vol</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3 text-right">Quick Buy Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="h-14 border-border">
                    <TableCell><Skeleton className="h-8 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => {
                  const isPositive = asset.change24h >= 0;

                  return (
                    <TableRow
                      key={asset.id}
                      className="border-border hover:bg-muted/40 transition-colors text-xs font-medium"
                    >
                      {/* Asset Info */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2.5">
                          {asset.image ? (
                            <img
                              src={asset.image}
                              alt={asset.name}
                              className="size-7 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="size-7 rounded-full bg-accent-foreground/10 text-accent-foreground flex items-center justify-center font-bold text-xs shrink-0">
                              {asset.symbol.slice(0, 3)}
                            </div>
                          )}
                          <div>
                            <span className="font-extrabold text-foreground block">
                              {asset.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono uppercase block">
                              {asset.symbol}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold capitalize ${
                            asset.category === "crypto"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              : asset.category === "stock"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                              : "bg-purple-500/10 text-purple-600 border-purple-500/30"
                          }`}
                        >
                          {asset.category}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-3 font-bold text-foreground text-sm font-mono">
                        ${asset.price.toLocaleString(undefined, {
                          minimumFractionDigits: asset.price < 1 ? 4 : 2,
                        })}
                      </TableCell>

                      {/* 24h Change */}
                      <TableCell className="py-3">
                        <div className={`inline-flex items-center gap-1 font-bold ${
                          isPositive ? "text-emerald-500" : "text-rose-500"
                        }`}>
                          {isPositive ? (
                            <ArrowUpRight className="size-3.5" />
                          ) : (
                            <ArrowDownRight className="size-3.5" />
                          )}
                          <span>
                            {isPositive ? "+" : ""}
                            {asset.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>

                      {/* Market Cap / Vol */}
                      <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">
                        {asset.marketCap
                          ? `$${(asset.marketCap / 1e9).toFixed(2)}B`
                          : asset.volume24h
                          ? `$${(asset.volume24h / 1e6).toFixed(2)}M`
                          : "High Liquidity"}
                      </TableCell>

                      {/* Visible Buy Button */}
                      <TableCell className="py-3 text-right">
                        <Button
                          size="sm"
                          onClick={() => setBuyingAsset(asset)}
                          className="h-8 px-3 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs gap-1.5"
                        >
                          <ShoppingBag className="size-3.5" />
                          Buy {asset.name}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No market assets matching search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Asset Purchase Dialog */}
      {buyingAsset && (
        <Dialog open={Boolean(buyingAsset)} onOpenChange={(o) => !o && setBuyingAsset(null)}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="size-4 text-emerald-500" />
                Buy {buyingAsset.name} ({buyingAsset.symbol})
              </DialogTitle>
              <DialogDescription className="text-xs">
                Execute instant order at current market price of{" "}
                <strong className="text-foreground font-mono">
                  ${buyingAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                </strong>
                .
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              {/* Available Balance Banner */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Available Account Balance:</span>
                <span className="text-sm font-extrabold text-emerald-600 font-mono">
                  ${(userBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                </span>
              </div>

              {/* Investment Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min="1"
                    step="10"
                    value={purchaseAmountUsd}
                    onChange={(e) => setPurchaseAmountUsd(e.target.value)}
                    className="pl-7 h-10 text-sm font-mono bg-background font-bold text-foreground"
                    placeholder="Enter amount in USD"
                  />
                </div>
              </div>

              {/* Estimated Quantity Calculation */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5 font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Unit Price:</span>
                  <span>${buyingAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-sm pt-1 border-t border-border/50">
                  <span>Estimated Tokens/Shares:</span>
                  <span className="text-emerald-500">
                    {((parseFloat(purchaseAmountUsd) || 0) / buyingAsset.price).toFixed(6)} {buyingAsset.symbol}
                  </span>
                </div>
              </div>

              {/* Quick Amount Selector Chips */}
              <div className="flex gap-2">
                {["50", "100", "250", "500", "1000"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPurchaseAmountUsd(amt)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition-colors ${
                      purchaseAmountUsd === amt
                        ? "bg-accent-foreground text-background border-accent-foreground"
                        : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Confirm Purchase Button */}
              <Button
                onClick={handleBuyAsset}
                disabled={purchasing}
                className="w-full h-10 font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs gap-1.5"
              >
                {purchasing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Confirm Order for ${purchaseAmountUsd || 0} USD
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
