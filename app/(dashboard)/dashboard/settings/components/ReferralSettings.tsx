"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Copy,
  Users,
  TrendingUp,
  DollarSign,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

export function ReferralSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings/referral/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const referralCode = stats?.code || (user as any)?.referralCode || "ZEUS-REG";
  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/sign-up?ref=${referralCode}`
    : `https://zeus-capital.com/sign-up?ref=${referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success("Referral code copied to clipboard");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Referral invitation link copied");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Referral Link & Sharing Card */}
      <Card className="shadow-xs border-border bg-card">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Share2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Affiliate Referral Program</CardTitle>
              <CardDescription className="text-xs">
                Earn up to 5% commission on every deposit & mining plan started by your invitees.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Your Referral Code</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={referralCode}
                  className="font-mono text-xs h-9 bg-background font-bold uppercase tracking-wider text-purple-600"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyCode}
                  className="text-xs h-9 px-3 gap-1 cursor-pointer shrink-0"
                >
                  {copiedCode ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  {copiedCode ? "Copied" : "Copy Code"}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Invitation Link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={referralLink}
                  className="font-mono text-xs h-9 bg-background truncate text-muted-foreground"
                />
                <Button
                  type="button"
                  onClick={copyLink}
                  className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 px-3 gap-1 cursor-pointer shrink-0"
                >
                  {copiedLink ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  {copiedLink ? "Copied" : "Copy Link"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Referred Partners</span>
            <Users className="size-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {loading ? "..." : stats?.totalReferrals || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats?.activeReferrals || 0} active investors
          </p>
        </Card>

        <Card className="shadow-xs border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Total Commissions Earned</span>
            <DollarSign className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            ${loading ? "..." : (stats?.totalEarnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Credited directly to wallet
          </p>
        </Card>

        <Card className="shadow-xs border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>This Month Earnings</span>
            <TrendingUp className="size-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            ${loading ? "..." : (stats?.thisMonthEarnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            30-day affiliate payout volume
          </p>
        </Card>
      </div>
    </div>
  );
}
