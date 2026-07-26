"use client";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  Cpu,
  FolderCheck,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

const adminNavItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "User Registry", icon: Users, href: "/admin/users" },
  { label: "KYC Queue", icon: FolderCheck, href: "/admin/kyc" },
  { label: "Mining Clusters", icon: Cpu, href: "/admin/mining" },
  { label: "Coin Pricing", icon: Coins, href: "/admin/prices" },
  { label: "Ledger Registry", icon: History, href: "/admin/transactions" },
  { label: "Deposit Checks", icon: ArrowDownCircle, href: "/admin/deposits" },
  { label: "Withdrawals", icon: ArrowUpCircle, href: "/admin/withdrawals" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/sign-in");
      } else if ((session.user as any).role !== "ADMIN") {
        toast.error("Access Denied: Administrative level clearance required.");
        router.push("/dashboard");
      }
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center font-sans text-white">
        <p className="text-[rgba(255,255,255,0.48)] text-[15px] animate-pulse">
          Initializing terminal...
        </p>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center font-sans text-white">
        <p className="text-[rgba(255,255,255,0.48)] text-[15px]">
          Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#09090B] text-white flex font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#0E0E11] border-r border-[rgba(255,255,255,0.06)] h-full shrink-0 select-none">
        {/* Logo Section */}
        <div className="h-[72px] px-8 flex items-center gap-sm border-b border-[rgba(255,255,255,0.06)] shrink-0">
          <ShieldCheck className="w-6 h-6 text-red-500" />
          <span className="text-[16px] font-semibold tracking-[-0.03em] uppercase text-red-400">
            Zeus Admin
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto scrollbar-none">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-md px-4 py-2.5 rounded-[14px] text-[14px] transition-all duration-200 relative group font-medium ${
                  isActive
                    ? "bg-[#1D1D22] text-[#FFFFFF]"
                    : "text-[rgba(255,255,255,0.72)] hover:text-white hover:bg-[rgba(255,255,255,0.02)]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-red-500 rounded-r-md" />
                )}
                <item.icon
                  className={`w-[18px] h-[18px] transition-colors ${isActive ? "text-red-400" : "text-[rgba(255,255,255,0.48)] group-hover:text-white"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Support Link */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-sm">
          <Button
            variant="ghost"
            onClick={async () => {
              await signOut();
              router.push("/sign-in");
            }}
            className="w-full text-xs h-9 justify-start text-[rgba(255,255,255,0.72)] hover:text-red-400 hover:bg-red-500/10 rounded-[12px]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Exit Terminal
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[280px] bg-[#0E0E11] border-r border-[rgba(255,255,255,0.06)] z-50 flex flex-col lg:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[72px] px-8 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-sm">
            <ShieldCheck className="w-6 h-6 text-red-500" />
            <span className="text-[16px] font-semibold tracking-[-0.03em] uppercase text-red-400">
              Zeus Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-md px-4 py-2.5 rounded-[14px] text-[14px] transition-all duration-200 relative group font-medium ${
                  isActive
                    ? "bg-[#1D1D22] text-[#FFFFFF]"
                    : "text-[rgba(255,255,255,0.72)] hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-[18px] h-[18px] ${isActive ? "text-red-400" : "text-[rgba(255,255,255,0.48)]"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <Button
            variant="ghost"
            onClick={async () => {
              await signOut();
              router.push("/sign-in");
            }}
            className="w-full text-xs h-9 justify-start text-[rgba(255,255,255,0.72)] hover:text-red-400 hover:bg-red-500/10 rounded-[12px]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Exit Terminal
          </Button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-[72px] border-b border-[rgba(255,255,255,0.06)] px-8 flex items-center justify-between lg:justify-end sticky top-0 bg-[#09090B]/80 backdrop-blur-md z-30 select-none">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-md">
            <span className="text-[13px] font-semibold text-zinc-400">
              Session:{" "}
              <span className="text-red-400 uppercase">SYSTEM ADMIN</span>
            </span>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto p-lg">{children}</main>
      </div>
    </div>
  );
}
