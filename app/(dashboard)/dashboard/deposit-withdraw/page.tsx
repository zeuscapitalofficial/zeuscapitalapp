"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  ExternalLink,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const walletTransactions = [
  {
    id: "w-tx-001",
    type: "deposit",
    asset: "USD Halo (USDH)",
    address: "gy7c753s5t5WRD93x6c6r6rccr664se5xtcyvty77",
    amount: "+$5,000.00 USDH",
    status: "completed",
    date: "July 4, 2026",
  },
  {
    id: "w-tx-002",
    type: "withdrawal",
    asset: "USD Halo (USDH)",
    address: "0gy7c753s5t5WRD93x6c6r6rccr664se5xtcyvty77",
    amount: "-$1,200.00 USDH",
    status: "completed",
    date: "June 28, 2026",
  },
  {
    id: "w-tx-003",
    type: "deposit",
    asset: "USD Halo (USDH)",
    address: "0x3F72c2A71295D345c2B1a3dD5eC1378fE1E449eA",
    amount: "+$12,500.00 USDH",
    status: "completed",
    date: "June 15, 2026",
  },
];

export default function DepositWithdrawPage() {
  const depositAddress = "0x3F72c2A71295D345c2B1a3dD5eC1378fE1E449eA";

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
            Funding Console
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            Deposit & Withdraw
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.72)] font-medium">
            Manage your liquid yields, lock staking nodes, and copy secure
            deposit addresses.
          </p>
        </div>
        <div className="flex gap-sm">
          <Button className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] px-md">
            New Deposit
          </Button>
          <Button
            variant="outline"
            className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
          >
            Withdraw Cash
          </Button>
        </div>
      </div>

      {/* Worth Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <Card
          variant="flat"
          className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Available Cash
          </span>
          <div className="flex flex-col">
            <span className="text-[36px] font-semibold tracking-[-0.02em]">
              $84,310.00
            </span>
            <span className="text-[12px] text-green-400 font-semibold mt-1">
              Ready for transfer or ASIC purchases
            </span>
          </div>
        </Card>
        <Card
          variant="flat"
          className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Locked Staking
          </span>
          <div className="flex flex-col">
            <span className="text-[36px] font-semibold tracking-[-0.02em]">
              $120,000.00
            </span>
            <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-medium mt-1">
              Generating 8.4% APY rewards
            </span>
          </div>
        </Card>
        <Card
          variant="flat"
          className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <span className="text-[13px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
            Total Value
          </span>
          <div className="flex flex-col">
            <span className="text-[36px] font-semibold tracking-[-0.02em]">
              $204,310.00
            </span>
            <span className="text-[12px] text-[rgba(255,255,255,0.48)] font-medium mt-1">
              Liquid asset equivalence
            </span>
          </div>
        </Card>
      </div>

      {/* Address & Deposit Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
        <Card
          variant="flat"
          className="lg:col-span-7 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">
              ERC-20 Deposit Address
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Send only USDH or ERC-20 assets to this address.
            </p>
          </div>
          <div className="flex items-center gap-sm bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px] p-md">
            <span className="text-[13px] text-white font-mono break-all grow select-all">
              {depositAddress}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 bg-[#111114] hover:bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] rounded-[10px] text-[rgba(255,255,255,0.72)] hover:text-white transition-all"
              title="Copy Address"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 text-[12px] text-[rgba(255,255,255,0.48)] font-semibold">
            <Shield className="w-4 h-4 text-[#8B7CFF]" />
            Funds are audited and secured by institutional-grade custodians.
          </div>
        </Card>

        <Card
          variant="flat"
          className="lg:col-span-5 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <div className="flex flex-col gap-xs">
            <h3 className="text-[18px] font-semibold text-white">
              Staking Details
            </h3>
            <p className="text-[13px] text-[rgba(255,255,255,0.48)] font-medium">
              Yield-bearing staking specifications
            </p>
          </div>
          <div className="flex flex-col gap-3 text-[14px] font-medium mt-1">
            <div className="flex justify-between pb-2 border-b border-[rgba(255,255,255,0.04)]">
              <span className="text-[rgba(255,255,255,0.72)]">Current APY</span>
              <span className="text-green-400 font-semibold">8.40%</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-[rgba(255,255,255,0.04)]">
              <span className="text-[rgba(255,255,255,0.72)]">
                Lock-up Period
              </span>
              <span>30 Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(255,255,255,0.72)]">
                Next Reward Date
              </span>
              <span>July 15, 2026</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card
        variant="flat"
        className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
      >
        <h3 className="text-[18px] font-semibold text-white pb-md border-b border-[rgba(255,255,255,0.06)]">
          Funding History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider h-[40px]">
                <th className="py-2 pr-4">Transaction</th>
                <th className="py-2 px-4">Network Address</th>
                <th className="py-2 px-4 text-right">Amount</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 pl-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {walletTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.01)] transition-colors text-[14px] h-[56px] font-medium"
                >
                  <td className="py-3 pr-4 flex items-center gap-sm">
                    <div className="w-9 h-9 rounded-[10px] bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[rgba(255,255,255,0.72)]">
                      {tx.type === "deposit" ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-white block capitalize">
                        {tx.type}
                      </span>
                      <span className="text-[12px] text-[rgba(255,255,255,0.48)]">
                        {tx.asset}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[13px] text-[rgba(255,255,255,0.72)] items-center">
                    {tx.address}
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
