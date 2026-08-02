"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  Gift,
  Sparkles,
  Users,
  Target,
  Crown,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFullCurrency } from "@/components/formatter";

interface StreakDay {
  day: number;
  xp: number;
  status: "claimed" | "claimable" | "locked";
  isBonus?: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  category: "daily" | "weekly" | "special";
  xpReward: number;
  bonusReward?: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
}

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function RewardsPage() {
  // Referral copy & real data state
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referredCount, setReferredCount] = useState(0);
  const [earnedBonus, setEarnedBonus] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [referralsList, setReferralsList] = useState<ReferredUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Quests & Streak DB persistence state
  const [claimedStreakDays, setClaimedStreakDays] = useState<number[]>([]);
  const [dbQuestsMap, setDbQuestsMap] = useState<Record<string, { completed: boolean; claimed: boolean }>>({});

  const fetchUserDataAndReferrals = useCallback(async () => {
    try {
      setLoadingData(true);
      const [refRes, userRes, questRes] = await Promise.all([
        fetch("/api/user/referrals"),
        fetch("/api/user/me"),
        fetch("/api/user/quests"),
      ]);

      if (refRes.ok) {
        const data = await refRes.json();
        if (data.referralCode) {
          setReferralCode(data.referralCode);
        }
        setReferredCount(data.referredCount ?? 0);
        setEarnedBonus(Number(data.earned ?? 0));
        setReferralsList(data.referrals || []);
      }

      if (userRes.ok) {
        const userData = await userRes.json();
        setTotalDeposit(Number(userData.totalDeposit ?? 0));
      }

      if (questRes.ok) {
        const qData = await questRes.json();
        setClaimedStreakDays(qData.streak?.claimedDays || []);
        const qMap: Record<string, { completed: boolean; claimed: boolean }> = {};
        (qData.quests || []).forEach((q: any) => {
          qMap[q.questId] = { completed: q.completed, claimed: q.claimed };
        });
        setDbQuestsMap(qMap);
      }
    } catch (err) {
      console.error("Failed to fetch rewards data:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDataAndReferrals();
  }, [fetchUserDataAndReferrals]);

  // Dynamic Level & Tier progression formula (Challenging & Competitive Ratios)
  // $10 USD Deposited = 1 XP | 1 Referral = 100 XP
  const totalXP = Math.round(Math.floor(totalDeposit / 10) + referredCount * 100);

  const getTierInfo = (xp: number) => {
    if (xp < 250) {
      return {
        level: 1,
        tierName: "Novice Trader",
        avatarText: "L1",
        nextTierName: "Level 2 (Active Trader)",
        currentXP: xp,
        nextXP: 250,
        remainingXP: 250 - xp,
        percent: Math.min(Math.round((xp / 250) * 100), 100),
        yieldBoost: "1.0x Standard",
      };
    } else if (xp < 1000) {
      return {
        level: 2,
        tierName: "Active Trader",
        avatarText: "L2",
        nextTierName: "Level 3 (Bronze Investor)",
        currentXP: xp,
        nextXP: 1000,
        remainingXP: 1000 - xp,
        percent: Math.min(Math.round(((xp - 250) / 750) * 100), 100),
        yieldBoost: "1.05x Yield Boost",
      };
    } else if (xp < 5000) {
      return {
        level: 3,
        tierName: "Bronze Investor",
        avatarText: "L3",
        nextTierName: "Level 4 (Silver VIP)",
        currentXP: xp,
        nextXP: 5000,
        remainingXP: 5000 - xp,
        percent: Math.min(Math.round(((xp - 1000) / 4000) * 100), 100),
        yieldBoost: "1.15x Yield Boost",
      };
    } else if (xp < 20000) {
      return {
        level: 4,
        tierName: "Silver VIP",
        avatarText: "L4",
        nextTierName: "Level 5 (Gold Institutional)",
        currentXP: xp,
        nextXP: 20000,
        remainingXP: 20000 - xp,
        percent: Math.min(Math.round(((xp - 5000) / 15000) * 100), 100),
        yieldBoost: "1.35x Yield Boost",
      };
    } else {
      return {
        level: 5,
        tierName: "Gold Institutional",
        avatarText: "L5",
        nextTierName: "Max Level Achieved",
        currentXP: xp,
        nextXP: 50000,
        remainingXP: 0,
        percent: 100,
        yieldBoost: "1.75x Max Yield Boost",
      };
    }
  };

  const tierInfo = getTierInfo(totalXP);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = referralCode
    ? `${baseUrl}/sign-up?ref=${referralCode}`
    : `${baseUrl}/sign-up`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 7-Day Login Streak
  const streakDays: StreakDay[] = [1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
    const isClaimed = claimedStreakDays.includes(dayNum);
    const xpVal = dayNum === 7 ? 1000 : dayNum * 50;
    return {
      day: dayNum,
      xp: xpVal,
      status: isClaimed ? "claimed" : dayNum === 1 ? "claimable" : "locked",
      isBonus: dayNum === 7,
    };
  });

  const claimStreakDay = async (dayNumber: number) => {
    setClaimedStreakDays((prev) => [...prev, dayNumber]);
    try {
      await fetch("/api/user/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claimStreak", day: dayNumber }),
      });
    } catch (err) {
      console.error("Failed to save streak claim:", err);
    }
  };

  // Quests definitions with DB persistence overlay
  const baseQuests: Quest[] = [
    {
      id: "q1",
      title: "Daily Portfolio Sync",
      description: "Log into your account and review your vault performance today.",
      category: "daily",
      xpReward: 100,
      progress: 1,
      maxProgress: 1,
      completed: dbQuestsMap["q1"]?.completed ?? true,
      claimed: dbQuestsMap["q1"]?.claimed ?? false,
    },
    {
      id: "q2",
      title: "Deposit & Fund Account",
      description: "Make a crypto deposit or deposit transfer to activate live trading.",
      category: "daily",
      xpReward: 250,
      bonusReward: "+5 ZEUS Credits",
      progress: totalDeposit > 0 ? 1 : 0,
      maxProgress: 1,
      completed: totalDeposit > 0 || (dbQuestsMap["q2"]?.completed ?? false),
      claimed: dbQuestsMap["q2"]?.claimed ?? false,
    },
    {
      id: "q3",
      title: "Liquidity Provider Check-In",
      description: "Maintain an active balance allocation in your Zeus brokerage account.",
      category: "daily",
      xpReward: 200,
      progress: 1,
      maxProgress: 1,
      completed: dbQuestsMap["q3"]?.completed ?? true,
      claimed: dbQuestsMap["q3"]?.claimed ?? false,
    },
    {
      id: "q4",
      title: "Institutional Deposit Surge",
      description: "Execute total account deposits exceeding $10,000.",
      category: "weekly",
      xpReward: 750,
      bonusReward: "0.05% Yield Boost",
      progress: Math.min(totalDeposit, 10000),
      maxProgress: 10000,
      completed: totalDeposit >= 10000 || (dbQuestsMap["q4"]?.completed ?? false),
      claimed: dbQuestsMap["q4"]?.claimed ?? false,
    },
    {
      id: "q5",
      title: "Governance & Community Check",
      description: "Verify active status and explore live signal updates.",
      category: "weekly",
      xpReward: 500,
      progress: 1,
      maxProgress: 1,
      completed: dbQuestsMap["q5"]?.completed ?? true,
      claimed: dbQuestsMap["q5"]?.claimed ?? false,
    },
    {
      id: "q6",
      title: "Referral Pioneer",
      description: "Successfully invite 3 traders who register using your referral link.",
      category: "weekly",
      xpReward: 1500,
      bonusReward: "Tier Multiplier",
      progress: Math.min(referredCount, 3),
      maxProgress: 3,
      completed: referredCount >= 3 || (dbQuestsMap["q6"]?.completed ?? false),
      claimed: dbQuestsMap["q6"]?.claimed ?? false,
    },
  ];

  const toggleQuestComplete = async (questId: string) => {
    const current = dbQuestsMap[questId]?.completed ?? false;
    const nextVal = !current;

    setDbQuestsMap((prev) => ({
      ...prev,
      [questId]: { ...prev[questId], completed: nextVal },
    }));

    try {
      await fetch("/api/user/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleQuest", questId }),
      });
    } catch (err) {
      console.error("Failed to save quest completion:", err);
    }
  };

  const claimQuestReward = async (questId: string) => {
    setDbQuestsMap((prev) => ({
      ...prev,
      [questId]: { completed: true, claimed: true },
    }));

    try {
      await fetch("/api/user/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claimQuest", questId }),
      });
    } catch (err) {
      console.error("Failed to claim quest:", err);
    }
  };

  const handleClaimAll = async () => {
    baseQuests.forEach((q) => {
      if (q.completed && !q.claimed) {
        claimQuestReward(q.id);
      }
    });
  };

  const hasPendingRewards = baseQuests.some((q) => q.completed && !q.claimed);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/40 text-amber-500 bg-amber-500/10 font-semibold">
              <Crown className="w-3 h-3 mr-1" /> {tierInfo.tierName}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mt-2">
            Rewards & Referral Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Earn XP, claim referral bonuses, track invited users, and unlock yield boosts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleClaimAll}
            disabled={!hasPendingRewards}
            className="gap-2 bg-accent-foreground text-background hover:bg-accent-foreground/90 disabled:opacity-50 cursor-pointer font-semibold text-xs h-10"
          >
            <Sparkles className="w-4 h-4" />
            Claim All
          </Button>
        </div>
      </div>

      {/* SECTION 1: Dynamic Investor Level & XP Progress Banner */}
      <Card className="relative overflow-hidden border-border bg-card shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Level Badge */}
            <div className="lg:col-span-4 flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-amber-500/50 bg-amber-500/10">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500/20 to-accent-foreground/20 text-amber-500 font-bold text-xl">
                    {loadingData ? "..." : tierInfo.avatarText}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black rounded-full p-1 shadow-md">
                  <Crown className="w-4 h-4 fill-current" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {loadingData ? <Skeleton className="h-7 w-20" /> : `Level ${tierInfo.level}`}
                  </h2>
                  <Badge className="bg-amber-500 text-black hover:bg-amber-600 font-semibold text-[10px]">
                    {tierInfo.tierName}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Account Investor Tier
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <Zap className="w-3.5 h-3.5" /> {tierInfo.yieldBoost}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle XP Progress */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Current Progress to {tierInfo.nextTierName}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">
                      {loadingData ? <Skeleton className="h-8 w-16" /> : tierInfo.currentXP.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground font-medium text-sm">
                      / {tierInfo.nextXP.toLocaleString()} XP
                    </span>
                    <Badge variant="outline" className="ml-2 text-emerald-500 border-emerald-500/30 bg-emerald-500/10 text-[10px]">
                      {tierInfo.percent}% Complete
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <Progress value={tierInfo.percent} className="h-2.5 bg-secondary" />
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Level {tierInfo.level} ({tierInfo.tierName})</span>
                  <span>{tierInfo.remainingXP.toLocaleString()} XP to Next Tier</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Streak Check-In & Referral Share Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quests Column (lg:col-span-7) */}
        <Card className="lg:col-span-7 border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-accent-foreground" /> Daily & Weekly Bounties
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Complete tasks to earn XP points and unlock promotional reward bonuses. Progress saves directly to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-muted p-1 rounded-lg mb-4">
                <TabsTrigger value="all" className="text-xs font-semibold">All Quests</TabsTrigger>
                <TabsTrigger value="daily" className="text-xs font-semibold">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs font-semibold">Weekly</TabsTrigger>
              </TabsList>

              {["all", "daily", "weekly"].map((tabVal) => (
                <TabsContent key={tabVal} value={tabVal} className="space-y-3">
                  {baseQuests
                    .filter((q) => tabVal === "all" || q.category === tabVal)
                    .map((quest) => (
                      <div
                        key={quest.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          quest.completed
                            ? "bg-accent/30 border-border"
                            : "bg-background border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={quest.completed}
                              onChange={() => toggleQuestComplete(quest.id)}
                              className="mt-1 size-4 rounded border-border cursor-pointer accent-accent-foreground"
                            />
                            <div className="space-y-1">
                              <span
                                className={`font-semibold text-xs block text-foreground ${
                                  quest.completed ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {quest.title}
                              </span>
                              <p className="text-xs text-muted-foreground">{quest.description}</p>
                              <div className="flex items-center gap-2 pt-1 text-[11px]">
                                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
                                  +{quest.xpReward} XP
                                </Badge>
                                {quest.bonusReward && (
                                  <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30">
                                    {quest.bonusReward}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {quest.completed && !quest.claimed && (
                            <Button
                              size="sm"
                              onClick={() => claimQuestReward(quest.id)}
                              className="h-8 text-xs bg-emerald-500 text-background hover:bg-emerald-600 font-semibold cursor-pointer shrink-0"
                            >
                              Claim
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Real Referral Share Card (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border bg-card relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-foreground/10 rounded-full blur-2xl -z-0 pointer-events-none" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-accent-foreground" /> Invite & Earn
                </CardTitle>
                <Badge className="bg-accent-foreground text-background text-[10px] font-bold">
                  $100 Bonus / Referral
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Earn $100.00 USD for every trader who signs up using your unique link. Your friend receives a $25.00 welcome bonus!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {/* 1-Click Copy Input Group */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Exclusive Referral Link
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={referralLink}
                    className="font-mono text-xs bg-muted/50 border-border text-foreground select-all h-9"
                  />
                  <Button
                    onClick={handleCopy}
                    className="shrink-0 gap-1.5 bg-accent-foreground text-background hover:bg-accent-foreground/90 h-9 text-xs font-semibold cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Real Referral Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-center">
                <div className="p-3 rounded-xl bg-accent/40 border border-border">
                  <p className="text-xs text-muted-foreground font-medium">Users Referred</p>
                  <p className="text-2xl font-extrabold text-foreground mt-0.5">
                    {loadingData ? <Skeleton className="h-7 w-12 mx-auto" /> : referredCount}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-accent/40 border border-border">
                  <p className="text-xs text-muted-foreground font-medium">Bonus Earned</p>
                  <p className="text-2xl font-extrabold text-emerald-500 mt-0.5">
                    {loadingData ? (
                      <Skeleton className="h-7 w-20 mx-auto" />
                    ) : (
                      formatFullCurrency(earnedBonus)
                    )}
                  </p>
                </div>
              </div>

              {/* Real Invited Users List */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                  <span>Referred Users ({referralsList.length})</span>
                  <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                </Label>

                {loadingData ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : referralsList.length === 0 ? (
                  <div className="p-4 rounded-lg bg-muted/20 border border-border text-center text-xs text-muted-foreground">
                    No referred users yet. Share your link to start earning $100 rewards!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {referralsList.map((ref) => (
                      <div
                        key={ref.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7 bg-accent-foreground/10 text-accent-foreground text-[10px] font-bold">
                            <AvatarFallback>{ref.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-semibold block text-foreground">{ref.name || "Referred User"}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{ref.email}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30">
                          +$100 Bonus
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
