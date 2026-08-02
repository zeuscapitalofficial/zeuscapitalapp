"use client";

import { useTheme } from "@/components/providers/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Monitor, Palette } from "lucide-react";

export function MarketingThemeSelector() {
  const { marketingTheme, setMarketingTheme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Monitor className="size-4" />
        Marketing Theme
      </Label>
      <Select value={marketingTheme} onValueChange={setMarketingTheme}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="size-4 text-yellow-500" />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="size-4 text-blue-500" />
              <span>Dark</span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-green-500" />
              <span>System ({resolvedTheme})</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function DashboardAccentSelector() {
  const { dashboardAccent, setDashboardAccent } = useTheme();

  const accents = [
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "blue", label: "Blue", color: "bg-blue-500" },
    { value: "emerald", label: "Emerald", color: "bg-emerald-500" },
    { value: "amber", label: "Amber", color: "bg-amber-500" },
    { value: "rose", label: "Rose", color: "bg-rose-500" },
    { value: "indigo", label: "Indigo", color: "bg-indigo-500" },
  ] as const;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Palette className="size-4" />
        Dashboard Accent
      </Label>
      <Select value={dashboardAccent} onValueChange={setDashboardAccent}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select accent" />
        </SelectTrigger>
        <SelectContent>
          {accents.map((accent) => (
            <SelectItem key={accent.value} value={accent.value}>
              <div className="flex items-center gap-2">
                <div className={`${accent.color} size-4 rounded-full`} />
                <span>{accent.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
