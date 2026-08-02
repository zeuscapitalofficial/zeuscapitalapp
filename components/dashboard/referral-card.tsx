"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Check } from "lucide-react";
import { formatFullCurrency } from "@/components/formatter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ReferralData {
  referralCode: string;
  referredCount: number;
  earned: number;
  referredBy?: {
    id: string;
    name?: string;
    email?: string;
    referralCode?: string;
  } | null;
}

export function ReferralCard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchReferrals() {
      try {
        const res = await fetch("/api/user/referrals");
        if (res.ok) {
          const result = await res.json();
          if (active) {
            setData(result);
          }
        }
      } catch (err) {
        console.error("Failed to fetch referral stats:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchReferrals();

    return () => {
      active = false;
    };
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  const referralLink = data?.referralCode
    ? `${baseUrl}/sign-up?ref=${data.referralCode}`
    : `${baseUrl}/sign-up`;

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="lg:col-span-4 h-[400px]">
      {/* Top Header & Intro */}
      <CardHeader>
        <CardTitle>Invite Friends</CardTitle>
        <CardDescription>
          Invite your friends to Zeus Capital and earn up to{" "}
          <strong>5% commission</strong> .
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Referrer Sponsor Info (if signed up via referral link) */}
        {data?.referredBy && (
          <div className="p-2.5 rounded-lg bg-accent-foreground/5 border border-accent-foreground/20 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Referred by Sponsor:</span>
            <span className="font-semibold text-accent-foreground">{data.referredBy.name || data.referredBy.email}</span>
          </div>
        )}

        {/* Referral link display */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Your Referral Link
          </span>
          <div className="flex items-center gap-2 bg-background border border-border/50 rounded-xl p-2.5">
            {loading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              <>
                <span className="text-xs text-foreground font-mono truncate grow select-all">
                  {referralLink}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8 shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-4 border-t border-border/40 mt-auto pt-4">
        {/* Referral stats */}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
            Referred
          </span>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <span className="text-lg font-semibold text-foreground">
              {data?.referredCount ?? 0}{" "}
              {data?.referredCount === 1 ? "Friend" : "Friends"}
            </span>
          )}
        </div>
        <div className="h-8 w-px bg-border/40" />
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
            Earned
          </span>
          {loading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <span className="text-lg font-semibold text-emerald-500">
              {formatFullCurrency(data?.earned ?? 0)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
