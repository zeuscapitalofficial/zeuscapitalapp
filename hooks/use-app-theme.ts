// hooks/use-app-theme.ts

"use client";

import { useTheme } from "next-themes";
import { useAccent } from "@/components/providers/accent-provider";

export function useAppTheme() {
  const {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
  } = useTheme();

  const {
    accent,
    setAccent,
  } = useAccent();

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    accent,
    setAccent,
  };
}