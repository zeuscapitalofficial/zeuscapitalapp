"use client";

import { AlertTriangle, Check, Search, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mockPendingWithdrawals = [
  {
    id: "wd-201",
    user: "Marcus Brody",
    email: "marcus@brody.com",
    asset: "USD Halo (USDH)",
    amount: "$1,200.00",
    destAddress: "0x892c...2A1c",
    status: "PENDING",
    date: "July 8, 2026",
  },
  {
    id: "wd-202",
    user: "Siddharth Rao",
    email: "sid@rao.org",
    asset: "Bitcoin (BTC)",
    amount: "0.0150 BTC",
    destAddress: "1A1zP1eP...9e2a",
    status: "PENDING",
    date: "July 7, 2026",
  },
];

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState(mockPendingWithdrawals);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const handleProcessWithdrawal = async (
    id: string,
    action: "APPROVED" | "REJECTED",
  ) => {
    setActionId(id);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Initiating smart contract outgoing release for ${action.toLowerCase()}...`,
      success: () => {
        setWithdrawals((prev) => prev.filter((w) => w.id !== id));
        setActionId(null);
        return `Withdrawal request successfully ${action.toLowerCase()}!`;
      },
      error: "Failed to dispatch outgoing transfer.",
    });
  };

  const filtered = withdrawals.filter(
    (w) =>
      w.user.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase()) ||
      w.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Ledger & Settlement checks
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            Withdrawal Approvals
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Audit outgoing transfer logs, verify customer KYC clearing limits,
            and authorize ledger release transactions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-xs bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-3 py-2 w-full sm:w-[320px]">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search withdrawal queues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-[13px] text-white focus:outline-none placeholder-zinc-500 w-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
        {/* Withdrawals list table (8 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-8 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <h3 className="text-[16px] font-semibold text-white">
            Pending Outgoing Transfers
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-zinc-500 uppercase tracking-wider h-[40px]">
                  <th className="py-2 pr-4">User Details</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Destination Address</th>
                  <th className="py-2 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((wd) => (
                    <tr
                      key={wd.id}
                      className="border-b border-[rgba(255,255,255,0.04)] last:border-0 text-[14px] h-[56px] font-medium"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-semibold text-white block">
                          {wd.user}
                        </span>
                        <span className="text-[12px] text-zinc-500 block">
                          {wd.email}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#EF4444] font-semibold">
                        {wd.amount}
                      </td>
                      <td className="py-3 px-4 font-mono text-[13px] text-zinc-500">
                        {wd.destAddress}
                      </td>
                      <td className="py-3 pl-4 text-right flex items-center justify-end gap-xs h-[56px]">
                        <Button
                          onClick={() =>
                            handleProcessWithdrawal(wd.id, "REJECTED")
                          }
                          disabled={actionId !== null}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 h-8 rounded-[10px] px-2.5 font-bold cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          onClick={() =>
                            handleProcessWithdrawal(wd.id, "APPROVED")
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
                      No pending withdrawal orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Security Warning card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          <Card
            variant="flat"
            className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-[15px]">
                Security Compliance Alert
              </span>
            </div>
            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
              Verify that the recipient's target destination blockchain address
              matches their registered profile verification parameters before
              authorizing release batches to mitigate AML liability.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
