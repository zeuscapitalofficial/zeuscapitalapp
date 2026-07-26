import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
