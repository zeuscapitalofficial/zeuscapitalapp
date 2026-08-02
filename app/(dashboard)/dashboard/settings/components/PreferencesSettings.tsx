"use client";

import { useState, useEffect } from "react";
import { Loader2, Globe, Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { LanguageCode } from "@/lib/i18n/dictionaries";
import { toast } from "sonner";

interface PreferencesData {
  language: string;
  timezone: string;
  currency: string;
}

const languages = [
  { code: "en", name: "English (US)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "ja", name: "Japanese (日本語)" },
];

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
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
  { code: "USD", name: "USD ($) - US Dollar" },
  { code: "EUR", name: "EUR (€) - Euro" },
  { code: "GBP", name: "GBP (£) - British Pound" },
  { code: "JPY", name: "JPY (¥) - Japanese Yen" },
  { code: "AUD", name: "AUD (A$) - Australian Dollar" },
  { code: "CAD", name: "CAD (C$) - Canadian Dollar" },
];

export function PreferencesSettings() {
  const { data: session } = useSession();
  const { language: currentLang, setLanguage } = useTranslation();
  const user = session?.user;
  const [preferences, setPreferences] = useState<PreferencesData>({
    language: currentLang || "en",
    timezone: "UTC",
    currency: "USD",
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
            setPreferences((prev) => ({
              ...prev,
              timezone: data.preferences.timezone || "UTC",
              currency: data.preferences.currency || "USD",
            }));
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

  // Keep local state in sync if global language changes
  useEffect(() => {
    if (currentLang) {
      setPreferences((prev) => ({ ...prev, language: currentLang }));
    }
  }, [currentLang]);

  const handleLanguageChange = (val: string) => {
    setPreferences((prev) => ({ ...prev, language: val }));
    setLanguage(val as LanguageCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      setLanguage(preferences.language as LanguageCode);
      const res = await fetch("/api/user/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save preferences");

      toast.success("Regional preferences saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full shadow-xs border-border bg-card">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Globe className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-foreground">Localization & Display</CardTitle>
            <CardDescription className="text-xs">
              Configure your default language, primary fiat currency, and local timezone.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-accent-foreground" />
              Loading preferences...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-xs font-semibold text-foreground">
                  Language
                </Label>
                <Select
                  value={preferences.language}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger id="language" className="text-xs h-9 bg-background w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.code} value={l.code} className="text-xs">
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-xs font-semibold text-foreground">
                  Display Currency
                </Label>
                <Select
                  value={preferences.currency}
                  onValueChange={(val) => setPreferences((prev) => ({ ...prev, currency: val }))}
                >
                  <SelectTrigger id="currency" className="text-xs h-9 bg-background w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs font-semibold text-foreground">
                  Timezone
                </Label>
                <Select
                  value={preferences.timezone}
                  onValueChange={(val) => setPreferences((prev) => ({ ...prev, timezone: val }))}
                >
                  <SelectTrigger id="timezone" className="text-xs h-9 bg-background w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz} className="text-xs">
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-border pt-4 justify-end mt-auto">
          <Button
            type="submit"
            disabled={saving || loading}
            className="bg-accent-foreground text-background hover:bg-accent-foreground/90 text-xs h-9 gap-1.5 cursor-pointer"
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
      </form>
    </Card>
  );
}
