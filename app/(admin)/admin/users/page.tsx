"use client";

import {
  Loader2,
  RefreshCw,
  Search,
  UserCheck,
  UserMinus,
  Bell,
  X,
  Send
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  kyc: {
    status: string;
  } | null;
}

export default function UserRegistryPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Notification States
  const [alertUserId, setAlertUserId] = useState<string | null>(null);
  const [alertUserName, setAlertUserName] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("INFO");
  const [dispatching, setDispatching] = useState(false);

  // Fetch users from API
  async function loadUsers() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load user records");
      const data = await res.json();
      setUsers(data);
    } catch (e: any) {
      toast.error(e.message || "Could not query registered users database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Update user role handler
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const toastId = toast.loading(`Updating user privileges to ${newRole}...`);
    try {
      setUpdatingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success("User privilege profile updated successfully!", {
        id: toastId,
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to modify role.", { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim() || !alertUserId) {
      toast.error("Please fill in all alert parameters.");
      return;
    }

    setDispatching(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: alertUserId,
          title: alertTitle.trim(),
          message: alertMessage.trim(),
          type: alertType
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch notification");
      }

      toast.success(`Alert successfully sent to ${alertUserName}`);
      setAlertUserId(null);
      setAlertTitle("");
      setAlertMessage("");
      setAlertType("INFO");
    } catch (e: any) {
      toast.error(e.message || "Failed to dispatch alert.");
    } finally {
      setDispatching(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Ledger & Accounts
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white">
            User Registry
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Search users, adjust system access roles, view compliance states,
            and verify registry audit logs.
          </p>
        </div>
        
        <div className="flex gap-sm items-center">
          <Button
            onClick={() => {
              setAlertUserId("ALL");
              setAlertUserName("All Registered Users");
            }}
            className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] px-md flex items-center gap-xs cursor-pointer"
          >
            <Bell className="w-4 h-4" /> Broadcast Announcement
          </Button>

          <Button
            onClick={loadUsers}
            disabled={loading}
            variant="outline"
            className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Sync User Registry
          </Button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-md items-center justify-between">
        <div className="flex items-center gap-xs bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-3 py-2 w-full sm:w-[320px]">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-[13px] text-white focus:outline-none placeholder-zinc-500 w-full"
          />
        </div>
        <div className="text-[13px] text-zinc-500 font-semibold">
          Active users count: {filteredUsers.length}
        </div>
      </div>

      {/* Main Table Card */}
      <Card
        variant="flat"
        className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.04)] text-[12px] font-semibold text-zinc-500 uppercase tracking-wider h-[40px]">
                <th className="py-2 pr-4">User Details</th>
                <th className="py-2 px-4">Account ID</th>
                <th className="py-2 px-4">System Role</th>
                <th className="py-2 px-4">KYC State</th>
                <th className="py-2 px-4">Register Date</th>
                <th className="py-2 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-zinc-400 text-sm"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#8B7CFF]" />
                    Querying records...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.01)] transition-colors text-[14px] h-[56px] font-medium"
                  >
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white block">
                        {user.name}
                      </span>
                      <span className="text-[12px] text-zinc-500 block">
                        {user.email}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[13px] text-zinc-400">
                      {user.id}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[99px] text-[12px] font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-zinc-500/10 text-zinc-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-xs px-2.5 py-0.5 rounded-[99px] text-[12px] font-semibold ${
                          user.kyc?.status === "APPROVED"
                            ? "bg-green-500/10 text-green-400"
                            : user.kyc?.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : user.kyc?.status === "REJECTED"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-zinc-500/10 text-zinc-400"
                        }`}
                      >
                        {user.kyc?.status || "UNVERIFIED"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <div className="flex gap-xs justify-end items-center">
                        <button
                          onClick={() => {
                            setAlertUserId(user.id);
                            setAlertUserName(user.name);
                          }}
                          className="text-xs h-8 bg-[#8B7CFF]/10 border border-[#8B7CFF]/20 hover:bg-[#8B7CFF]/20 text-[#8B7CFF] rounded-[10px] px-3 font-semibold cursor-pointer transition-colors"
                        >
                          Send Alert
                        </button>

                        <Button
                          onClick={() => handleToggleRole(user.id, user.role)}
                          disabled={updatingId !== null}
                          variant="ghost"
                          className="text-xs h-8 bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] hover:bg-[#27272D] text-white rounded-[10px] px-3 font-semibold"
                        >
                          {user.role === "ADMIN" ? (
                            <>
                              <UserMinus className="w-3.5 h-3.5 mr-1" /> Demote
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 mr-1" /> Promote
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-zinc-400 text-[14px]"
                  >
                    No accounts registered in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-in Alert Dispatcher Modal Overlay */}
      {alertUserId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <Card className="w-full max-w-[480px] bg-[#111114] border border-[rgba(255,255,255,0.08)] p-lg rounded-[24px] shadow-2xl flex flex-col gap-md text-left">
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-xs">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B7CFF]">
                  Alert Dispatcher
                </span>
                <span className="text-[16px] font-semibold text-white truncate max-w-[320px]">
                  Recipient: {alertUserName}
                </span>
              </div>
              <button 
                onClick={() => setAlertUserId(null)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendAlert} className="flex flex-col gap-md mt-xs">
              <div className="flex flex-col gap-xs">
                <Label htmlFor="alert-type" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Notification Type
                </Label>
                <select
                  id="alert-type"
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#1D1D22] text-sm h-10 px-sm text-white focus:outline-none focus:border-[#8B7CFF]"
                >
                  <option value="INFO">INFO (Standard alert)</option>
                  <option value="SECURITY">SECURITY (Access/compliance)</option>
                  <option value="DEPOSIT">DEPOSIT (Funding updates)</option>
                  <option value="WARNING">WARNING (Risk alert)</option>
                </select>
              </div>

              <div className="flex flex-col gap-xs">
                <Label htmlFor="alert-title" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Title
                </Label>
                <Input
                  id="alert-title"
                  type="text"
                  required
                  placeholder="e.g. ASIC payout credited"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  className="rounded-[12px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 placeholder-zinc-500"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <Label htmlFor="alert-message" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Message Body
                </Label>
                <textarea
                  id="alert-message"
                  required
                  rows={4}
                  placeholder="Type the notification payload details..."
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-transparent text-sm p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B7CFF] resize-none font-sans"
                />
              </div>

              <div className="flex gap-sm justify-end mt-sm">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAlertUserId(null)}
                  className="border-[rgba(255,255,255,0.06)] bg-[#1D1D22] text-[13px] font-semibold hover:bg-[#27272D] h-10 rounded-[12px] px-md"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={dispatching}
                  className="bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[12px] px-lg flex items-center justify-center gap-xs cursor-pointer"
                >
                  {dispatching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Dispatch Alert
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
