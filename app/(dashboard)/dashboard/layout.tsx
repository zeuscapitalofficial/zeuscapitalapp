"use client";

import {
  ArrowLeftRight,
  Bell,
  ChevronRight,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/ui/logo";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "Deposit & Withdraw",
    icon: ArrowLeftRight,
    href: "/dashboard/deposit-withdraw",
  },
  { label: "History", icon: History, href: "/dashboard/history" },
  { label: "Packages", icon: Package, href: "/dashboard/packages" },
  { label: "Signals", icon: TrendingUp, href: "/dashboard/signals" },
  { label: "AML/KYC", icon: ShieldCheck, href: "/dashboard/kyc" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "Help & Support", icon: HelpCircle, href: "/dashboard/help" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Failed to load notifications");
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "POST" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("All alerts marked as read.");
      }
    } catch (e) {
      console.error("Failed to mark notifications as read");
    }
  };

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center font-sans">
        <p className="text-[rgba(255,255,255,0.48)] text-[15px] animate-pulse">
          Initializing terminal...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center font-sans">
        <p className="text-[rgba(255,255,255,0.48)] text-[15px]">
          Redirecting...
        </p>
      </div>
    );
  }

  const user = session.user;

  // Breadcrumbs title helper
  const activeLabel =
    navItems.find((item) => item.href === pathname)?.label || "Overview";

  return (
    <div className="h-screen w-screen bg-[#09090B] text-white flex font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#0E0E11] border-r border-[rgba(255,255,255,0.06)] h-full shrink-0 select-none">
        {/* Logo Section */}
        <div className="h-[72px] px-8 flex items-center gap-sm border-b border-[rgba(255,255,255,0.06)] shrink-0">
          <LogoIcon className="w-6 h-6 text-[#8B7CFF]" />
          <span className="text-[18px] font-semibold tracking-[-0.03em] uppercase">
            Zeus Capital
          </span>
        </div>

        {/* Navigation Items (Scrollable sub-area) */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
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
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-[#8B7CFF] rounded-r-md" />
                )}
                <item.icon
                  className={`w-[18px] h-[18px] transition-colors ${isActive ? "text-[#8B7CFF]" : "text-[rgba(255,255,255,0.48)] group-hover:text-white"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Verification Status Card */}
        <div className="mx-4 mb-6 p-4 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[16px] flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
              KYC Status
            </span>
            <Badge variant="destructive" className="text-[13px] font-semibold">
              Unverified
            </Badge>
          </div>
          <p className="text-[12px] text-[rgba(255,255,255,0.72)] leading-relaxed">
            Verify identity to unlock mining contracts and higher withdrawal
            limits.
          </p>
          <Link href="/dashboard/kyc" className="w-full">
            <Button className="w-full text-[11px] h-8 bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white font-semibold rounded-[10px] p-0">
              Verify Account
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[280px] bg-[#0E0E11] border-r border-[rgba(255,255,255,0.06)] z-50 flex flex-col transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[72px] px-6 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] shrink-0">
          <div className="flex items-center gap-sm">
            <LogoIcon className="w-6 h-6 text-[#8B7CFF]" />
            <span className="text-[18px] font-semibold tracking-[-0.03em] uppercase">
              Zeus Capital
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[rgba(255,255,255,0.72)] hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-md px-4 py-3 rounded-[14px] text-[15px] font-medium transition-all ${
                  isActive
                    ? "bg-[#1D1D22] text-[#FFFFFF]"
                    : "text-[rgba(255,255,255,0.72)] hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-[#8B7CFF]" : "text-[rgba(255,255,255,0.48)]"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Verification Status Card Mobile */}
        <div className="mx-4 mb-6 p-4 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[16px] flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[rgba(255,255,255,0.48)] font-semibold uppercase tracking-wider">
              KYC Status
            </span>
            <span className="inline-flex items-center gap-xs px-2 py-0.5 rounded-[99px] text-[10px] font-semibold bg-amber-500/10 text-amber-400">
              Unverified
            </span>
          </div>
          <p className="text-[12px] text-[rgba(255,255,255,0.72)] leading-relaxed">
            Verify identity to unlock mining contracts and higher withdrawal
            limits.
          </p>
          <Link
            href="/dashboard/kyc"
            className="w-full"
            onClick={() => setMobileOpen(false)}
          >
            <Button className="w-full text-[11px] h-8 bg-[#8B7CFF] hover:bg-[#7A6BEA] text-white font-semibold rounded-[10px] p-0">
              Verify Account
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[72px] border-b border-[rgba(255,255,255,0.06)] px-6 lg:px-8 flex items-center justify-between sticky top-0 bg-[#09090B]/80 backdrop-blur-md z-30 select-none shrink-0">
          {/* Breadcrumbs & Mobile toggle */}
          <div className="flex items-center gap-md">
            <button
              className="lg:hidden text-[rgba(255,255,255,0.72)] hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-xs text-[14px] font-medium">
              <span className="text-[rgba(255,255,255,0.48)]">Console</span>
              <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.3)]" />
              <span className="text-white">{activeLabel}</span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-md">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-xs bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[12px] px-3 py-1.5 w-[220px]">
              <Search className="w-4 h-4 text-[rgba(255,255,255,0.48)]" />
              <input
                type="text"
                placeholder="Search command..."
                className="bg-transparent border-none text-[13px] text-white focus:outline-none placeholder-[rgba(255,255,255,0.3)] w-full"
              />
            </div>

            {/* Notification bell with dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserDropdown(false);
                }}
                className="w-10 h-10 rounded-[12px] border border-[rgba(255,255,255,0.06)] hover:bg-[#1D1D22] flex items-center justify-center text-[rgba(255,255,255,0.72)] hover:text-white transition-colors relative"
              >
                <Bell className="w-[18px] h-[18px]" />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8B7CFF]" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-[-48px] sm:right-0 top-[52px] w-[320px] bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] shadow-2xl p-md z-50 flex flex-col gap-sm text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-[rgba(255,255,255,0.04)]">
                    <span className="text-[13px] font-semibold text-white">
                      Notifications
                    </span>
                    {notifications.some((n) => !n.isRead) && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#8B7CFF] hover:underline cursor-pointer font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto scrollbar-none">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className="p-2 hover:bg-[rgba(255,255,255,0.02)] rounded-[10px] flex items-start gap-sm transition-all"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                            !n.isRead 
                              ? n.type === "DEPOSIT"
                                ? "bg-green-500"
                                : n.type === "WARNING"
                                  ? "bg-amber-400"
                                  : n.type === "SECURITY"
                                    ? "bg-red-500"
                                    : "bg-[#8B7CFF]"
                              : "bg-[rgba(255,255,255,0.12)]"
                          }`} />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className={`text-[12px] font-semibold ${!n.isRead ? "text-white" : "text-zinc-500"}`}>
                              {n.title}
                            </span>
                            <span className="text-[11px] text-[rgba(255,255,255,0.48)] break-words leading-normal font-medium">
                              {n.message}
                            </span>
                            <span className="text-[9px] text-[rgba(255,255,255,0.3)] mt-0.5">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-[12px] text-zinc-500 text-center py-4 font-semibold">
                        No new notifications.
                      </span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-[rgba(255,255,255,0.04)] text-center">
                    <Link
                      href="/dashboard/help"
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] text-[rgba(255,255,255,0.48)] hover:text-white font-semibold block w-full"
                    >
                      View Support Center
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User profile dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-sm hover:opacity-85 transition-opacity"
              >
                <div className="w-10 h-10 rounded-[12px] bg-[#1D1D22] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[14px] font-semibold text-[#8B7CFF] shrink-0">
                  {user.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline text-[13px] font-semibold text-white select-none max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-[52px] w-[200px] bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-[20px] shadow-2xl p-md z-50 flex flex-col gap-xs text-left">
                  {/* User Details */}
                  <div className="px-2.5 py-1.5 flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-white truncate">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-[rgba(255,255,255,0.48)] truncate mt-0.5">
                      {user.email}
                    </span>
                  </div>
                  <div className="h-[1px] bg-[rgba(255,255,255,0.06)] my-xs w-full" />
                  {/* Links */}
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-sm px-2.5 py-2 rounded-[10px] text-[13px] text-[rgba(255,255,255,0.72)] hover:text-white hover:bg-[rgba(255,255,255,0.02)] font-semibold transition-all"
                  >
                    <Settings className="w-4 h-4 text-[rgba(255,255,255,0.48)]" />{" "}
                    Settings
                  </Link>
                  <button
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await signOut();
                      router.push("/sign-in");
                    }}
                    className="flex items-center gap-sm px-2.5 py-2 rounded-[10px] text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold text-left w-full transition-all"
                  >
                    <LogOut className="w-4 h-4 text-[rgba(255,255,255,0.48)]" />{" "}
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Wrapper (Locks scroll internally) */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto text-white bg-[#09090B]">
          {children}
        </main>
      </div>
    </div>
  );
}
