"use client";

import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Clock,
  Wrench,
  Bell,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TradingBotsPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 3000);
  };

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-500 bg-amber-500/10 font-semibold px-3 py-1 text-xs gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              Under Active Development
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mt-2">
            Algorithmic Trading & Bot Suite
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-120">
            Our automated high-frequency trading algorithms, Grid strategies, and DCA bot engines are currently undergoing final security audits and infrastructure testing.
          </p>
        </div>
      </div>

      {/* Hero Under Construction Card */}
      <Card className="relative overflow-hidden border-border bg-card shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-foreground/5 rounded-full blur-3xl z-0 pointer-events-none" />
        <CardContent className="p-8 md:p-12 relative z-10 text-center flex flex-col items-center justify-center space-y-6 max-w-3xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-accent-foreground/10 text-accent-foreground flex items-center justify-center shadow-inner relative group">
            <Bot className="w-10 h-10 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-ping" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Institutional Bot Suite In Development
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed w-120 mx-auto">
              We are finalizing institutional latency optimization, sub-millisecond execution routing, and automated risk mitigation guardrails before public release.
            </p>
          </div>

          {/* Early Access Notification Form */}
          <Card className="w-120 bg-background border-border p-4 shadow-sm text-left">
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-accent-foreground" /> Get Early Access Notification
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  VIP Priority
                </Badge>
              </div>

              <div className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-card border-border text-xs h-10"
                />
                <Button
                  type="submit"
                  disabled={subscribed}
                  className="bg-accent-foreground text-background hover:bg-accent-foreground/90 font-semibold text-xs h-10 px-4 shrink-0 cursor-pointer"
                >
                  {subscribed ? "Subscribed!" : "Notify Me"}
                </Button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium pt-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You are on the VIP early access list! We will notify you at release.</span>
                </div>
              )}
            </form>
          </Card>
        </CardContent>
      </Card>

      {/* Feature Teasers Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Upcoming Algorithmic Engines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Teaser 1 */}
          <Card className="border-border bg-card shadow-xs relative overflow-hidden group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground">
                  Spot Grid Trading Engine
                </CardTitle>
                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10">
                  Testing
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Automated grid allocation capturing micro-fluctuations 24/7 with zero manual oversight.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 pt-0">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Target Win Rate</span>
                <span className="font-semibold text-foreground">&gt; 92.0%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Supported Pairs</span>
                <span className="font-medium text-foreground">BTC/USDT, ETH/USDT</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Status</span>
                <span className="font-medium text-amber-500">Security Audit Stage</span>
              </div>
            </CardContent>
          </Card>

          {/* Teaser 2 */}
          <Card className="border-border bg-card shadow-xs relative overflow-hidden group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground">
                  Momentum HFT Scalper
                </CardTitle>
                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10">
                  Testing
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Sub-second breakout algorithm executing high-frequency volume momentum trades.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 pt-0">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Execution Speed</span>
                <span className="font-semibold text-emerald-500">&lt; 15 milliseconds</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Risk Model</span>
                <span className="font-medium text-foreground">Automated Trailing SL</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Status</span>
                <span className="font-medium text-amber-500">Backtesting Optimization</span>
              </div>
            </CardContent>
          </Card>

          {/* Teaser 3 */}
          <Card className="border-border bg-card shadow-xs relative overflow-hidden group">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground">
                  Smart DCA Accumulator
                </CardTitle>
                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10">
                  Testing
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Dollar-cost averaging bot with dynamic dip-buying triggers for long-term vault growth.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 pt-0">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Dip Multiplier</span>
                <span className="font-semibold text-foreground">Dynamic Volatility Scaling</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Fee Optimization</span>
                <span className="font-medium text-emerald-500">Zero Host Surcharge</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Status</span>
                <span className="font-medium text-amber-500">Final Infrastructure Rig</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
