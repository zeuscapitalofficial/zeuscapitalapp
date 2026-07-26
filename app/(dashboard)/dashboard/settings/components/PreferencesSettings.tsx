"use client";

import { useState, useEffect } from "react";
import { Loader2, Globe, Bell, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface PreferencesData {
  language: string;
  timezone: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  transactionAlerts: boolean;
  miningAlerts: boolean;
  doNotDisturb: boolean;
  dndStart: string;
  dndEnd: string;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
];

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Dubai",
  "Australia/Sydney",
];

const currencies = [
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "JPY", name: "Japanese Yen (¥)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
  { code: "CAD", name: "Canadian Dollar (C$)" },
  { code: "CHF", name: "Swiss Franc (CHF)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
];

export function PreferencesSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const [preferences, setPreferences] = useState<PreferencesData>({
    language: "en",
    timezone: "UTC",
    currency: "USD",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    transactionAlerts: true,
    miningAlerts: true,
    doNotDisturb: false,
    dndStart: "22:00",
    dndEnd: "08:00",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch("/api/user/settings/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            setPreferences(prev => ({ ...prev, ...data.preferences }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save preferences");

      toast.success("Preferences saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof PreferencesData) => {
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
    <Card
      variant="flat"
      className="p-lg bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] max-w-[620px] flex flex-col gap-md"
    >
      <div className="flex items-center gap-xs">
        <Globe className="w-5 h-5 text-[#8B7CFF]" />
        <h3 className="text-[18px] font-semibold text-white">Preferences</h3>
      </div>

      <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
        {/* Regional Settings */}
        <div className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
          <h4 className="text-[14px] font-semibold text-[rgba(255,255,255,0.72)]">Regional Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="flex flex-col gap-xs">
              <Label htmlFor="language" className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
                Language
              </Label>
              <Select value={preferences.language} onValueChange={(v) => setPreferences(prev => ({ ...prev, language: v }))}>
                <SelectTrigger className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent h-10">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-xs">
              <Label htmlFor="timezone" className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
                Timezone
              </Label>
              <Select value={preferences.timezone} onValueChange={(v) => setPreferences(prev => ({ ...prev, timezone: v }))}>
                <SelectTrigger className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent h-10">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-xs">
              <Label htmlFor="currency" className="text-xs font-semibold text-[rgba(255,255,255,0.48)] uppercase tracking-wider">
                Display Currency
              </Label>
              <Select value={preferences.currency} onValueChange={(v) => setPreferences(prev => ({ ...prev, currency: v }))}>
                <SelectTrigger className="rounded-[14px] border-[rgba(255,255,255,0.08)] bg-transparent h-10">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>{curr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
          <h4 className="text-[14px] font-semibold text-[rgba(255,255,255,0.72)]">Notifications</h4>
          <div className="space-y-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Bell className="w-5 h-5 text-[rgba(255,255,255,0.48)]" />
                <span className="text-[14px] font-medium text-white">Email Notifications</span>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={() => togglePreference("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Monitor className="w-5 h-5 text-[rgba(255,255,255,0.48)]" />
                <span className="text-[14px] font-medium text-white">Push Notifications</span>
              </div>
              <Switch
                checked={preferences.pushNotifications}
                onCheckedChange={() => togglePreference("pushNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="text-[14px] font-medium text-white">Marketing Emails</span>
              </div>
              <Switch
                checked={preferences.marketingEmails}
                onCheckedChange={() => togglePreference("marketingEmails")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="text-[14px] font-medium text-white">Security Alerts</span>
              </div>
              <Switch
                checked={preferences.securityAlerts}
                onCheckedChange={() => togglePreference("securityAlerts")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="text-[14px] font-medium text-white">Transaction Alerts</span>
              </div>
              <Switch
                checked={preferences.transactionAlerts}
                onCheckedChange={() => togglePreference("transactionAlerts")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="text-[14px] font-medium text-white">Mining Alerts</span>
              </div>
              <Switch
                checked={preferences.miningAlerts}
                onCheckedChange={() => togglePreference("miningAlerts")}
              />
            </div>
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="space-y-md pt-md border-t border-[rgba(255,255,255,0.06)]">
          <h4 className="text-[14px] font-semibold text-[rgba(255,255,255,0.72)]">Do Not Disturb</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <Moon className="w-5 h-5 text-[rgba(255,255,255,0.48)]" />
              <span className="text-[14px] font-medium text-white">Enable Do Not Disturb</span>
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
          className="w-[140px] bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white text-[13px] font-semibold h-10 rounded-[14px] mt-xs disabled:opacity-50"
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