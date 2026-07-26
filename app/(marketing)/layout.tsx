import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ThemeProvider>
  );
}
