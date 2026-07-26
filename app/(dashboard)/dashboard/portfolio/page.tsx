"use client";

import { ArrowDownLeft, ArrowUpRight, Shield, TrendingUp } from "lucide-react";
import {
  DashboardAreaChart,
  DashboardPieChart,
} from "@/components/charts/dashboard-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const chartData = [
  { label: "Jan", value: 120000 },
  { label: "Feb", value: 154000 },
  { label: "Mar", value: 190000 },
  { label: "Apr", value: 182000 },
  { label: "May", value: 245000 },
  { label: "Jun", value: 290000 },
  { label: "Jul", value: 340602.8 },
];

const allocationData = [
  { name: "Bitcoin (BTC)", value: 55, color: "#F7931A" },
  { name: "USD Halo (USDH)", value: 20, color: "#8B7CFF" },
  { name: "Ethereum (ETH)", value: 15, color: "#627EEA" },
  { name: "Solana (SOL)", value: 10, color: "#14F195" },
];

const holdings = [
  {
    asset: "Bitcoin",
    symbol: "BTC",
    amount: "3.4810 BTC",
    avgBuy: "$58,400.00",
    currentPrice: "$68,520.00",
    totalValue: "$238,518.12",
    profit: "+$35,210.12",
    profitPercent: "+17.3%",
    color: "#F7931A",
  },
  {
    asset: "USD Halo",
    symbol: "USDH",
    amount: "84,310.00 USDH",
    avgBuy: "$1.00",
    currentPrice: "$1.00",
    totalValue: "$84,310.00",
    profit: "$0.00",
    profitPercent: "0.0%",
    color: "#8B7CFF",
  },
  {
    asset: "Ethereum",
    symbol: "ETH",
    amount: "14.50 ETH",
    avgBuy: "$2,800.00",
    currentPrice: "$3,450.00",
    totalValue: "$50,025.00",
    profit: "+$9,425.00",
    profitPercent: "+23.2%",
    color: "#627EEA",
  },
  {
    asset: "Solana",
    symbol: "SOL",
    amount: "125.00 SOL",
    avgBuy: "$110.00",
    currentPrice: "$142.00",
    totalValue: "$17,750.00",
    profit: "+$4,000.00",
    profitPercent: "+29.1%",
    color: "#14F195",
  },
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
            Consolidated Assets
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            Portfolio Analytics
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium">
            Detailed yield metrics, allocation breakdowns, and holdings balance
            registers.
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant="outline"
            className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
          >
            Rebalance Portfolio
          </Button>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-stretch">
        <Card
          variant="flat"
          className="lg:col-span-8 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-lg"
        >
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">
              Equity Curve
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Portfolio net equity growth over 6 months
            </p>
          </div>
          <div className="h-[240px] w-full">
            <DashboardAreaChart
              data={chartData}
              valueType="currency"
              strokeColor="#8B7CFF"
            />
          </div>
        </Card>

        <Card
          variant="flat"
          className="lg:col-span-4 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between gap-md"
        >
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">
              Asset Allocation
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Distribution by asset class value
            </p>
          </div>
          <div className="h-[180px] w-full relative">
            <DashboardPieChart data={allocationData} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-[20px] font-semibold">4 Tokens</span>
              <span className="text-[12px] text-[rgba(255,255,255,0.48)]">
                Diverse
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {allocationData.map((asset) => (
              <div
                key={asset.name}
                className="flex items-center justify-between text-[13px] font-medium"
              >
                <div className="flex items-center gap-sm">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-[rgba(255,255,255,0.72)]">
                    {asset.name.split(" ")[0]}
                  </span>
                </div>
                <span className="text-white font-semibold">{asset.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card
        variant="flat"
        className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
      >
        <div className="flex justify-between items-center pb-md border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">Holdings</h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Asset weights and profit registers
            </p>
          </div>
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] flex items-center gap-xs font-semibold">
            <Shield className="w-4 h-4 text-[#8B7CFF]" /> Secure Cold Vault
            Storage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider h-[40px]">
                <th className="py-2 pr-4">Asset</th>
                <th className="py-2 px-4 text-right">Holdings</th>
                <th className="py-2 px-4 text-right">Avg. Entry</th>
                <th className="py-2 px-4 text-right">Market Price</th>
                <th className="py-2 px-4 text-right">Total Equity</th>
                <th className="py-2 pl-4 text-right">Unrealized Return</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr
                  key={holding.symbol}
                  className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.01)] transition-colors text-[14px] h-[56px] font-medium"
                >
                  <td className="py-3 pr-4 flex items-center gap-sm">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: holding.color }}
                    />
                    <div>
                      <span className="font-semibold text-white block">
                        {holding.asset}
                      </span>
                      <span className="text-[12px] text-[rgba(255,255,255,0.48)]">
                        {holding.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {holding.amount}
                  </td>
                  <td className="py-3 px-4 text-right text-[rgba(255,255,255,0.72)]">
                    {holding.avgBuy}
                  </td>
                  <td className="py-3 px-4 text-right text-[rgba(255,255,255,0.72)]">
                    {holding.currentPrice}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {holding.totalValue}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span
                      className={`block font-semibold ${
                        holding.profit.startsWith("+")
                          ? "text-[#22C55E]"
                          : "text-[rgba(255,255,255,0.48)]"
                      }`}
                    >
                      {holding.profit}
                    </span>
                    <span
                      className={`text-[12px] block ${
                        holding.profitPercent.startsWith("+")
                          ? "text-[#22C55E]"
                          : "text-[rgba(255,255,255,0.48)]"
                      }`}
                    >
                      {holding.profitPercent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
