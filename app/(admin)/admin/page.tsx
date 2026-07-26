"use client";

import {
  Activity,
  Cpu,
  FolderCheck,
  RefreshCw,
  Server,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKyc: 0,
    activeMiners: 42,
    payoutVolume: "$1,482,900",
  });
  const [loading, setLoading] = useState(true);

  // Fetch live stats on load
  async function fetchStats() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error();
      const users = await res.json();

      const pendingKycCount = users.filter(
        (u: any) => u.kyc && u.kyc.status === "PENDING",
      ).length;

      setStats({
        totalUsers: users.length,
        pendingKyc: pendingKycCount,
        activeMiners: 42,
        payoutVolume: "$1,482,900",
      });
    } catch (e) {
      console.error("Failed to load live metrics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSyncMetrics = () => {
    fetchStats();
    toast.success("Platform metrics refreshed.");
  };

  return (
    <div className="flex flex-col gap-lg select-none font-sans text-white bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-[rgba(255,255,255,0.06)] pb-lg">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-semibold text-red-400 uppercase tracking-wider">
            Administrative Level Access
          </span>
          <h1 className="text-[32px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-white animate-fade-in">
            System Overview
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium">
            Manage system hardware clusters, KYC approvals, and mining
            configuration parameters.
          </p>
        </div>
        <Button
          onClick={handleSyncMetrics}
          disabled={loading}
          variant="outline"
          className="border-[rgba(255,255,255,0.06)] bg-[#111114] text-[13px] font-semibold hover:bg-[#1D1D22] h-10 rounded-[14px]"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />{" "}
          Reload System Stats
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mt-xs">
        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between h-[120px]"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total User Profiles
            </span>
            <Users className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold tracking-tight">
              {loading ? "..." : stats.totalUsers}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">
              Registered in DB
            </span>
          </div>
        </Card>

        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between h-[120px]"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Pending KYC Audits
            </span>
            <FolderCheck className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-[28px] font-semibold tracking-tight ${stats.pendingKyc > 0 ? "text-yellow-400" : "text-white"}`}
            >
              {loading ? "..." : stats.pendingKyc}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">
              Require Manual Approval
            </span>
          </div>
        </Card>

        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between h-[120px]"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              ASIC Node Clusters
            </span>
            <Cpu className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold tracking-tight">
              3 / 3 Cluster Arrays
            </span>
            <span className="text-[11px] text-green-400 font-semibold mt-1">
              Uptime: 99.98%
            </span>
          </div>
        </Card>

        <Card
          variant="flat"
          className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col justify-between h-[120px]"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              System Yield Vol
            </span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[28px] font-semibold tracking-tight">
              {stats.payoutVolume}
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">
              ASIC payouts processed
            </span>
          </div>
        </Card>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mt-xs">
        {/* Cluster array monitors (7 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-7 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-md">
            <h3 className="text-[16px] font-semibold text-white">
              System Hardware Nodes
            </h3>
            <span className="text-xs text-zinc-400 font-medium">
              Live stats from Iceland geo array
            </span>
          </div>

          <div className="flex flex-col gap-sm">
            <div className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[14px] flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <Server className="w-5 h-5 text-red-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    ASIC Array Alpha
                  </span>
                  <span className="text-xs text-zinc-500">
                    Antminer S19 Cluster
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold block">110.0 TH/s</span>
                <span className="text-[11px] text-green-400">Online</span>
              </div>
            </div>

            <div className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[14px] flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <Server className="w-5 h-5 text-red-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">ASIC Array Beta</span>
                  <span className="text-xs text-zinc-500">
                    Antminer S21 Cluster
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold block">200.0 TH/s</span>
                <span className="text-[11px] text-green-400">Online</span>
              </div>
            </div>

            <div className="p-md bg-[#09090B] border border-[rgba(255,255,255,0.04)] rounded-[14px] flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <Server className="w-5 h-5 text-red-400" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    ASIC Array Gamma
                  </span>
                  <span className="text-xs text-zinc-500">
                    Whatsminer M50 Cluster
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold block">172.5 TH/s</span>
                <span className="text-[11px] text-green-400">Online</span>
              </div>
            </div>
          </div>
        </Card>

        {/* System logs (5 cols) */}
        <Card
          variant="flat"
          className="lg:col-span-5 p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] flex flex-col gap-md"
        >
          <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.06)] pb-md">
            <h3 className="text-[16px] font-semibold text-white">
              Platform System Logs
            </h3>
            <Activity className="w-4 h-4 text-zinc-500" />
          </div>

          <div className="flex flex-col gap-sm max-h-[220px] overflow-y-auto pr-xs">
            <div className="flex gap-sm text-[12px] border-b border-[rgba(255,255,255,0.02)] pb-xs">
              <span className="text-zinc-500 font-mono">18:04:12</span>
              <span className="text-green-400 font-semibold">[INFO]</span>
              <span className="text-zinc-300">
                ASIC Cluster Gamma difficulty checked.
              </span>
            </div>
            <div className="flex gap-sm text-[12px] border-b border-[rgba(255,255,255,0.02)] pb-xs">
              <span className="text-zinc-500 font-mono">17:51:30</span>
              <span className="text-red-400 font-semibold">[AUTH]</span>
              <span className="text-zinc-300">
                User session tokens scrubbed (expired).
              </span>
            </div>
            <div className="flex gap-sm text-[12px] border-b border-[rgba(255,255,255,0.02)] pb-xs">
              <span className="text-zinc-500 font-mono">16:11:42</span>
              <span className="text-yellow-400 font-semibold">[WARN]</span>
              <span className="text-zinc-300">
                ASIC Alpha node temperature peak alert (71°C).
              </span>
            </div>
            <div className="flex gap-sm text-[12px] border-b border-[rgba(255,255,255,0.02)] pb-xs">
              <span className="text-zinc-500 font-mono">15:02:10</span>
              <span className="text-green-400 font-semibold">[INFO]</span>
              <span className="text-zinc-300">
                Daily BTC mining yield batch dispatched.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
