"use client";

import { useState, useEffect } from "react";
import { Loader2, Bell, Mail, Smartphone, Moon, Sun, Shield, DollarSign, TrendingUp, Activity, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  securityAlerts: boolean;
  transactionAlerts: boolean;
  miningAlerts: boolean;
  depositAlerts: boolean;
  withdrawalAlerts: boolean;
  referralAlerts: boolean;
  marketingEmails: boolean;
  doNotDisturb: boolean;
  dndStart: string;
  dndEnd: string;
}

const notificationCategories = [
  { key: "securityAlerts", label: "Security Alerts", description: "Login attempts, password changes, 2FA events", icon: Shield },
  { key: "transactionAlerts", label: "Transaction Alerts", description: "Deposits, withdrawals, transfers", icon: DollarSign },
  { key: "miningAlerts", label: "Mining Alerts", description: "Rewards, plan changes, hashrate updates", icon: TrendingUp },
  { key: "depositAlerts", label: "Deposit Confirmations", description: "When funds arrive in your wallet", icon: DollarSign },
  { key: "withdrawalAlerts", label: "Withdrawal Updates", description: "Status changes, completions, failures", icon: DollarSign },
  { key: "referralAlerts", label: "Referral Activity", description: "New referrals, earnings, milestones", icon: UserCheck },
  { key: "marketingEmails", label: "Marketing Emails", description: "Product updates, promotions, newsletters", icon: Mail },
];

export function NotificationsSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    pushEnabled: true,
    securityAlerts: true,
    transactionAlerts: true,
    miningAlerts: true,
    depositAlerts: true,
    withdrawalAlerts: true,
    referralAlerts: true,
    marketingEmails: false,
    doNotDisturb: false,
    dndStart: "22:00",
    dndEnd: "08:00",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings/notifications");
      if (res.ok) {
        const data = await res.json();
        if (data.preferences) {
          setPreferences(prev => ({ ...prev, ...data.preferences }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save preferences");

      toast.success("Notification preferences saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
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
    <Card variant="flat" className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] max-w-[620px] flex flex-col gap-lg">
      <div className="flex items-center gap-xs">
        <Bell className="w-5 h-5 text-[#8B7CFF]" />
        <h3 className="text-[18px] font-semibold text-white">Notifications</h3>
      </div>

      <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
        {/* Delivery Channels */}
        <div className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
          <h4 className="text-[14px] font-semibold text-[rgba(255,255,255,0.72)]">Delivery Channels</h4>
          <div className="space-y-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Mail className="w-5 h-5 text-[rgba(255,255,255,0.48)]" />
                <div>
                  <p className="text-[14px] font-medium text-white">Email Notifications</p>
                  <p className="text-[12px] text-[rgba(255,255,255,0.48)]">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={preferences.emailEnabled}
                onCheckedChange={() => togglePreference("emailEnabled")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Smartphone className="w-5 h-5 text-[rgba(255,255,255,0.48)]" />
                <div>
                  <p className="text-[14px] font-medium text-white">Push Notifications</p>
                  <p className="text-[12px] text-[rgba(255,255,255,0.48)]">Receive push notifications on your devices</p>
                </div>
              </div>
              <Switch
                checked={preferences.pushEnabled}
                onCheckedChange={() => togglePreference("pushEnabled")}
              />
            </div>
          </div>
        </div>

        {/* Notification Categories */}
        <div className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
          <h4 className="text-[14px] font-semibold text-[rgba(255,255,255,0.72)]">Notification Categories</h4>
          <div className="space-y-sm">
            {notificationCategories.map(({ key, label, description, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between p-sm bg-[#09090B] border border-[rgba(255,255,255,0.06)] rounded-[14px]">
                <div className="flex items-center gap-sm">
                  <div className="bg-[#8B7CFF]/20 p-2 rounded-[10px]">
                    <Icon className="w-5 h-5 text-[#8B7CFF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-white">{label}</p>
                    <p className="text-[12px] text-[rgba(255,255,255,0.48)]">{description}</p>
                  </div>
                </div>
                <Switch
                  checked={preferences[key as keyof NotificationPreferences] as boolean}
                  onCheckedChange={() => togglePreference(key as keyof NotificationPreferences)}
                  disabled={!preferences.emailEnabled && !preferences.pushEnabled}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
          <h4 className="text-[14px] font-semibold text-[rgba(255,255,255,0.72)]">Do Not Disturb</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <Moon className="w-5 h-5 text-[rgba(255,255,255,0.48)]" />
              <div>
                <p className="text-[14px] font-medium text-white">Enable Do Not Disturb</p>
                <p className="text-[12px] text-[rgba(255,255,255,0.48)]">Silence all notifications during set hours</p>
              </div>
            </div>
            <Switch
              checked={preferences.doNotDisturb}
              onCheckedChange={() => togglePreference("doNotDisturb")}
            />
          </div>

          {preferences.doNotDisturb && (
            <div className="grid grid-cols-2 gap-md ml-10">
              <div className="flex flex-col gap-xs">
                <Label htmlFor="dndStart" className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
                  Start Time
                </Label>
                <Input
                  id="dndStart"
                  type="time"
                  value={preferences.dndStart}
                  onChange={(e) => setPreferences(prev => ({ ...prev, dndStart: e.target.value }))}
                  className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <Label htmlFor="dndEnd" className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
                  End Time
                </Label>
                <Input
                  id="dndEnd"
                  type="time"
                  value={preferences.dndEnd}
                  onChange={(e) => setPreferences(prev => ({ ...prev, dndEnd: e.target.value }))}
                  className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent text-sm h-10 text-white"
                />
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="w-[180px] bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] mt-xs disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </form>
    </Card>
  );
}