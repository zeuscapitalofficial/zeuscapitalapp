"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  AlertTriangle,
  Bell,
  DollarSign,
  Edit3,
  Eye,
  Gift,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  balance: number;
  totalProfit: number;
  totalDeposit: number;
  bonusRewards: number;
  referralCode?: string | null;
  createdAt: string;
  kyc?: {
    status: "APPROVED" | "PENDING" | "REJECTED";
    country?: string;
    phoneNumber?: string;
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [kycFilter, setKycFilter] = useState<string>("ALL");

  // Detailed Profile View Dialog State
  const [inspectUser, setInspectUser] = useState<UserProfile | null>(null);

  // Financial Edit Dialog State
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [editProfit, setEditProfit] = useState("");
  const [editBonus, setEditBonus] = useState("");
  const [editDeposit, setEditDeposit] = useState("");
  const [isSavingFinancials, setIsSavingFinancials] = useState(false);

  // Promotion Safeguard Modal State
  const [promoteTarget, setPromoteTarget] = useState<UserProfile | null>(null);
  const [promoteConfirmName, setPromoteConfirmName] = useState("");
  const [demoteTarget, setDemoteTarget] = useState<UserProfile | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Notification Alert Modal State
  const [alertTarget, setAlertTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("INFO");
  const [isDispatchingAlert, setIsDispatchingAlert] = useState(false);

  // Portfolio Override Modal State
  const [portfolioTarget, setPortfolioTarget] = useState<UserProfile | null>(
    null,
  );
  const [userPortfolioItems, setUserPortfolioItems] = useState<any[]>([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<any | null>(
    null,
  );
  const [editPortfolioQty, setEditPortfolioQty] = useState("");
  const [editPortfolioPrice, setEditPortfolioPrice] = useState("");
  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);

  // New Asset Form
  const [newSymbol, setNewSymbol] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("crypto");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const fetchUserPortfolio = async (userId: string) => {
    try {
      setIsLoadingPortfolio(true);
      const res = await fetch(`/api/admin/portfolio?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserPortfolioItems(data.items || []);
      }
    } catch (err) {
      toast.error("Failed to load user portfolio");
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  const openPortfolioModal = (user: UserProfile) => {
    setPortfolioTarget(user);
    setEditingPortfolioItem(null);
    fetchUserPortfolio(user.id);
  };

  const handleSavePortfolioItem = async (itemId?: string) => {
    if (!portfolioTarget) return;
    setIsSavingPortfolio(true);

    try {
      let body: any = {};
      if (itemId) {
        body = {
          itemId,
          quantity: editPortfolioQty,
          currentPrice: editPortfolioPrice,
        };
      } else {
        if (!newSymbol || !newName || !newQty || !newPrice) {
          toast.error("Please fill in all asset fields");
          setIsSavingPortfolio(false);
          return;
        }
        body = {
          userId: portfolioTarget.id,
          symbol: newSymbol,
          name: newName,
          category: newCategory,
          quantity: newQty,
          currentPrice: newPrice,
          avgBuyPrice: newPrice,
        };
      }

      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Save failed");
      }

      toast.success("User portfolio updated successfully!");
      setEditingPortfolioItem(null);
      setNewSymbol("");
      setNewName("");
      setNewQty("");
      setNewPrice("");
      fetchUserPortfolio(portfolioTarget.id);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to save portfolio override");
    } finally {
      setIsSavingPortfolio(false);
    }
  };

  // Load database users
  async function loadUsers() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to query user database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered User List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

      const userKycStatus = u.kyc?.status ?? "NONE";
      const matchesKyc = kycFilter === "ALL" || userKycStatus === kycFilter;

      return matchesSearch && matchesRole && matchesKyc;
    });
  }, [users, searchQuery, roleFilter, kycFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const verified = users.filter((u) => u.emailVerified).length;
    const totalDeposits = users.reduce(
      (acc, u) => acc + (u.totalDeposit || 0),
      0,
    );
    return { total, admins, verified, totalDeposits };
  }, [users]);

  // Execute Role Promotion / Demotion
  const executeRoleChange = async (
    userId: string,
    newRole: "ADMIN" | "USER",
  ) => {
    setIsUpdatingRole(true);
    const toastId = toast.loading(`Updating privileges...`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success(
        `User profile successfully ${newRole === "ADMIN" ? "promoted to Admin" : "demoted to User"}!`,
        { id: toastId },
      );

      setPromoteTarget(null);
      setPromoteConfirmName("");
      setDemoteTarget(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to update user role.", { id: toastId });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Open Edit Financials Modal
  const openEditFinancials = (user: UserProfile) => {
    setEditUser(user);
    setEditBalance(String(user.balance ?? 0));
    setEditProfit(String(user.totalProfit ?? 0));
    setEditBonus(String(user.bonusRewards ?? 0));
    setEditDeposit(String(user.totalDeposit ?? 0));
  };

  // Execute Financial Adjustments
  const handleSaveFinancials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    setIsSavingFinancials(true);
    const toastId = toast.loading("Updating financial balances...");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editUser.id,
          balance: parseFloat(editBalance) || 0,
          totalProfit: parseFloat(editProfit) || 0,
          bonusRewards: parseFloat(editBonus) || 0,
          totalDeposit: parseFloat(editDeposit) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update balances");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editUser.id
            ? {
                ...u,
                balance: parseFloat(editBalance) || 0,
                totalProfit: parseFloat(editProfit) || 0,
                bonusRewards: parseFloat(editBonus) || 0,
                totalDeposit: parseFloat(editDeposit) || 0,
              }
            : u,
        ),
      );

      toast.success("User financial balances updated successfully!", {
        id: toastId,
      });
      setEditUser(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to save financial parameters.", {
        id: toastId,
      });
    } finally {
      setIsSavingFinancials(false);
    }
  };

  // Send Notification Alert
  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim() || !alertTarget) {
      toast.error("Please fill out title and message.");
      return;
    }

    setIsDispatchingAlert(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: alertTarget.id,
          title: alertTitle.trim(),
          message: alertMessage.trim(),
          type: alertType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send alert");

      toast.success(`Alert successfully dispatched to ${alertTarget.name}`);
      setAlertTarget(null);
      setAlertTitle("");
      setAlertMessage("");
      setAlertType("INFO");
    } catch (e: any) {
      toast.error(e.message || "Failed to dispatch alert.");
    } finally {
      setIsDispatchingAlert(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            User Accounts & Control
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Full user directory, financial adjustments, access role management,
            and direct notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            disabled={loading}
            className="gap-2 text-xs h-9 cursor-pointer"
          >
            <RefreshCw
              className={`size-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Sync Database
          </Button>

          <Button
            size="sm"
            onClick={() =>
              setAlertTarget({ id: "ALL", name: "All Registered Users" })
            }
            className="bg-accent-foreground text-background hover:bg-accent-foreground/90 gap-2 text-xs h-9 cursor-pointer"
          >
            <Bell className="size-3.5" />
            Broadcast Announcement
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              {loading ? "..." : metrics.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active accounts in database
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admins & Staff
            </CardTitle>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {loading ? "..." : metrics.admins}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Elevated access privileges
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email Verified
            </CardTitle>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <UserCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? "..." : metrics.verified}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.total > 0
                ? `${Math.round((metrics.verified / metrics.total) * 100)}% verification rate`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System Capital Deposited
            </CardTitle>
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading
                ? "..."
                : `$${metrics.totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cumulative deposit volume
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Users Table Card */}
      <Card className="shadow-xs border-border bg-card overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="size-4 text-accent-foreground" />
                User Directory
              </CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredUsers.length} of {users.length} registered
                accounts.
              </CardDescription>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>

              <Select
                value={roleFilter}
                onValueChange={(val) => val && setRoleFilter(val)}
              >
                <SelectTrigger className="h-8 text-xs w-28 bg-background">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={kycFilter}
                onValueChange={(val) => val && setKycFilter(val)}
              >
                <SelectTrigger className="h-8 text-xs w-32 bg-background">
                  <SelectValue placeholder="KYC Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All KYC</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="NONE">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">User Profile</TableHead>
                <TableHead className="text-xs">Account ID</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">KYC Status</TableHead>
                <TableHead className="text-xs">Balance</TableHead>
                <TableHead className="text-xs">Total Deposit</TableHead>
                <TableHead className="text-xs">Joined</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-xs text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="size-4 rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground animate-spin" />
                      Loading user records...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-xs text-muted-foreground"
                  >
                    No matching users found for your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 shrink-0">
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

                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {user.id.slice(0, 10)}...
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/15 text-purple-600 border-purple-500/30 font-semibold"
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

                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                              User Controls
                            </DropdownMenuLabel>

                            <DropdownMenuItem
                              onClick={() => setInspectUser(user)}
                              className="text-xs gap-2 cursor-pointer"
                            >
                              <Eye className="size-3.5 text-blue-500" />
                              View Full Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => openEditFinancials(user)}
                              className="text-xs gap-2 cursor-pointer"
                            >
                              <Edit3 className="size-3.5 text-emerald-500" />
                              Adjust Balances
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => openPortfolioModal(user)}
                              className="text-xs gap-2 cursor-pointer"
                            >
                              <ShoppingBag className="size-3.5 text-purple-500" />
                              Manage User Portfolio
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                setAlertTarget({ id: user.id, name: user.name })
                              }
                              className="text-xs gap-2 cursor-pointer"
                            >
                              <Bell className="size-3.5 text-amber-500" />
                              Send Notification
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-xs gap-2 cursor-pointer"
                              render={
                                <Link href="/admin/chat">
                                  <MessageSquare className="size-3.5 text-sky-500" />
                                  View Support Chat
                                </Link>
                              }
                            ></DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {user.role === "USER" ? (
                              <DropdownMenuItem
                                onClick={() => {
                                  setPromoteTarget(user);
                                  setPromoteConfirmName("");
                                }}
                                className="text-xs gap-2 text-purple-600 font-semibold cursor-pointer"
                              >
                                <ShieldCheck className="size-3.5" />
                                Promote to Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => setDemoteTarget(user)}
                                className="text-xs gap-2 text-rose-600 font-semibold cursor-pointer"
                              >
                                <UserX className="size-3.5" />
                                Demote to User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── 1. FULL USER PROFILE INSPECTION DIALOG ── */}
      <Dialog
        open={Boolean(inspectUser)}
        onOpenChange={(open) => !open && setInspectUser(null)}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="size-5 text-blue-500" />
              Detailed User Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Complete account details and compliance summary.
            </DialogDescription>
          </DialogHeader>

          {inspectUser && (
            <div className="flex flex-col gap-4 py-2 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <Avatar className="size-12">
                  <AvatarFallback className="text-sm font-bold">
                    {inspectUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">
                      {inspectUser.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        inspectUser.role === "ADMIN"
                          ? "bg-purple-500/15 text-purple-600 border-purple-500/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {inspectUser.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {inspectUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <DollarSign className="size-3 text-emerald-500" /> Available
                    Balance
                  </span>
                  <p className="text-base font-bold text-foreground">
                    $
                    {inspectUser.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <DollarSign className="size-3 text-blue-500" /> Total
                    Deposited
                  </span>
                  <p className="text-base font-bold text-foreground">
                    $
                    {inspectUser.totalDeposit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <TrendingUp className="size-3 text-purple-500" /> Total
                    Profit
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    $
                    {(inspectUser.totalProfit ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <Gift className="size-3 text-amber-500" /> Bonus Rewards
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    $
                    {(inspectUser.bonusRewards ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Account ID:</span>
                  <span className="font-mono text-foreground select-all">
                    {inspectUser.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Email Status:</span>
                  <Badge
                    variant="outline"
                    className={
                      inspectUser.emailVerified
                        ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                        : "text-muted-foreground"
                    }
                  >
                    {inspectUser.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">KYC Compliance:</span>
                  <Badge variant="outline" className="capitalize">
                    {inspectUser.kyc?.status ?? "NONE"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">
                    Registration Date:
                  </span>
                  <span className="text-foreground">
                    {format(new Date(inspectUser.createdAt), "PPP")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectUser(null)}
              className="text-xs h-9"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const u = inspectUser;
                setInspectUser(null);
                if (u) openEditFinancials(u);
              }}
              className="bg-accent-foreground text-background text-xs h-9 gap-1.5 cursor-pointer"
            >
              <Edit3 className="size-3.5" /> Adjust Balances
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 2. EDIT FINANCIAL BALANCES DIALOG ── */}
      <Dialog
        open={Boolean(editUser)}
        onOpenChange={(open) => !open && setEditUser(null)}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit3 className="size-5 text-emerald-500" />
              Adjust User Financials
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify account balances for{" "}
              <strong className="text-foreground">{editUser?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          {editUser && (
            <form
              onSubmit={handleSaveFinancials}
              className="flex flex-col gap-4 py-2"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="balance" className="text-xs font-semibold">
                    Available Balance ($)
                  </Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="totalDeposit"
                    className="text-xs font-semibold"
                  >
                    Total Deposited ($)
                  </Label>
                  <Input
                    id="totalDeposit"
                    type="number"
                    step="0.01"
                    value={editDeposit}
                    onChange={(e) => setEditDeposit(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="totalProfit"
                    className="text-xs font-semibold"
                  >
                    Total Profit ($)
                  </Label>
                  <Input
                    id="totalProfit"
                    type="number"
                    step="0.01"
                    value={editProfit}
                    onChange={(e) => setEditProfit(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="bonusRewards"
                    className="text-xs font-semibold"
                  >
                    Bonus Rewards ($)
                  </Label>
                  <Input
                    id="bonusRewards"
                    type="number"
                    step="0.01"
                    value={editBonus}
                    onChange={(e) => setEditBonus(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-1 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditUser(null)}
                  className="text-xs h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSavingFinancials}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 gap-1.5 cursor-pointer"
                >
                  {isSavingFinancials ? "Saving..." : "Save Financial Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── 3. PROMOTION CONFIRMATION SAFEGUARD DIALOG ── */}
      <Dialog
        open={Boolean(promoteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setPromoteTarget(null);
            setPromoteConfirmName("");
          }
        }}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-purple-600">
              <ShieldCheck className="size-5" />
              Confirm Administrative Promotion
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Promoting a user grants full administrative control over all
              platform records, user accounts, and financials.
            </DialogDescription>
          </DialogHeader>

          {promoteTarget && (
            <div className="flex flex-col gap-4 py-2">
              <Alert
                variant="destructive"
                className="bg-amber-500/10 border-amber-500/30 text-amber-600 text-xs"
              >
                <AlertTriangle className="size-4 text-amber-500" />
                <AlertTitle className="text-xs font-bold text-amber-600">
                  Security Safeguard
                </AlertTitle>
                <AlertDescription className="text-[11px] text-amber-600/90 mt-0.5">
                  To prevent accidental promotions, please type the user's full
                  name{" "}
                  <strong className="font-bold underline">
                    {promoteTarget.name}
                  </strong>{" "}
                  to verify.
                </AlertDescription>
              </Alert>

              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <Avatar className="size-10">
                  <AvatarFallback className="text-xs font-bold">
                    {promoteTarget.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {promoteTarget.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {promoteTarget.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="confirm-name"
                  className="text-xs font-semibold text-foreground"
                >
                  Type "{promoteTarget.name}" to confirm:
                </Label>
                <Input
                  id="confirm-name"
                  type="text"
                  placeholder={promoteTarget.name}
                  value={promoteConfirmName}
                  onChange={(e) => setPromoteConfirmName(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPromoteTarget(null);
                setPromoteConfirmName("");
              }}
              className="text-xs h-9 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={
                !promoteTarget ||
                promoteConfirmName.trim() !== promoteTarget.name ||
                isUpdatingRole
              }
              onClick={() => {
                if (promoteTarget) {
                  executeRoleChange(promoteTarget.id, "ADMIN");
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUpdatingRole ? "Promoting..." : "Confirm Promotion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 4. DEMOTION CONFIRMATION DIALOG ── */}
      <Dialog
        open={Boolean(demoteTarget)}
        onOpenChange={(open) => {
          if (!open) setDemoteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
              <UserX className="size-5" />
              Confirm Administrative Demotion
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to revoke administrative access for{" "}
              <strong className="text-foreground">{demoteTarget?.name}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDemoteTarget(null)}
              className="text-xs h-9 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={isUpdatingRole}
              onClick={() => {
                if (demoteTarget) {
                  executeRoleChange(demoteTarget.id, "USER");
                }
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 cursor-pointer"
            >
              {isUpdatingRole ? "Demoting..." : "Demote to User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 5. ALERT DISPATCHER DIALOG ── */}
      <Dialog
        open={Boolean(alertTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setAlertTarget(null);
            setAlertTitle("");
            setAlertMessage("");
            setAlertType("INFO");
          }
        }}
      >
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="size-5 text-amber-500" />
              Dispatch Notification Alert
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Target Recipient:{" "}
              <strong className="text-foreground">{alertTarget?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendAlert} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="alert-type"
                className="text-xs font-semibold text-foreground"
              >
                Notification Type
              </Label>
              <Select
                value={alertType}
                onValueChange={(value) => setAlertType(value ?? "INFO")}
              >
                <SelectTrigger id="alert-type" className="text-xs h-9">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">INFO (Standard update)</SelectItem>
                  <SelectItem value="SECURITY">
                    SECURITY (Access alert)
                  </SelectItem>
                  <SelectItem value="DEPOSIT">
                    DEPOSIT (Financial update)
                  </SelectItem>
                  <SelectItem value="WARNING">
                    WARNING (Compliance alert)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="alert-title"
                className="text-xs font-semibold text-foreground"
              >
                Title
              </Label>
              <Input
                id="alert-title"
                type="text"
                required
                placeholder="e.g. Account Review Complete"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="alert-message"
                className="text-xs font-semibold text-foreground"
              >
                Message Payload
              </Label>
              <Textarea
                id="alert-message"
                required
                rows={4}
                placeholder="Type the message body to dispatch..."
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-1 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAlertTarget(null)}
                className="text-xs h-9 cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isDispatchingAlert}
                className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer"
              >
                <Send className="size-3.5" />
                {isDispatchingAlert ? "Sending..." : "Dispatch Alert"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 6. ADMIN PORTFOLIO OVERRIDE DIALOG ── */}
      <Dialog
        open={Boolean(portfolioTarget)}
        onOpenChange={(open) => {
          if (!open) setPortfolioTarget(null);
        }}
      >
        <DialogContent className="max-w-120 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ShoppingBag className="size-5 text-purple-500" />
              Manage User Portfolio ({portfolioTarget?.name})
            </DialogTitle>
            <DialogDescription className="text-xs">
              View, edit quantities, and overwrite current token/share values
              for user account {portfolioTarget?.email}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Holdings Table */}
            <div className="border border-border rounded-lg overflow-x-auto max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/40">
                    <TableHead className="text-[11px] font-bold py-2">
                      Asset
                    </TableHead>
                    <TableHead className="text-[11px] font-bold py-2">
                      Category
                    </TableHead>
                    <TableHead className="text-[11px] font-bold py-2">
                      Quantity
                    </TableHead>
                    <TableHead className="text-[11px] font-bold py-2">
                      Current Price
                    </TableHead>
                    <TableHead className="text-[11px] font-bold py-2">
                      Total Value
                    </TableHead>
                    <TableHead className="text-[11px] font-bold py-2 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoadingPortfolio ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-6 text-center text-xs text-muted-foreground"
                      >
                        Loading user portfolio holdings...
                      </TableCell>
                    </TableRow>
                  ) : userPortfolioItems.length > 0 ? (
                    userPortfolioItems.map((item) => {
                      const isEditing = editingPortfolioItem?.id === item.id;

                      return (
                        <TableRow
                          key={item.id}
                          className="border-border text-xs"
                        >
                          <TableCell className="font-bold py-2">
                            {item.name} ({item.symbol})
                          </TableCell>
                          <TableCell className="capitalize py-2 text-muted-foreground">
                            {item.category}
                          </TableCell>
                          <TableCell className="py-2 font-mono">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editPortfolioQty}
                                onChange={(e) =>
                                  setEditPortfolioQty(e.target.value)
                                }
                                className="h-7 w-24 text-xs font-mono"
                              />
                            ) : (
                              item.quantity.toLocaleString()
                            )}
                          </TableCell>
                          <TableCell className="py-2 font-mono">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editPortfolioPrice}
                                onChange={(e) =>
                                  setEditPortfolioPrice(e.target.value)
                                }
                                className="h-7 w-24 text-xs font-mono"
                              />
                            ) : (
                              `$${item.currentPrice.toLocaleString()}`
                            )}
                          </TableCell>
                          <TableCell className="py-2 font-bold font-mono text-emerald-500">
                            $
                            {(item.quantity * item.currentPrice).toLocaleString(
                              undefined,
                              { minimumFractionDigits: 2 },
                            )}
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            {isEditing ? (
                              <Button
                                size="sm"
                                onClick={() => handleSavePortfolioItem(item.id)}
                                disabled={isSavingPortfolio}
                                className="h-7 px-2.5 text-[11px] font-bold bg-emerald-600 text-white cursor-pointer"
                              >
                                Save
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingPortfolioItem(item);
                                  setEditPortfolioQty(item.quantity.toString());
                                  setEditPortfolioPrice(
                                    item.currentPrice.toString(),
                                  );
                                }}
                                className="h-7 px-2 text-[11px] font-semibold cursor-pointer"
                              >
                                Override
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-6 text-center text-xs text-muted-foreground"
                      >
                        User owns no portfolio assets. Add an asset below!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Grant / Add New Asset for User */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-3">
              <span className="font-bold text-xs text-foreground block">
                Grant / Add New Asset Entry directly to User Portfolio:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Input
                  placeholder="Symbol (BTC)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="h-8 text-xs font-mono uppercase"
                />
                <Input
                  placeholder="Name (Bitcoin)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-8 text-xs"
                />
                <Select
                  value={newCategory}
                  onValueChange={(v) => v && setNewCategory(v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="commodity">Commodity</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
                <Input
                  type="number"
                  placeholder="Price (USD)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <Button
                size="sm"
                onClick={() => handleSavePortfolioItem()}
                disabled={isSavingPortfolio}
                className="w-full h-8 text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
              >
                {isSavingPortfolio
                  ? "Granting..."
                  : "Add Asset to User Portfolio"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
