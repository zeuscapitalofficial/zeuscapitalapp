"use client";

import { ThemeProvider } from "./theme-provider";
import { AccentProvider } from "./accent-provider";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { SocketProvider } from "./socket-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AccentProvider>
        <I18nProvider>
          <SocketProvider>{children}</SocketProvider>
        </I18nProvider>
      </AccentProvider>
    </ThemeProvider>
  );
}
