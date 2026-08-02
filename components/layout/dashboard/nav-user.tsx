"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  UserIcon,
  LifeBuoyIcon,
  CreditCardIcon,
  LogOutIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  role: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function NavUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="rounded-full cursor-pointer outline-none ring-2 ring-border hover:ring-accent-foreground/40 transition-all"
          >
            <Avatar className="size-8">
              {loading ? (
                <Skeleton className="size-8 rounded-full" />
              ) : (
                <>
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-accent-foreground/10 text-accent-foreground font-semibold text-sm">
                    {user ? getInitials(user.name) : "?"}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        {/* User Header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 p-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name} />
              <AvatarFallback className="bg-accent-foreground/10 text-accent-foreground font-bold">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              {loading ? (
                <>
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-36" />
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground text-sm block truncate">
                    {user?.name}
                  </span>
                  <span className="text-muted-foreground text-xs block truncate">
                    {user?.email}
                  </span>
                  {/* Email Verified Badge */}
                  {user?.emailVerified ? (
                    <Badge className="mt-1 h-5 px-1.5 text-[10px] font-semibold gap-1 bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/15">
                      <ShieldCheckIcon className="size-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="mt-1 h-5 px-1.5 text-[10px] font-semibold gap-1 bg-amber-500/15 text-amber-600 border border-amber-500/30 hover:bg-amber-500/15">
                      <ShieldAlertIcon className="size-3" />
                      Unverified
                    </Badge>
                  )}
                </>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/dashboard/settings#account">
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon />
              Profile & Account
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/dashboard/kyc">
            <DropdownMenuItem className="cursor-pointer">
              <ShieldCheckIcon />
              AML / KYC
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings#wallet">
            <DropdownMenuItem className="cursor-pointer">
              <CreditCardIcon />
              Wallet & Payments
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/help">
            <DropdownMenuItem className="cursor-pointer">
              <LifeBuoyIcon />
              Help Center
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
