"use client";

import {
  ArrowDownLeft,
  Check,
  HelpCircle,
  Loader2,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mockPendingDeposits = [
  {
    id: "dep-101",
    user: "Eleanor Vance",
    email: "eleanor@vance.io",
    asset: "USD Halo (USDH)",
    amount: "$5,000.00",
    txHash: "0x3f5c...9e2a",
    status: "PENDING",
    date: "July 8, 2026",
  },
  {
    id: "dep-102",
    user: "Emma Watson",
    email: "emma@watson.co.uk",
    asset: "USD Halo (USDH)",
    amount: "$25,000.00",
    txHash: "0x892d...4a1c",
    status: "PENDING",
    date: "July 7, 2026",
  },
];

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState(mockPendingDeposits);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const handleProcessDeposit = async (
    id: string,
    action: "APPROVED" | "REJECTED",
  ) => {
    setActionId(id);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
      loading: `Processing deposit status as ${action}...`,
      success: () => {
        setDeposits((prev) => prev.filter((d) => d.id !== id));
        setActionId(null);
        return `Deposit successfully ${action.toLowerCase()}!`;
      },
      error: "Failed to update deposit state.",
    });
  };

  const filtered = deposits.filter(
    (d) =>
      d.user.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Ledger & Funding Checks
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            Deposit Checks
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Audit manual blockchain transactions, verify deposit hash logs, and
            manually credit user accounts.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-xs bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-3 py-2 w-full sm:w-[320px]">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search deposits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-[13px] text-white focus:outline-none placeholder-zinc-500 w-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
        {/* Deposit list (8 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-8 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <h3 className="text-[16px] font-semibold text-white">
            Pending Deposits Queue
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-zinc-500 uppercase tracking-wider h-[40px]">
                  <th className="py-2 pr-4">User Details</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">TX Hash</th>
                  <th className="py-2 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((dep) => (
                    <tr
                      key={dep.id}
                      className="border-b border-[rgba(255,255,255,0.04)] last:border-0 text-[14px] h-[56px] font-medium"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-semibold text-white block">
                          {dep.user}
                        </span>
                        <span className="text-[12px] text-zinc-500 block">
                          {dep.email}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#22C55E] font-semibold">
                        {dep.amount}
                      </td>
                      <td className="py-3 px-4 font-mono text-[13px] text-zinc-500">
                        {dep.txHash}
                      </td>
                      <td className="py-3 pl-4 text-right flex items-center justify-end gap-xs h-[56px]">
                        <Button
                          onClick={() =>
                            handleProcessDeposit(dep.id, "REJECTED")
                          }
                          disabled={actionId !== null}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 h-8 rounded-[10px] px-2.5 font-bold cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          onClick={() =>
                            handleProcessDeposit(dep.id, "APPROVED")
                          }
                          disabled={actionId !== null}
                          className="bg-green-500/10 hover:bg-green-500/20 text-green-400 h-8 rounded-[10px] px-2.5 font-bold cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-zinc-400 text-sm"
                    >
                      No pending deposits found in the queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Security audit advice (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <ShieldCheck className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-[15px]">
                Security Standards
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
              Always copy the transaction hash reference and crosscheck it
              against public blocks explorers (Etherscan, Blockchain.com) to
              verify network confirmation values before crediting accounts.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
