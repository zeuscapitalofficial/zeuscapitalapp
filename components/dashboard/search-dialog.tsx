"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  ActivityIcon,
  Bell,
  Coins,
  CreditCard,
  Gift,
  HelpCircle,
  History,
  LayoutDashboard,
  MessageSquare,
  Package,
  PlusCircle,
  Shield,
  ShieldCheck,
  TrendingUp,
  User,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const { t } = useTranslation();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Global Platform Search" description="Search pages, settings, actions, and crypto assets">
      <CommandInput placeholder="Search pages, settings, crypto assets, actions... (Cmd+K)" />
      <CommandList className="max-h-96">
        <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
          No results found for your search query.
        </CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect("/dashboard/deposit-withdraw")}>
            <PlusCircle className="mr-2 size-4 text-emerald-500" />
            <span>Quick Deposit Capital</span>
            <CommandShortcut>Action</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/deposit-withdraw")}>
            <CreditCard className="mr-2 size-4 text-accent-foreground" />
            <span>Withdraw Funds</span>
            <CommandShortcut>Action</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard?openChat=true")}>
            <MessageSquare className="mr-2 size-4 text-sky-500" />
            <span>Contact Live Support Chat</span>
            <CommandShortcut>Support</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Dashboard Navigation */}
        <CommandGroup heading="Pages & Features">
          <CommandItem onSelect={() => handleSelect("/dashboard")}>
            <LayoutDashboard className="mr-2 size-4 text-foreground" />
            <span>Overview Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/deposit-withdraw")}>
            <CreditCard className="mr-2 size-4 text-foreground" />
            <span>Deposit & Withdraw</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/history")}>
            <History className="mr-2 size-4 text-foreground" />
            <span>Transaction Ledger & History</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/packages")}>
            <Package className="mr-2 size-4 text-foreground" />
            <span>Packages & ASIC Mining Plans</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/signals")}>
            <TrendingUp className="mr-2 size-4 text-foreground" />
            <span>Trading Signals</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/rewards")}>
            <Gift className="mr-2 size-4 text-foreground" />
            <span>Rewards Hub & Quests</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/trading-bots")}>
            <ActivityIcon className="mr-2 size-4 text-foreground" />
            <span>Automated Trading Bots</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/kyc")}>
            <ShieldCheck className="mr-2 size-4 text-foreground" />
            <span>AML / KYC Verification</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/help")}>
            <HelpCircle className="mr-2 size-4 text-foreground" />
            <span>Help Center & FAQs</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Settings & Preferences */}
        <CommandGroup heading="Settings & Account">
          <CommandItem onSelect={() => handleSelect("/dashboard/settings#account")}>
            <User className="mr-2 size-4 text-muted-foreground" />
            <span>Account & Profile Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/settings#security")}>
            <Shield className="mr-2 size-4 text-muted-foreground" />
            <span>Security & Active Sessions</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/settings#wallet")}>
            <Coins className="mr-2 size-4 text-muted-foreground" />
            <span>Saved Wallet Payment Methods</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/settings#referral")}>
            <Users className="mr-2 size-4 text-muted-foreground" />
            <span>Referral Program & Links</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/settings#notifications")}>
            <Bell className="mr-2 size-4 text-muted-foreground" />
            <span>Notification Preferences & DND</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Supported Assets */}
        <CommandGroup heading="Supported Assets & Rates">
          <CommandItem onSelect={() => handleSelect("/dashboard/deposit-withdraw")}>
            <div className="size-2 rounded-full bg-amber-500 mr-2" />
            <span>Bitcoin (BTC) — $68,500.00 USD</span>
            <CommandShortcut className="font-mono">BTC</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/deposit-withdraw")}>
            <div className="size-2 rounded-full bg-emerald-500 mr-2" />
            <span>Tether (USDT) — $1.00 USD</span>
            <CommandShortcut className="font-mono">USDT</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/deposit-withdraw")}>
            <div className="size-2 rounded-full bg-sky-500 mr-2" />
            <span>USD Coin (USDC) — $1.00 USD</span>
            <CommandShortcut className="font-mono">USDC</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/dashboard/deposit-withdraw")}>
            <div className="size-2 rounded-full bg-purple-500 mr-2" />
            <span>Solana (SOL) — $185.00 USD</span>
            <CommandShortcut className="font-mono">SOL</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
