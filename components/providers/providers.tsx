"use client";

import { ThemeProvider } from "./theme-provider";
import { AccentProvider } from "./accent-provider";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AccentProvider>
        {children}
      </AccentProvider>
    </ThemeProvider>
  );
}