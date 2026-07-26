"use client";

import { Loader2 } from "lucide-react";
import * as React from "react";
import MarketChartD3 from "@/components/MarketChartD3";
import { Card } from "@/components/ui/card";

interface ChartDataPoint {
  label: string;
  value: number;
}

const coins = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    color: "#F7931A",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    color: "#14F195",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  },
];

const timeframes = [
  { label: "1D", days: "1" },
  { label: "1W", days: "7" },
  { label: "1M", days: "30" },
  { label: "1Y", days: "365" },
];

export function MarketChartContainer() {
  const [selectedCoin, setSelectedCoin] = React.useState("bitcoin");
  const [selectedDays, setSelectedDays] = React.useState("30");
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/market/chart?coinId=${selectedCoin}&days=${selectedDays}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch historical market rates");
        }
        const data = await res.json();
        if (active) {
          setChartData(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "An error occurred");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, [selectedCoin, selectedDays]);

  const activeCoinObj = coins.find((c) => c.id === selectedCoin) || coins[0];
  const lastPrice =
    chartData.length > 0 ? chartData[chartData.length - 1].value : null;

  return (
    <Card
      variant="flat"
      className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-lg w-full select-none"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md w-full">
        {/* Title and price info */}
        <div className="flex flex-col gap-xs">
          <div className="flex items-center gap-xs">
            <img
              src={activeCoinObj.image}
              alt={activeCoinObj.name}
              className="w-5 h-5 object-contain"
            />
            <h3 className="text-[18px] font-semibold text-white">
              {activeCoinObj.name} Market Analytics
            </h3>
          </div>
          <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium flex items-center gap-2">
            {lastPrice !== null && (
              <>
                <span className="text-[rgba(255,255,255,0.2)]">&bull;</span>
                <span
                  className="font-semibold text-white"
                  style={{ color: activeCoinObj.color }}
                >
                  Last Price: ${lastPrice.toLocaleString()}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Controls: Coin selection & timeframe selection */}
        <div className="flex flex-wrap items-center gap-md">
          {/* Coin tab switcher */}
          <div className="flex bg-[#09090B] border border-[rgba(255,255,255,0.06)] p-0.5 rounded-[12px]">
            {coins.map((coin) => (
              <button
                key={coin.id}
                onClick={() => setSelectedCoin(coin.id)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-[10px] transition-all duration-150 flex items-center gap-1.5 ${
                  selectedCoin === coin.id
                    ? "bg-[#1D1D22] text-white shadow-sm"
                    : "text-[rgba(255,255,255,0.48)] hover:text-white"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: coin.color }}
                />
                {coin.symbol}
              </button>
            ))}
          </div>

          {/* Timeframe switcher */}
          <div className="flex bg-[#09090B] border border-[rgba(255,255,255,0.06)] p-0.5 rounded-[12px]">
            {timeframes.map((tf) => (
              <button
                key={tf.days}
                onClick={() => setSelectedDays(tf.days)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-[10px] transition-all duration-150 ${
                  selectedDays === tf.days
                    ? "bg-[#1D1D22] text-white shadow-sm"
                    : "text-[rgba(255,255,255,0.48)] hover:text-white"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[240px] w-full relative flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 bg-[#111114]/60 flex items-center justify-center rounded-[20px] z-10 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-sm">
              <Loader2 className="w-5 h-5 text-[#8B7CFF] animate-spin" />
              <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
                Syncing coin index...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-red-500/5 border border-red-500/10 p-lg text-center">
            <span className="text-sm text-red-400 font-semibold">{error}</span>
          </div>
        )}

        {chartData.length > 0 && (
          <MarketChartD3 data={chartData} strokeColor={activeCoinObj.color} />
        )}
      </div>
    </Card>
  );
}
