"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  ListX,
  Search,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatFullCurrency } from "@/components/formatter";

interface Transaction {
  id: string;
  type: string;
  asset: string;
  amount: number;
  txHash?: string | null;
  address?: string | null;
  status: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real user transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to load history transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTxs = transactions.filter((tx) => {
    const matchesFilter =
      filter === "all" || tx.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      tx.asset.toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      (tx.address && tx.address.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["ID", "Type", "Asset", "Amount", "Status", "Date", "Address"];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      t.asset,
      t.amount,
      t.status,
      new Date(t.createdAt).toISOString(),
      t.address || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zeus_capital_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-lg font-sans max-w-7xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md pb-sm border-b border-border/60">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] md:text-[36px] font-bold tracking-tight text-foreground">
            Transaction History
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete audit trail of all deposits, withdrawals, and vault activities.
          </p>
        </div>
        <div className="flex gap-sm">
          <Button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            variant="outline"
            className="text-xs font-semibold h-10 px-md gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-md items-center justify-between">
        {/* Search */}
        <InputGroup className="w-full sm:w-[320px]">
          <InputGroupInput
            id="search"
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="w-4 h-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {filteredTxs.length} {filteredTxs.length === 1 ? "result" : "results"}
          </InputGroupAddon>
        </InputGroup>

        {/* Tab Filters */}
        <div className="flex p-0.5 rounded-md border border-input shadow-xs dark:bg-input/30 w-full sm:w-auto overflow-x-auto">
          {["all", "deposit", "withdrawal", "stock", "crypto", "commodity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all shrink-0 cursor-pointer ${
                filter === tab
                  ? "bg-accent-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All History" : tab + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table Card */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead className="text-xs font-semibold">Activity</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">TxID</TableHead>
                <TableHead className="text-xs font-semibold text-right">Amount</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/40 h-16">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-lg" />
                        <div className="space-y-1">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="w-16 h-3" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="w-16 h-4" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="w-32 h-4" />
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Skeleton className="w-20 h-4 ml-auto" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="w-16 h-5" />
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Skeleton className="w-24 h-4 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTxs.length > 0 ? (
                filteredTxs.map((tx) => {
                  const isDeposit = tx.type.toUpperCase() === "DEPOSIT";
                  const isPending = tx.status.toUpperCase() === "PENDING";
                  const txHashStr = tx.txHash
                    ? tx.txHash.length > 12
                      ? `${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-4)}`
                      : tx.txHash
                    : "N/A";

                  return (
                    <TableRow
                      key={tx.id}
                      className="border-border/40 hover:bg-muted/30 transition-colors text-sm h-16 font-medium"
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isDeposit
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-accent-foreground/10 text-accent-foreground"
                            }`}
                          >
                            {isDeposit ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-xs block text-foreground">
                              {tx.asset}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {tx.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 capitalize text-xs text-foreground font-semibold">
                        {tx.type.toLowerCase()}
                      </TableCell>
                      <TableCell className="py-3 font-mono text-xs text-foreground font-medium">
                        {txHashStr}
                      </TableCell>
                      <TableCell
                        className={`py-3 text-right font-semibold text-xs ${
                          isDeposit ? "text-emerald-500" : "text-foreground"
                        }`}
                      >
                        {isDeposit ? "+" : "-"}{formatFullCurrency(tx.amount)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] gap-1 font-medium capitalize border ${
                            isPending
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              isPending ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                          {tx.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-96 p-0 text-center align-middle">
                    <Empty className="h-full border-none p-6">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <ListX className="w-8 h-8 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>No Transactions Found</EmptyTitle>
                        <EmptyDescription>
                          {search || filter !== "all"
                            ? "No transactions match your current search or filter criteria."
                            : "You don't have any recorded transactions in your history yet."}
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent className="flex-row justify-center gap-2">
                        {(search || filter !== "all") && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearch("");
                              setFilter("all");
                            }}
                          >
                            Reset Filters
                          </Button>
                        )}
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
