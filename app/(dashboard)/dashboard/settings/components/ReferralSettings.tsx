"use client";

import { useState, useEffect } from "react";
import { Loader2, Copy, Users, TrendingUp, DollarSign, Link2, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface ReferralStats {
  code: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
}

interface ReferralUser {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: "active" | "inactive";
  totalDeposits: number;
  yourEarnings: number;
}

interface ReferralEarning {
  id: string;
  referralId: string;
  referralName: string;
  amount: number;
  currency: string;
  type: "deposit_bonus" | "mining_commission" | "trading_fee";
  status: "pending" | "paid";
  createdAt: string;
}

export function ReferralSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "referrals" | "earnings">("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [statsRes, referralsRes, earningsRes] = await Promise.all([
        fetch("/api/user/settings/referral/stats"),
        fetch("/api/user/settings/referral/users"),
        fetch("/api/user/settings/referral/earnings"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (referralsRes.ok) {
        const data = await referralsRes.json();
        setReferrals(data.referrals || []);
      }
      if (earningsRes.ok) {
        const data = await earningsRes.json();
        setEarnings(data.earnings || []);
      }
    } catch (error) {
      console.error("Failed to fetch referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (stats?.code) {
      navigator.clipboard.writeText(stats.code);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (stats?.code) {
      const link = `${window.location.origin}/register?ref=${stats.code}`;
      navigator.clipboard.writeText(link);
      toast.success("Referral link copied!");
    }
  };

  if (loading) {
    return (
      <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] max-w-[620px]">
        <div className="flex items-center justify-center py-xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#8B7CFF]" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-lg max-w-[620px]">
      {/* Referral Code Banner */}
      <Card variant="flat" className="p-lg bg-gradient-to-r from-[#8B7CFF]/20 to-[#6B5BEA]/20 border border-[#8B7CFF]/30 rounded-[20px] max-w-[620px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-md">
            <div className="bg-[#8B7CFF]/30 p-3 rounded-[14px]">
              <Link2 className="w-6 h-6 text-[#8B7CFF]" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-white">Your Referral Code</h3>
              <p className="text-[13px] text-[rgba(255,255,255,0.6)]">Share this code to earn rewards</p>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <div className="bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-md py-sm flex items-center gap-sm">
              <span className="text-[18px] font-mono font-bold text-white tracking-widest">{stats?.code || "LOADING"}</span>
              <Button variant="ghost" size="sm" onClick={handleCopyCode} className="h-8">
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-8 rounded-[10px] border-[rgba(255,255,255,0.06)] bg-[#111114] text-[12px] font-semibold hover:bg-[#1D1D22]">
              Copy Link
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md max-w-[620px]">
        <StatCard icon={Users} value={stats?.totalReferrals || 0} label="Total Referrals" color="blue" />
        <StatCard icon={Users} value={stats?.activeReferrals || 0} label="Active Referrals" color="green" />
        <StatCard icon={DollarSign} value={`$${(stats?.totalEarnings || 0).toLocaleString()}`} label="Total Earnings" color="purple" />
        <StatCard icon={TrendingUp} value={`$${(stats?.thisMonthEarnings || 0).toLocaleString()}`} label="This Month" color="orange" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-[620px]">
        <TabsList className="bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[14px] p-1">
          <TabsTrigger value="overview" className="px-4 py-2 text-[13px] font-semibold rounded-[10px]">Overview</TabsTrigger>
          <TabsTrigger value="referrals" className="px-4 py-2 text-[13px] font-semibold rounded-[10px]">My Referrals</TabsTrigger>
          <TabsTrigger value="earnings" className="px-4 py-2 text-[13px] font-semibold rounded-[10px]">Earnings History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-lg mt-md">
          <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px]">
            <h4 className="text-[16px] font-semibold text-white mb-md">How It Works</h4>
            <div className="space-y-md text-[14px] text-[rgba(255,255,255,0.72)]">
              <div className="flex items-start gap-sm p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
                <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px] flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#8B7CFF]" />
                </div>
                <div>
                  <p className="font-medium text-white">Share Your Code</p>
                  <p>Give your referral code to friends. They enter it during signup.</p>
                </div>
              </div>
              <div className="flex items-start gap-sm p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
                <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px] flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#8B7CFF]" />
                </div>
                <div>
                  <p className="font-medium text-white">They Start Mining</p>
                  <p>When they purchase a mining plan, you earn a commission.</p>
                </div>
              </div>
              <div className="flex items-start gap-sm p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
                <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px] flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#8B7CFF]" />
                </div>
                <div>
                  <p className="font-medium text-white">Earn Ongoing Rewards</p>
                  <p>Receive 10% of their mining rewards + 5% deposit bonus for life.</p>
                </div>
              </div>
              <div className="flex items-start gap-sm p-md bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
                <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px] flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#8B7CFF]" />
                </div>
                <div>
                  <p className="font-medium text-white">Track & Withdraw</p>
                  <p>Monitor earnings in real-time. Withdraw anytime to your wallet.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px]">
            <h4 className="text-[16px] font-semibold text-white mb-md">Your Referral Link</h4>
            <div className="bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px] p-md">
              <code className="text-[13px] font-mono text-white break-all">
                {window.location.origin}/register?ref={stats?.code}
              </code>
            </div>
            <p className="text-[12px] text-[rgba(255,255,255,0.48)] mt-sm">Share this link directly - it auto-fills your code on signup</p>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-lg mt-md">
          {referrals.length === 0 ? (
            <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center">
              <Users className="w-12 h-12 mx-auto mb-sm text-[rgba(255,255,255,0.2)]" />
              <p className="text-[14px] text-[rgba(255,255,255,0.48)]">No referrals yet</p>
              <p className="text-[12px] text-[rgba(255,255,255,0.32)] mt-xs">Share your code to start building your network</p>
            </Card>
          ) : (
            <div className="space-y-sm">
              {referrals.map(ref => (
                <Card key={ref.id} variant="flat" className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[16px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-md">
                      <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px]">
                        <Users className="w-5 h-5 text-[#8B7CFF]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-white">{ref.name}</p>
                        <p className="text-[12px] text-[rgba(255,255,255,0.48)]">{ref.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md text-right">
                      <div>
                        <p className="text-[12px] text-[rgba(255,255,255,0.48)]">Joined</p>
                        <p className="text-[13px] font-medium text-white">{new Date(ref.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[12px] text-[rgba(255,255,255,0.48)]">Your Earnings</p>
                        <p className="text-[13px] font-medium text-green-400">${ref.yourEarnings.toLocaleString()}</p>
                      </div>
                      <span className={`inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[10px] font-semibold ${ref.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {ref.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="earnings" className="space-y-lg mt-md">
          {earnings.length === 0 ? (
            <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-sm text-[rgba(255,255,255,0.2)]" />
              <p className="text-[14px] text-[rgba(255,255,255,0.48)]">No earnings yet</p>
              <p className="text-[12px] text-[rgba(255,255,255,0.32)] mt-xs">Earnings will appear here when your referrals start mining</p>
            </Card>
          ) : (
            <div className="space-y-sm">
              {earnings.map(earning => (
                <Card key={earning.id} variant="flat" className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[16px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-md">
                      <div className={`bg-${earning.type === "deposit_bonus" ? "blue" : earning.type === "mining_commission" ? "purple" : "green"}-500/20 p-2 rounded-[10px]`}>
                        {earning.type === "deposit_bonus" && <DollarSign className="w-5 h-5 text-blue-400" />}
                        {earning.type === "mining_commission" && <TrendingUp className="w-5 h-5 text-purple-400" />}
                        {earning.type === "trading_fee" && <DollarSign className="w-5 h-5 text-green-400" />}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-white">{earning.referralName}</p>
                        <p className="text-[12px] text-[rgba(255,255,255,0.48)] capitalize">{earning.type.replace("_", " ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md text-right">
                      <div>
                        <p className="text-[12px] text-[rgba(255,255,255,0.48)]">Amount</p>
                        <p className="text-[14px] font-semibold text-white">{earning.amount} {earning.currency}</p>
                      </div>
                      <div>
                        <p className="text-[12px] text-[rgba(255,255,255,0.48)]">Date</p>
                        <p className="text-[13px] font-medium text-white">{new Date(earning.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[10px] font-semibold ${earning.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                        {earning.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: React.ComponentType<{ className?: string }>; value: string | number; label: string; color: string }) {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
    orange: "bg-orange-500/20 text-orange-400",
  };

  return (
    <Card variant="flat" className="p-md bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[16px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] text-[rgba(255,255,255,0.48)] uppercase tracking-wider">{label}</p>
          <p className="text-[24px] font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`${colors[color as keyof typeof colors]} p-2 rounded-[10px]`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}