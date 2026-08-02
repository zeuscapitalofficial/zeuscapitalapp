"use client";

import { AppShell } from "@/components/layout/admin/app-shell";
import { LogoIcon } from "@/components/ui/logo";
import { useSession } from "@/lib/auth-client";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  Cpu,
  FolderCheck,
  History,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const adminNavItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "User Registry", icon: Users, href: "/admin/users" },
  { label: "KYC Queue", icon: FolderCheck, href: "/admin/kyc" },
  { label: "Mining Clusters", icon: Cpu, href: "/admin/mining" },
  { label: "Coin Pricing", icon: Coins, href: "/admin/prices" },
  { label: "Ledger Registry", icon: History, href: "/admin/transactions" },
  { label: "Deposits & Withdrawals", icon: ArrowDownCircle, href: "/admin/deposits" },
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
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-[25px] shimmer shimmer-color-accent-foreground flex flex-col items-center gap-2">
          <LogoIcon size={75} className="animate-pulse" />
          Loading&hellip;
        </p>
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-[15px] shimmer shimmer-color-accent-foreground flex flex-col items-center gap-2">
          <LogoIcon size={75} className="animate-pulse" />
          Redirecting...
        </p>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
