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

export function ThemeToggle() {
  const { theme, setTheme } = useAppTheme();

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-sm font-medium">Theme</h3>
        <p className="text-muted-foreground text-sm">
          Choose how the application looks.
        </p>
      </div>

      <Select
        value={theme}
        onValueChange={(value) =>
          setTheme(value as "light" | "dark" | "system")
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="size-4" />
              <span>Light</span>
            </div>
          </SelectItem>

          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="size-4" />
              <span>Dark</span>
            </div>
          </SelectItem>

          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Laptop className="size-4" />
              <span>System</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}