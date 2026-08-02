"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface AdminTxUser {
  id: string;
  name: string;
  email: string;
}

interface AdminTransaction {
  id: string;
  userId: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "PURCHASE" | "STAMP_DUTY" | "TAXATION" | string;
  asset: string;
  amount: number;
  txHash?: string | null;
  address?: string | null;
  status: "PENDING" | "COMPLETED" | "REJECTED" | string;
  createdAt: string;
  user: AdminTxUser;
}

export default function AdminDepositsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "deposit" | "withdrawal" | "all">("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      } else {
        toast.error("Failed to load admin transactions");
      }
    } catch (err) {
      console.error("Failed to fetch admin transactions:", err);
      toast.error("Network error while loading transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleProcessTransaction = async (
    transactionId: string,
    newStatus: "COMPLETED" | "REJECTED"
  ) => {
    setProcessingId(transactionId);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Action failed");
      }

      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, status: newStatus } : t))
      );

      if (newStatus === "COMPLETED") {
        toast.success("Transaction approved! User balance updated.");
      } else {
        toast.info("Transaction declined.");
      }

      if (selectedTx?.id === transactionId) {
        setSelectedTx((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process transaction.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Filter transactions
  const filteredTxs = transactions.filter((tx) => {
    const matchesTab =
      activeTab === "pending"
        ? tx.status.toUpperCase() === "PENDING"
        : activeTab === "deposit"
        ? tx.type.toUpperCase() === "DEPOSIT"
        : activeTab === "withdrawal"
        ? tx.type.toUpperCase() === "WITHDRAWAL"
        : true;

    const matchesSearch =
      tx.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      tx.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      tx.asset.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(search.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // Calculate audit metrics
  const pendingCount = transactions.filter((t) => t.status === "PENDING").length;
  const pendingVolume = transactions
    .filter((t) => t.status === "PENDING")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const approvedDepositVolume = transactions
    .filter((t) => t.type === "DEPOSIT" && t.status === "COMPLETED")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const approvedWithdrawalVolume = transactions
    .filter((t) => t.type === "WITHDRAWAL" && t.status === "COMPLETED")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="space-y-6 w-full max-w-full font-sans pb-12 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Ledger Management
            </span>
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30 font-mono">
              Live DB
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
            Deposits & Withdrawals Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-120">
            Audit manual crypto transfers, verify blockchain transaction hashes, and approve capital credits for users.
          </p>
        </div>

        <Button
          onClick={fetchTransactions}
          disabled={loading}
          variant="outline"
          size="sm"
          className="h-9 text-xs gap-1.5 cursor-pointer shrink-0 self-start md:self-center"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Queue
        </Button>
      </div>

      {/* Audit Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        <Card className="p-4 border-border bg-card shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Pending Queue</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">
            {pendingCount} Request{pendingCount === 1 ? "" : "s"}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            ${pendingVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })} total volume
          </p>
        </Card>

        <Card className="p-4 border-border bg-card shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Approved Deposits</span>
            <ArrowDownLeft className="size-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-2">
            ${approvedDepositVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Credited to user balances
          </p>
        </Card>

        <Card className="p-4 border-border bg-card shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Approved Withdrawals</span>
            <ArrowUpRight className="size-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground mt-2">
            ${approvedWithdrawalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            Processed payout volume
          </p>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex p-1 rounded-xl bg-muted border border-border overflow-x-auto max-w-full">
          {[
            { id: "pending", label: `Pending Queue (${pendingCount})` },
            { id: "deposit", label: "Deposits" },
            { id: "withdrawal", label: "Withdrawals" },
            { id: "all", label: "All Transactions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
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
            placeholder="Search user, email, txHash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-card border-border text-foreground w-full"
          />
        </div>
      </div>

      {/* Main Queue Table Card with Full Responsive Horizontal Scroll */}
      <Card className="border-border bg-card shadow-xs overflow-hidden max-w-full">
        <CardHeader className="border-b border-border py-3.5 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-foreground">
            {activeTab === "pending"
              ? "Pending Verification Queue"
              : activeTab === "deposit"
              ? "Deposit History"
              : activeTab === "withdrawal"
              ? "Withdrawal Requests"
              : "Complete Transaction Register"}
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            {filteredTxs.length} item{filteredTxs.length === 1 ? "" : "s"}
          </span>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto w-full max-w-full">
          <Table className="w-full min-w-[780px] whitespace-nowrap">
            <TableHeader>
              <TableRow className="border-border bg-muted/30">
                <TableHead className="text-xs font-bold text-muted-foreground py-3">User Details</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Type</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Asset & Method</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Amount</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">TxID Hash</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3">Status</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="h-14 border-border">
                    <TableCell><Skeleton className="h-8 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTxs.length > 0 ? (
                filteredTxs.map((tx) => {
                  const isDeposit = tx.type.toUpperCase() === "DEPOSIT";
                  const isPending = tx.status.toUpperCase() === "PENDING";
                  const isCompleted = tx.status.toUpperCase() === "COMPLETED";
                  const isProcessing = processingId === tx.id;

                  const txHashDisplay = tx.txHash
                    ? tx.txHash.length > 14
                      ? `${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-4)}`
                      : tx.txHash
                    : "N/A";

                  return (
                    <TableRow key={tx.id} className="border-border hover:bg-muted/40 transition-colors text-xs font-medium">
                      <TableCell className="py-3">
                        <div>
                          <span className="font-bold text-foreground block truncate max-w-[180px]">
                            {tx.user?.name || "Anonymous User"}
                          </span>
                          <span className="text-[11px] text-muted-foreground block truncate max-w-[180px]">
                            {tx.user?.email || tx.userId}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3">
                        <Badge variant="outline" className={`text-[10px] font-semibold ${
                          isDeposit ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-purple-500/10 text-purple-600 border-purple-500/30"
                        }`}>
                          {tx.type}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-3 font-semibold text-foreground">
                        {tx.asset}
                      </TableCell>

                      <TableCell className="py-3 font-bold">
                        <span className={isDeposit ? "text-emerald-500" : "text-foreground"}>
                          {isDeposit ? "+" : "-"}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">
                        {txHashDisplay}
                      </TableCell>

                      <TableCell className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-semibold capitalize border ${
                            isPending
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              : isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                          }`}
                        >
                          {tx.status.toLowerCase()}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedTx(tx)}
                            className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="size-3.5" />
                          </Button>

                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProcessTransaction(tx.id, "REJECTED")}
                                disabled={isProcessing}
                                className="h-7 px-2.5 text-[11px] font-bold text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer gap-1"
                              >
                                {isProcessing ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <X className="size-3" />
                                )}
                                Reject
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => handleProcessTransaction(tx.id, "COMPLETED")}
                                disabled={isProcessing}
                                className="h-7 px-2.5 text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer gap-1 shadow-xs"
                              >
                                {isProcessing ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <Check className="size-3" />
                                )}
                                Approve
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No transactions matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Dialog open={Boolean(selectedTx)} onOpenChange={(o) => !o && setSelectedTx(null)}>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                Transaction Audit Record
              </DialogTitle>
              <DialogDescription className="text-xs">
                Detailed ledger entry for user account verification.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Name:</span>
                  <span className="font-bold text-foreground">{selectedTx.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Email:</span>
                  <span className="font-mono text-foreground">{selectedTx.user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-muted-foreground">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type & Asset:</span>
                  <span className="font-bold text-foreground">{selectedTx.type} ({selectedTx.asset})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-emerald-500">
                    ${selectedTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submission Date:</span>
                  <span>{new Date(selectedTx.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {selectedTx.txHash && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold">TxHash Reference:</span>
                  <div className="flex items-center gap-2 bg-background border border-border p-2 rounded-lg font-mono text-[11px]">
                    <span className="truncate grow select-all">{selectedTx.txHash}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(selectedTx.txHash!)}
                      className="size-6 shrink-0 cursor-pointer"
                    >
                      {copiedHash ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    </Button>
                  </div>
                </div>
              )}

              {selectedTx.address && (
                <div className="space-y-1">
                  <span className="text-muted-foreground font-semibold">Destination Wallet Address:</span>
                  <div className="bg-background border border-border p-2 rounded-lg font-mono text-[11px] select-all">
                    {selectedTx.address}
                  </div>
                </div>
              )}

              {selectedTx.status === "PENDING" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    onClick={() => handleProcessTransaction(selectedTx.id, "REJECTED")}
                    variant="outline"
                    className="flex-1 text-xs h-9 font-bold text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                  >
                    Decline Request
                  </Button>
                  <Button
                    onClick={() => handleProcessTransaction(selectedTx.id, "COMPLETED")}
                    className="flex-1 text-xs h-9 font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    Approve & Credit Balance
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
