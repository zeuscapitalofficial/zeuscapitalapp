"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Cpu,
  ExternalLink,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const allTransactions = [
  {
    id: "tx-001",
    type: "payout",
    asset: "Bitcoin (BTC)",
    amount: "+0.0125 BTC",
    value: "+$854.20",
    status: "success",
    date: "July 5, 2026",
    address: "0x89...2A1c",
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
    address: "0x3F...49eA",
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
    address: "0x3F...49eA",
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
    address: "0x3F...49eA",
    icon: TrendingUp,
  },
  {
    id: "tx-005",
    type: "withdrawal",
    asset: "USD Halo (USDH)",
    amount: "-$1,200.00 USDH",
    value: "-$1,200.00",
    status: "success",
    date: "June 28, 2026",
    address: "0x89...2A1c",
    icon: ArrowUpRight,
  },
  {
    id: "tx-006",
    type: "payout",
    asset: "Bitcoin (BTC)",
    amount: "+0.0118 BTC",
    value: "+$808.30",
    status: "success",
    date: "June 27, 2026",
    address: "0x89...2A1c",
    icon: Cpu,
  },
  {
    id: "tx-007",
    type: "deposit",
    asset: "USD Halo (USDH)",
    amount: "+$12,500.00 USDH",
    value: "+$12,500.00",
    status: "success",
    date: "June 15, 2026",
    address: "0x3F...49eA",
    icon: ArrowDownLeft,
  },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredTxs = allTransactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch =
      tx.asset.toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
            Ledger Registry
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            History
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium">
            Search, filter, and export your transaction logs and ASIC payout
            distributions.
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            variant="outline"
            className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-md items-center justify-between">
        {/* Search */}
        <div className="flex items-center gap-xs bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-3 py-2 w-full sm:w-[320px]">
          <Search className="w-4 h-4 text-[rgba(255,255,255,0.48)]" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-[13px] text-white focus:outline-none placeholder-[rgba(255,255,255,0.3)] w-full"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-[#111114] border border-[rgba(255,255,255,0.06)] p-0.5 rounded-[14px] w-full sm:w-auto overflow-x-auto">
          {["all", "deposit", "withdrawal", "payout", "yield"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-[12px] font-semibold rounded-[12px] capitalize transition-all shrink-0 ${
                filter === tab
                  ? "bg-[#1D1D22] text-white shadow-sm"
                  : "text-[rgba(255,255,255,0.48)] hover:text-white"
              }`}
            >
              {tab === "all" ? "All History" : tab + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table Card */}
      <Card
        variant="flat"
        className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider h-[40px]">
                <th className="py-2 pr-4">Activity</th>
                <th className="py-2 px-4">Ledger Type</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4 text-right">Amount</th>
                <th className="py-2 px-4 text-right">Value (USD)</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 pl-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.length > 0 ? (
                filteredTxs.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.01)] transition-colors text-[14px] h-[56px] font-medium"
                  >
                    <td className="py-3 pr-4 flex items-center gap-sm">
                      <div className="w-9 h-9 rounded-[10px] bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[rgba(255,255,255,0.72)]">
                        <tx.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block">
                          {tx.asset}
                        </span>
                        <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-mono">
                          {tx.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[rgba(255,255,255,0.72)] capitalize">
                      {tx.type}
                    </td>
                    <td className="py-3 px-4 font-mono text-[13px] text-[rgba(255,255,255,0.48)]">
                      <span className="flex items-center gap-xs cursor-pointer hover:text-white transition-colors">
                        {tx.address}
                        <ExternalLink className="w-3.5 h-3.5 text-[rgba(255,255,255,0.2)]" />
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        tx.amount.startsWith("+")
                          ? "text-[#22C55E]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {tx.amount}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        tx.value.startsWith("+")
                          ? "text-[#22C55E]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      {tx.value}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-xs px-2.5 py-0.5 rounded-[99px] text-[12px] font-semibold bg-green-500/10 text-[#22C55E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right text-[rgba(255,255,255,0.48)]">
                      {tx.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-[rgba(255,255,255,0.48)] text-[14px]"
                  >
                    No transactions match your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
