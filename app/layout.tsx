import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/providers";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Zeus Capital | Premium Cryptocurrency Brokerage & Mining",
  description:
    "A premium, secure digital asset brokerage and industrial-scale mining platform designed for high-net-worth individuals and institutional investors.",
  metadataBase: new URL("https://zeus.capital"),
  openGraph: {
    title: "Zeus Capital | Premium Cryptocurrency Brokerage & Mining",
    description:
      "A premium, secure digital asset brokerage and industrial-scale mining platform designed for high-net-worth individuals and institutional investors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontSerif.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
