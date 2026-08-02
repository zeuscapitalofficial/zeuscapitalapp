"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Cpu,
  DollarSign,
  Layers,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sliders,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface OverviewData {
  metrics: {
    totalUsers: number;
    verifiedUsers: number;
    pendingKyc: number;
    approvedKyc: number;
    rejectedKyc: number;
    openChats: number;
    activeOverrides: number;
    totalBalance: number;
    totalDeposit: number;
    totalProfit: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    balance: number;
    totalDeposit: number;
    createdAt: string;
    kyc?: { status: string } | null;
  }>;
  pendingKycList: Array<{
    id: string;
    userId: string;
    country: string;
    submittedAt: string;
    status: string;
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
  }>;
  recentConversations: Array<{
    id: string;
    subject?: string | null;
    isOpen: boolean;
    lastMessage?: string | null;
    lastAt: string;
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
  }>;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/overview");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load platform analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleRefresh = () => {
    fetchOverview();
    toast.success("Analytics refreshed");
  };

  const metrics = data?.metrics;

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 text-[11px] font-medium"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </Badge>
            <span className="text-xs text-muted-foreground">Admin Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Platform Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time management dashboard for system accounts, compliance
            audits, and financials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2 text-xs h-9 cursor-pointer"
          >
            <RefreshCw
              className={`size-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-accent-foreground text-background hover:bg-accent-foreground/90 gap-1.5 text-xs h-9 cursor-pointer"
          >
            <Link href="/admin/kyc" className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              Review KYC Queue
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Accounts
            </CardTitle>
            <div className="size-8 rounded-lg bg-accent-foreground/10 text-accent-foreground flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : (metrics?.totalUsers ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <UserCheck className="size-3 text-emerald-500 inline" />
              <span>{metrics?.verifiedUsers ?? 0} email verified</span>
            </p>
          </CardContent>
        </Card>

        {/* Total System Deposits & Balance */}
        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total System Deposits
            </CardTitle>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading
                ? "..."
                : `$${(metrics?.totalDeposit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              User Balances: $
              {loading
                ? "..."
                : (metrics?.totalBalance ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
            </p>
          </CardContent>
        </Card>

        {/* Pending KYC Audits */}
        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              KYC Audit Queue
            </CardTitle>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${metrics?.pendingKyc ? "text-amber-500" : "text-foreground"}`}
              >
                {loading ? "..." : (metrics?.pendingKyc ?? 0)}
              </span>
              <span className="text-xs text-muted-foreground">
                pending approval
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.approvedKyc ?? 0} approved · {metrics?.rejectedKyc ?? 0}{" "}
              rejected
            </p>
          </CardContent>
        </Card>

        {/* Open Support Desk */}
        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Support Desk
            </CardTitle>
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <MessageSquare className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : (metrics?.openChats ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Activity className="size-3 text-blue-500 inline" />
              <span>Active support conversations</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Tables for Pending KYC & Recent Users */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex items-center justify-between gap-4 mb-3">
              <TabsList className="bg-muted/60 p-1">
                <TabsTrigger
                  value="recent"
                  className="text-xs font-medium cursor-pointer"
                >
                  Recent Registrations
                </TabsTrigger>
                <TabsTrigger
                  value="kyc"
                  className="text-xs font-medium cursor-pointer relative"
                >
                  KYC Queue
                  {Boolean(metrics?.pendingKyc) && (
                    <Badge className="ml-1.5 h-4 min-w-4 px-1 text-[9px] bg-amber-500 text-white border-none">
                      {metrics?.pendingKyc}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs gap-1 text-muted-foreground hover:text-foreground"
                render={
                  <Link href="/admin/users">
                    View All Users <ArrowRight className="size-3" />
                  </Link>
                }
              ></Button>
            </div>

            {/* Tab 1: Recent Users */}
            <TabsContent value="recent" className="mt-0">
              <Card className="shadow-xs border-border bg-card overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-border">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Latest Platform Registrations</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-normal"
                    >
                      {data?.recentUsers.length ?? 0} recent
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">User</TableHead>
                        <TableHead className="text-xs">Role</TableHead>
                        <TableHead className="text-xs">KYC</TableHead>
                        <TableHead className="text-xs">Balance</TableHead>
                        <TableHead className="text-xs">Total Deposit</TableHead>
                        <TableHead className="text-xs text-right">
                          Registered
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-xs text-muted-foreground"
                          >
                            Loading user records...
                          </TableCell>
                        </TableRow>
                      ) : !data?.recentUsers.length ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-xs text-muted-foreground"
                          >
                            No user registrations found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.recentUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-muted/40">
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <Avatar className="size-7 shrink-0">
                                  <AvatarFallback className="text-[10px]">
                                    {user.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-semibold text-foreground truncate">
                                    {user.name}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground truncate">
                                    {user.email}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  user.role === "ADMIN"
                                    ? "bg-purple-500/15 text-purple-600 border-purple-500/30"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] capitalize ${
                                  user.kyc?.status === "APPROVED"
                                    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                                    : user.kyc?.status === "PENDING"
                                      ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                                      : user.kyc?.status === "REJECTED"
                                        ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                                        : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {user.kyc?.status ?? "NONE"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-medium text-foreground">
                              $
                              {user.balance.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-xs font-medium text-foreground">
                              $
                              {user.totalDeposit.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground text-right">
                              {format(new Date(user.createdAt), "MMM d")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: KYC Queue */}
            <TabsContent value="kyc" className="mt-0">
              <Card className="shadow-xs border-border bg-card overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-border">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Pending Compliance Audits</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 text-accent-foreground"
                      render={
                        <Link href="/admin/kyc">
                          Go to Audit Page{" "}
                          <ArrowRight className="size-3 ml-1" />
                        </Link>
                      }
                    ></Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">Applicant</TableHead>
                        <TableHead className="text-xs">Country</TableHead>
                        <TableHead className="text-xs">Submitted</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-xs text-muted-foreground"
                          >
                            Loading audit queue...
                          </TableCell>
                        </TableRow>
                      ) : !data?.pendingKycList.length ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-xs text-muted-foreground"
                          >
                            No pending KYC applications. All audits are
                            complete.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.pendingKycList.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/40">
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <Avatar className="size-7 shrink-0">
                                  {item.user.image && (
                                    <AvatarImage src={item.user.image} />
                                  )}
                                  <AvatarFallback className="text-[10px]">
                                    {item.user.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-semibold text-foreground truncate">
                                    {item.user.name}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground truncate">
                                    {item.user.email}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-foreground">
                              {item.country}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {format(
                                new Date(item.submittedAt),
                                "MMM d, HH:mm",
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-[10px]"
                              >
                                PENDING
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs cursor-pointer"
                                render={<Link href="/admin/kyc">Review</Link>}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column (4 cols): Quick Controls & Recent Conversations */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Recent Support Desk Conversations */}
          <Card className="shadow-xs border-border bg-card">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="size-4 text-accent-foreground" />
                  Support Desk
                </CardTitle>
                <CardDescription className="text-xs">
                  Active user support threads.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-accent-foreground"
                render={
                  <Link href="/admin/chat">
                    Open Inbox <ArrowUpRight className="size-3 ml-1" />
                  </Link>
                }
              ></Button>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {loading ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Loading chats...
                </p>
              ) : !data?.recentConversations.length ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No active support conversations.
                </p>
              ) : (
                data.recentConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href="/admin/chat"
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:border-accent-foreground/30 hover:bg-muted/40 transition-colors"
                  >
                    <Avatar className="size-8 shrink-0">
                      {conv.user.image && <AvatarImage src={conv.user.image} />}
                      <AvatarFallback className="text-[10px]">
                        {conv.user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {conv.user.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${
                            conv.isOpen
                              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {conv.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
