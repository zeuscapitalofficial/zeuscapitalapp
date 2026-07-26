"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Cpu,
  ExternalLink,
  History,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mockSystemLedger = [
  {
    id: "tx-701",
    user: "August Renner",
    email: "august@renner.net",
    type: "payout",
    asset: "Bitcoin (BTC)",
    amount: "+0.0125 BTC",
    value: "+$854.20",
    status: "success",
    date: "July 8, 2026",
  },
  {
    id: "tx-702",
    user: "Eleanor Vance",
    email: "eleanor@vance.io",
    type: "deposit",
    asset: "USD Halo (USDH)",
    amount: "+$5,000.00",
    value: "+$5,000.00",
    status: "success",
    date: "July 8, 2026",
  },
  {
    id: "tx-703",
    user: "Marcus Brody",
    email: "marcus@brody.com",
    type: "withdrawal",
    asset: "USD Halo (USDH)",
    amount: "-$1,200.00",
    value: "-$1,200.00",
    status: "success",
    date: "July 7, 2026",
  },
  {
    id: "tx-704",
    user: "Siddharth Rao",
    email: "sid@rao.org",
    type: "payout",
    asset: "Bitcoin (BTC)",
    amount: "+0.0084 BTC",
    value: "+$574.90",
    status: "success",
    date: "July 7, 2026",
  },
  {
    id: "tx-705",
    user: "Emma Watson",
    email: "emma@watson.co.uk",
    type: "deposit",
    asset: "USD Halo (USDH)",
    amount: "+$25,000.00",
    value: "+$25,000.00",
    status: "pending",
    date: "July 6, 2026",
  },
];

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTxs = mockSystemLedger.filter((tx) => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch =
      tx.user.toLowerCase().includes(search.toLowerCase()) ||
      tx.email.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Ledger & Audits
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            Ledger Registry
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Search, filter, and audit global cryptocurrency deposit
            transactions, outbound withdrawals, and mining yield allocations.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-md items-center justify-between">
        <div className="flex items-center gap-xs bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-3 py-2 w-full sm:w-[320px]">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by user name, email, or TX..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-[13px] text-white focus:outline-none placeholder-zinc-500 w-full"
          />
        </div>

        <div className="flex bg-[#111114] border border-[rgba(255,255,255,0.06)] p-0.5 rounded-[12px] overflow-x-auto w-full sm:w-auto">
          {["all", "deposit", "withdrawal", "payout"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-[10px] capitalize transition-all shrink-0 ${
                filter === tab
                  ? "bg-[#1D1D22] text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {tab === "all" ? "All System" : tab + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Table Ledger */}
      <Card
        variant="flat"
        className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-zinc-500 uppercase tracking-wider h-[40px]">
                <th className="py-2 pr-4">User Details</th>
                <th className="py-2 px-4">TX Reference</th>
                <th className="py-2 px-4">Ledger Type</th>
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
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white block">
                        {tx.user}
                      </span>
                      <span className="text-[12px] text-zinc-500 block">
                        {tx.email}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[13px] text-zinc-500">
                      {tx.id}
                    </td>
                    <td className="py-3 px-4 text-zinc-300 capitalize font-semibold flex items-center gap-2 mt-1.5 border-0">
                      {tx.type === "payout" ? (
                        <Cpu className="w-3.5 h-3.5 text-red-400" />
                      ) : tx.type === "deposit" ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400" />
                      )}
                      {tx.type}
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
                      <span
                        className={`inline-flex items-center gap-xs px-2.5 py-0.5 rounded-[99px] text-[12px] font-semibold ${
                          tx.status === "success"
                            ? "bg-green-500/10 text-[#22C55E]"
                            : "bg-yellow-500/10 text-[#F59E0B]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${tx.status === "success" ? "bg-[#22C55E]" : "bg-[#F59E0B]"}`}
                        />
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right text-zinc-500">
                      {tx.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-zinc-400 text-sm"
                  >
                    No ledger matching filters found.
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
