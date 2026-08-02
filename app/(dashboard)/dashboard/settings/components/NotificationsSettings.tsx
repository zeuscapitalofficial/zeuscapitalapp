"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  BellOff,
  Mail,
  Shield,
  DollarSign,
  TrendingUp,
  UserCheck,
  Save,
  Loader2,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface NotificationPreferences {
  isDndActive: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  securityAlerts: boolean;
  transactionAlerts: boolean;
  miningAlerts: boolean;
  depositAlerts: boolean;
  withdrawalAlerts: boolean;
  referralAlerts: boolean;
  marketingEmails: boolean;
}

export function NotificationsSettings() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    isDndActive: false,
    emailEnabled: false,
    pushEnabled: true,
    securityAlerts: true,
    transactionAlerts: true,
    miningAlerts: true,
    depositAlerts: true,
    withdrawalAlerts: true,
    referralAlerts: true,
    marketingEmails: false,
  });

  useEffect(() => {
    async function fetchPreferences() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/settings/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            setPreferences((prev) => ({
              ...prev,
              ...data.preferences,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load notification settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  const handleToggleDnd = async (checked: boolean) => {
    const nextPrefs: NotificationPreferences = checked
      ? {
          isDndActive: true,
          emailEnabled: false,
          pushEnabled: false,
          securityAlerts: false,
          transactionAlerts: false,
          miningAlerts: false,
          depositAlerts: false,
          withdrawalAlerts: false,
          referralAlerts: false,
          marketingEmails: false,
        }
      : {
          isDndActive: false,
          emailEnabled: false,
          pushEnabled: true,
          securityAlerts: true,
          transactionAlerts: true,
          miningAlerts: true,
          depositAlerts: true,
          withdrawalAlerts: true,
          referralAlerts: true,
          marketingEmails: false,
        };

    setPreferences(nextPrefs);
    toast.info(checked ? "Do Not Disturb (DND) Activated" : "Notifications Restored");

    try {
      await fetch("/api/user/settings/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextPrefs),
      });
    } catch (err) {
      console.error("Failed to save DND setting:", err);
    }
  };

  const toggle = (key: keyof NotificationPreferences) => {
    if (preferences.isDndActive) {
      toast.error("Turn off Do Not Disturb (DND) mode to customize individual notifications.");
      return;
    }
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!res.ok) throw new Error("Failed to save notification preferences");
      toast.success("Notification preferences saved successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    {
      key: "securityAlerts" as const,
      label: "Security & Login Alerts",
      desc: "Instant alerts on new device logins, password resets, and 2FA changes.",
      icon: Shield,
    },
    {
      key: "transactionAlerts" as const,
      label: "Financial Transactions",
      desc: "Confirmations for deposits, withdrawals, and balance transfers.",
      icon: DollarSign,
    },
    {
      key: "miningAlerts" as const,
      label: "Mining & Hashrate Updates",
      desc: "Daily payout credits, plan completions, and hardware telemetry.",
      icon: TrendingUp,
    },
    {
      key: "referralAlerts" as const,
      label: "Referral Program Earnings",
      desc: "Notifications when a referred user signs up or earns a commission bonus.",
      icon: UserCheck,
    },
    {
      key: "marketingEmails" as const,
      label: "Platform Updates & Newsletters",
      desc: "Occasional announcements on new mining algorithms and platform features.",
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Master Do Not Disturb (DND) Card Banner */}
      <Card className={`border transition-all ${
        preferences.isDndActive
          ? "border-amber-500/50 bg-amber-500/10 shadow-md"
          : "border-border bg-card"
      }`}>
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
              preferences.isDndActive
                ? "bg-amber-500 text-black font-bold"
                : "bg-muted text-muted-foreground"
            }`}>
              {preferences.isDndActive ? (
                <Moon className="size-5 fill-current" />
              ) : (
                <BellOff className="size-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground">
                  {t("dnd_title", "Do Not Disturb (DND)")}
                </span>
                <Badge variant={preferences.isDndActive ? "default" : "outline"} className={`text-[10px] ${
                  preferences.isDndActive ? "bg-amber-500 text-black font-bold border-none" : ""
                }`}>
                  {preferences.isDndActive
                    ? t("dnd_active", "DND Active — All Notifications Silenced")
                    : t("dnd_inactive", "Notifications Enabled")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-120">
                {t("dnd_desc", "Mute all in-app push banners, transactional alerts, and email notifications instantly.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <Label htmlFor="dnd-switch" className="text-xs font-semibold cursor-pointer">
              {preferences.isDndActive ? "DND On" : "DND Off"}
            </Label>
            <Switch
              id="dnd-switch"
              checked={preferences.isDndActive}
              onCheckedChange={handleToggleDnd}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Preferences Form */}
      <Card className={`w-full shadow-xs border-border bg-card transition-opacity ${
        preferences.isDndActive ? "opacity-60 pointer-events-none" : ""
      }`}>
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-accent-foreground/10 text-accent-foreground flex items-center justify-center">
              <Bell className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">Notification Preferences</CardTitle>
              <CardDescription className="text-xs">
                Choose how and when you receive security alerts and financial updates.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-accent-foreground" />
              Loading preferences...
            </div>
          ) : (
            <>
              {/* Global Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground block">Email Notifications</Label>
                    <span className="text-[11px] text-muted-foreground">Receive updates via primary email</span>
                  </div>
                  <Switch
                    disabled={preferences.isDndActive}
                    checked={preferences.emailEnabled}
                    onCheckedChange={() => toggle("emailEnabled")}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground block">In-App Push Alerts</Label>
                    <span className="text-[11px] text-muted-foreground">Receive real-time popups in header</span>
                  </div>
                  <Switch
                    disabled={preferences.isDndActive}
                    checked={preferences.pushEnabled}
                    onCheckedChange={() => toggle("pushEnabled")}
                  />
                </div>
              </div>

              {/* Specific Event Types */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Notification Categories
                </h4>

                <div className="divide-y divide-border border border-border rounded-lg bg-background">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div key={cat.key} className="flex items-center justify-between p-3.5 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-foreground block">
                              {cat.label}
                            </span>
                            <span className="text-[11px] text-muted-foreground block">
                              {cat.desc}
                            </span>
                          </div>
                        </div>

                        <Switch
                          disabled={preferences.isDndActive}
                          checked={preferences[cat.key]}
                          onCheckedChange={() => toggle(cat.key)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="border-t border-border pt-4 justify-end mt-auto">
          <Button
            onClick={handleSave}
            disabled={saving || loading || preferences.isDndActive}
            className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                Save Preferences
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
