"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useAppTheme } from "@/hooks/use-app-theme";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function ThemeDropdown() {
  const { theme, setTheme } = useAppTheme();

  const current = themes.find((t) => t.value === theme) ?? themes[2];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="justify-between">
          <span className="flex items-center gap-2">
            <CurrentIcon className="size-4" />
            {current.label}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {themes.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => setTheme(item.value)}
            >
              <Icon className="mr-2 size-4" />

              <span className="flex-1">{item.label}</span>

              {theme === item.value && (
                <Check className="size-4" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}