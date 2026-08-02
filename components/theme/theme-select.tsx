"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useAppTheme } from "@/hooks/use-app-theme";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themes = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Laptop,
  },
] as const;

export function ThemeSelectToggle() {
  const { theme, setTheme } = useAppTheme();

  const current = themes.find((t) => t.value === theme) ?? themes[2];
  const CurrentIcon = current.icon;

  return (
    <Select
      value={theme}
      onValueChange={(value) =>
        setTheme(value as (typeof themes)[number]["value"])
      }
    >
      <SelectTrigger className="w-40">
        <SelectValue>
          <span className="flex items-center gap-2">
            <CurrentIcon className="size-4" />
            {current.label}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {themes.map((item) => {
          const Icon = item.icon;

          return (
            <SelectItem key={item.value} value={item.value}>
              <span className="flex items-center gap-2">
                <Icon className="size-4" />
                {item.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}