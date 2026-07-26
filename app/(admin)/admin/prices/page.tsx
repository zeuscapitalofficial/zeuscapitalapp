"use client";

import { AlertCircle, Loader2, RefreshCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPricesPage() {
  const [feedMode, setFeedMode] = useState<"api" | "manual">("api");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [prices, setPrices] = useState({
    bitcoin: "68450.20",
    ethereum: "3520.12",
    usdh: "1.00",
  });

  // Load current overrides
  async function loadOverrides() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/prices");
      if (!res.ok) throw new Error("Failed to load price configurations");
      const overrides = await res.json();

      const btcOverride = overrides.find((o: any) => o.coinId === "bitcoin");
      const ethOverride = overrides.find((o: any) => o.coinId === "ethereum");

      if (btcOverride) {
        setPrices((prev) => ({
          ...prev,
          bitcoin: String(btcOverride.priceUsd),
        }));
      }
      if (ethOverride) {
        setPrices((prev) => ({
          ...prev,
          ethereum: String(ethOverride.priceUsd),
        }));
      }

      // If either override is enabled, show manual feed mode
      if (btcOverride?.isEnabled || ethOverride?.isEnabled) {
        setFeedMode("manual");
      } else {
        setFeedMode("api");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to load pricing setups from DB.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverrides();
  }, []);

  const handleSaveOverrides = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving pricing overrides to database...");

    try {
      // Save Bitcoin override
      const btcRes = await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinId: "bitcoin",
          priceUsd: parseFloat(prices.bitcoin),
          isEnabled: feedMode === "manual",
        }),
      });
      if (!btcRes.ok) throw new Error("Failed to update Bitcoin price");

      // Save Ethereum override
      const ethRes = await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinId: "ethereum",
          priceUsd: parseFloat(prices.ethereum),
          isEnabled: feedMode === "manual",
        }),
      });
      if (!ethRes.ok) throw new Error("Failed to update Ethereum price");

      toast.success("Manual price overrides saved and applied system-wide!", {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to commit pricing parameters.", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeed = async (mode: "api" | "manual") => {
    setFeedMode(mode);
    const toastId = toast.loading(
      `Toggling ticker source feed to ${mode.toUpperCase()}...`,
    );
    try {
      // Save state to database for both coins
      await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinId: "bitcoin",
          isEnabled: mode === "manual",
        }),
      });
      await fetch("/api/admin/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinId: "ethereum",
          isEnabled: mode === "manual",
        }),
      });

      toast.success(
        mode === "api"
          ? "Ticker sources re-routed to Live CoinGecko API streams."
          : "Ticker sources locked to database override values.",
        { id: toastId },
      );
    } catch (e) {
      toast.error("Failed to toggle price override states.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Exchange Feeds Config
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            Coin Pricing
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Configure system exchange rates, set custom pricing thresholds, and
            toggle manual overrides for asset values.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
        {/* Price control form (7 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-7 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-md">
            <h3 className="text-[16px] font-semibold text-white">
              Price Feed Routing
            </h3>
            <div className="flex bg-[#09090B] border border-[rgba(255,255,255,0.06)] p-0.5 rounded-[12px]">
              <button
                onClick={() => handleToggleFeed("api")}
                className={`px-3 py-1 text-[11px] font-semibold rounded-[10px] capitalize transition-all ${
                  feedMode === "api"
                    ? "bg-[#1D1D22] text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Live API
              </button>
              <button
                onClick={() => handleToggleFeed("manual")}
                className={`px-3 py-1 text-[11px] font-semibold rounded-[10px] capitalize transition-all ${
                  feedMode === "manual"
                    ? "bg-red-500/10 text-red-400"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveOverrides} className="flex flex-col gap-md">
            <div className="flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Bitcoin (BTC) Price (USD)
                </Label>
                {feedMode === "api" && (
                  <span className="text-[10px] text-green-400 font-bold uppercase">
                    Streaming live
                  </span>
                )}
              </div>
              <Input
                type="number"
                step="0.01"
                value={prices.bitcoin}
                disabled={feedMode === "api" || saving}
                onChange={(e) =>
                  setPrices({ ...prices, bitcoin: e.target.value })
                }
                className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder-zinc-500 focus:border-red-500 transition-all font-mono"
              />
            </div>

            <div className="flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Ethereum (ETH) Price (USD)
                </Label>
                {feedMode === "api" && (
                  <span className="text-[10px] text-green-400 font-bold uppercase">
                    Streaming live
                  </span>
                )}
              </div>
              <Input
                type="number"
                step="0.01"
                value={prices.ethereum}
                disabled={feedMode === "api" || saving}
                onChange={(e) =>
                  setPrices({ ...prices, ethereum: e.target.value })
                }
                className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white placeholder-zinc-500 focus:border-red-500 transition-all font-mono"
              />
            </div>

            <div className="flex flex-col gap-sm">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  USD Halo (USDH) Peg
                </Label>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">
                  Fixed Peg
                </span>
              </div>
              <Input
                type="text"
                value={prices.usdh}
                disabled
                className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-[#09090B] text-sm h-10 text-zinc-400 font-mono"
              />
            </div>

            {feedMode === "manual" && (
              <Button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold h-10 rounded-[12px] px-lg flex items-center justify-center gap-xs ml-auto transition-colors mt-sm cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Local Overrides
              </Button>
            )}
          </form>
        </Card>

        {/* Informative side panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-md">
          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-[15px]">
                Pricing Feed Fallback
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
              In "Live API" mode, the server uses cached values from CoinGecko
              API keys. If the API hits rate limits or throws failures, the
              system automatically falls back to manual database values to
              safeguard staking calculations.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
