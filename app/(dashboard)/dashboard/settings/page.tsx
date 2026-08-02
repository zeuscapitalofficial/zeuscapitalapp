"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import {
  Bell,
  Shield,
  ShieldAlert,
  User,
  Users,
  Wallet,
  Settings as SettingsIcon,
} from "lucide-react";
import { AddressSettings } from "./components/AddressSettings";
import { KYCStatusBanner } from "./components/KYCStatusBanner";
import { NotificationsSettings } from "./components/NotificationsSettings";
import { PreferencesSettings } from "./components/PreferencesSettings";
import { PrivacySettings } from "./components/PrivacySettings";
import { ProfileSettings } from "./components/ProfileSettings";
import { ReferralSettings } from "./components/ReferralSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { WalletSettings } from "./components/WalletSettings";

type TabType = "account" | "security" | "wallet" | "referral" | "notifications" | "privacy";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [kycDismissed, setKycDismissed] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (!hash) return;
      if (hash === "preferences" || hash === "profile" || hash === "account") {
        setActiveTab("account");
        if (hash === "preferences") {
          setTimeout(() => {
            const el = document.getElementById("preferences-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else if (hash === "security") {
        setActiveTab("security");
      } else if (hash === "billing" || hash === "wallet") {
        setActiveTab("wallet");
      } else if (hash === "referral") {
        setActiveTab("referral");
      } else if (hash === "notifications") {
        setActiveTab("notifications");
      } else if (hash === "privacy") {
        setActiveTab("privacy");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleTabChange = (val: string) => {
    const tab = val as TabType;
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
  };

  const tabs = [
    { id: "account", label: "Account & Profile", icon: User },
    { id: "security", label: "Security & Login", icon: Shield },
    { id: "wallet", label: "Wallet & Payments", icon: Wallet },
    { id: "referral", label: "Referral Program", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Data", icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <SettingsIcon className="size-7 text-accent-foreground" />
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your personal profile, security credentials, withdrawal wallets, and system preferences.
          </p>
        </div>
      </div>

      {/* KYC Status Banner */}
      {!kycDismissed && (
        <KYCStatusBanner onDismiss={() => setKycDismissed(true)} />
      )}

      {/* Navigation Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full flex flex-col gap-6"
      >
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-lg bg-card p-1 text-muted-foreground border border-border min-w-full sm:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent-foreground data-[state=active]:text-background data-[state=active]:shadow-xs gap-1.5 cursor-pointer"
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Account & Profile Tab */}
        <TabsContent value="account" className="space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <ProfileSettings />
            <AddressSettings />
          </div>
          <div id="preferences-section">
            <PreferencesSettings />
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="m-0">
          <SecuritySettings />
        </TabsContent>

        {/* Wallet & Payments Tab */}
        <TabsContent value="wallet" className="m-0">
          <WalletSettings />
        </TabsContent>

        {/* Referral Program Tab */}
        <TabsContent value="referral" className="m-0">
          <ReferralSettings />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="m-0">
          <NotificationsSettings />
        </TabsContent>

        {/* Privacy & Data Tab */}
        <TabsContent value="privacy" className="m-0">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
