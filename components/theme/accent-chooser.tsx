"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppTheme } from "@/hooks/use-app-theme";

const accents = [
  {
    name: "Purple",
    value: "purple",
    color: "#8b7cff",
  },
  {
    name: "Blue",
    value: "blue",
    color: "#3b82f6",
  },
  {
    name: "Emerald",
    value: "emerald",
    color: "#10b981",
  },
  {
    name: "Amber",
    value: "amber",
    color: "#f59e0b",
  },
  {
    name: "Rose",
    value: "rose",
    color: "#f43f5e",
  },
  {
    name: "Indigo",
    value: "indigo",
    color: "#6366f1",
  },
] as const;

export function AccentChooser() {
  const { accent, setAccent } = useAppTheme();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">Accent Color</h3>
        <p className="text-muted-foreground text-sm">
          Choose your dashboard accent.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {accents.map((item) => (
          <button
            key={item.value}
            onClick={() => setAccent(item.value)}
            className={cn(
              "relative flex size-10 items-center justify-center rounded-full ring-2 transition-all duration-200 hover:scale-105",
              accent === item.value
                ? "ring-primary scale-110"
                : "ring-border"
            )}
            style={{
              backgroundColor: item.color,
            }}
            title={item.name}
          >
            {accent === item.value && (
              <Check className="size-4 text-white" />
            )}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">
        Current accent:
        <span className="text-foreground ml-1 font-medium">
          {accents.find((a) => a.value === accent)?.name}
        </span>
      </p>
    </div>
  );
}